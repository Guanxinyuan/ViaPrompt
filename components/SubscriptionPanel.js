import { Fragment, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useSubscription } from '@/context/SubscriptionContext';
import { subscriptionInfos } from '@/config/subscriptionConfig';
import { convertISOToDate } from '@/utils/frontend';
import { useUser } from '@supabase/auth-helpers-react';
import CreditUsageBar from '@/components/CreditsUsageBar';
import { supabaseClient } from '@/lib/supabase';

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

    const [creditsInfo, setCreditsInfo] = useState({
        totalFreeCredits: 0,
        freeCreditsBalance: 0,
        totalCredits: 0,
        creditsBalance: 0,
    });

    useEffect(() => {
        if (user) {
            fetchCredits();
            fetchPayPalHistory();
        }
    }, [user]);


    const fetchCredits = useCallback(async () => {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('total_free_credits, free_credits_balance, total_credits, credits_balance')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching credits:', error);
        } else {
            console.log('data:', data);
            setCreditsInfo({
                totalFreeCredits: data.total_free_credits,
                freeCreditsBalance: data.free_credits_balance,
                totalCredits: data.total_credits,
                creditsBalance: data.credits_balance,
            });
        }
    }, [user]);

    const fetchPayPalHistory = useCallback(async () => {
        try {
            const response = await fetch(`/api/payment/get-history?user_id=${user.id}`);
            const data = await response.json();

            // alert(`data: ${JSON.stringify(data)}`)

            if (!data.success) {
                throw new Error(data.message);
            }

            setInvoices(data.data);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            throw err;
        }
    }, [user]);


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

                    <div className="settings-panel-body col-span-2 px-8 py-8 gap-6">
                        <div className='text-xl mb-6 flex flex-col justify-between gap-2'>
                            <div className='flex justify-between'>
                                <p className='flex items-center'>
                                    <span className='text-black dark:text-white'>Current Plan: &nbsp;</span>
                                    <span className="font-semibold">{currentPlan}</span>
                                    <span className={`settings-panel-value w-fit px-2 py-0.5 text-white dark:text-white rounded-lg ml-2
                            ${status == 'ACTIVE' ? "bg-green-500 dark:bg-green-500" : "bg-purple-500 dark:bg-purple-400"}`}>{status?.toLowerCase()}</span>
                                </p>

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
                            {
                                status == 'CANCELLED' &&
                                <span className='text-white text-xs italic'>Your plan will stay active until the end of the current cycle.</span>
                            }
                        </div>

                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Usage</label>

                            <CreditUsageBar
                                creditsUsed={creditsInfo.totalFreeCredits - creditsInfo.freeCreditsBalance + creditsInfo.totalCredits - creditsInfo.creditsBalance}
                                totalCredits={creditsInfo.totalFreeCredits + creditsInfo.totalCredits}
                            />
                        </div>
                        <div className="settings-panel-item flex flex-row justify-between">
                            <div>
                                <label className="settings-panel-label">Start at</label>
                                <p className='settings-panel-value'>{startDate}</p>
                            </div>
                            <div>
                                <label className="settings-panel-label">Renewal at</label>
                                <p className='settings-panel-value'>{endDate}</p>
                            </div>
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

                        <div className='flex justify-end'>

                            {
                                subscription && status == 'ACTIVE' &&
                                <button
                                    className="w-fit text-red-500 hover:text-red-600 rounded-lg text-sm pt-6"
                                    onClick={cancelSubscription}
                                >
                                    Cancel Subscription
                                </button>
                            }
                        </div>
                    </div>

                    <div className="settings-panel-body col-span-3">
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Invoice History</label>
                            <div className="settings-panel-value list-disc list-inside py-2 flex flex-col gap-2">
                                <li className='grid grid-cols-3 text-zinc-500 font-semibold mb-1'>
                                    <span>Billing Date</span>
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

