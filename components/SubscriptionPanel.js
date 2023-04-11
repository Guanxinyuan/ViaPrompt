import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useSubscription } from '@/context/SubscriptionContext';
import { subscriptionInfos } from '@/config/index';
import { convertISOToDate } from '@/utils/frontend';
import { useUser } from '@supabase/auth-helpers-react';

export default function SubscriptionPanel() {

    const router = useRouter();
    const user = useUser();
    const { subscription } = useSubscription();

    const subscriptionId = subscription?.subscription_id;
    const currentPlan = subscriptionInfos[subscription?.plan_code]?.title
    const status = subscription?.status;
    const startDate = convertISOToDate(subscription?.start_time);
    const endDate = convertISOToDate(subscription?.end_time);

    const [paymentMethods, setPaymentMethods] = useState(
        [{ method: 'PayPal' }]
    );
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        if (subscription && user.id) {
            const fetchPayPalHistory = async () => {
                const invoices = await getPayPalHistory(user.id);
                setInvoices(invoices);
            };
            fetchPayPalHistory();
        }
    }, [subscription]);

    const getPayPalHistory = async (subscriptionId) => {
        try {
            const response = await fetch(`/api/payment/get-history?subscription_id=${subscriptionId}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            return data.data
        } catch (err) {
            console.error('Error fetching invoices:', err);
            throw err;
        }
    };


    const handlePlanChange = () => {
        // handle changing plan here
        router.push('/pricing')
    };

    const managePaymentMethod = async () => {
        // handle payment method here
        alert('Start managing payment method')
    }

    const cancelSubscription = async () => {
        try {
            console.log("subscriptionId in cancelSubscription:", subscriptionId);
            const response = await fetch("/api/payment/cancel-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionId }),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(`Error canceling subscription: ${response.statusText}`);
            }

            console.log(result.data)
            console.log("Subscription canceled:", result.data);
        } catch (error) {
            console.error("Error canceling subscription in frontend:", error);
        }
    }

    return (
        <Fragment>

            <div className="settings-panel">
                <h2 className="settings-title">Subscription</h2>
                <div className='flex flex-col gap-6'>

                    <div className="settings-panel-body col-span-2">
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Current Plan</label>
                            <div className='settings-panel-value flex flex-row justify-between items-center'>
                                <p className=''><span className=' font-bold text-base'>{currentPlan}</span></p>

                                {
                                    status == 'ACTIVE' ?
                                        <button
                                            className="settings-panel-button rounded-lg"
                                            onClick={handlePlanChange}
                                        >
                                            Change Plan
                                        </button>
                                        :
                                        <button
                                            className="settings-panel-button rounded-lg bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                            onClick={handlePlanChange}
                                        >
                                            Upgrade To Pro
                                        </button>
                                }
                            </div>
                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Status</label>
                            <p className={`settings-panel-value w-fit px-2 py-0.5 text-white dark:text-white rounded-lg 
                            ${status == 'ACTIVE' ? "bg-green-500 dark:bg-green-500" : "bg-purple-500 dark:bg-purple-400"}`}>{status}</p>
                            {
                                status == 'CANCELLED' &&
                                <span className='text-white text-xs italic'>Your plan will stay active until the end of the current cycle.</span>
                            }

                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Start At</label>
                            <p className='settings-panel-value'>{startDate}</p>
                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Renewal At</label>
                            <p className='settings-panel-value'>{endDate}</p>
                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label mb-1">Payment Method</label>
                            {
                                paymentMethods.map((paymentMethod, index) => (
                                    <div key={index} className='settings-panel-value flex flex-row justify-between'>
                                        <p>{paymentMethod.method}</p>
                                        <div className='flex flex-row gap-3'>
                                            <EllipsisHorizontalIcon
                                                className='w-5 h-5 settings-panel-text-button'
                                                onClick={managePaymentMethod} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            subscription && status == 'ACTIVE' &&
                            <button
                                className="settings-panel-button w-fit bg-red-500 hover:bg-red-600 rounded-lg"
                                onClick={cancelSubscription}
                            >
                                Cancel Subscription
                            </button>
                        }
                    </div>

                    <div className="settings-panel-body col-span-3">
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Invoice History</label>
                            <div className="settings-panel-value list-disc list-inside py-2">
                                <li className='grid grid-cols-3 text-zinc-500 font-semibold mb-1'>
                                    <span>Date</span>
                                    <span>Amount</span>
                                </li>
                                {invoices.map((invoice, index) => (
                                    <li key={index} className='grid grid-cols-3'>
                                        <span>{convertISOToDate(invoice.time)}</span>
                                        <span>{invoice.amount} {invoice.currency}</span>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

