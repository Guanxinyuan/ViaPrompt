import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

export default function SubscriptionPanel() {

    const router = useRouter();
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [status, setStatus] = useState('Inactive');
    const [currentPlan, setCurrentPlan] = useState('Basic');
    const [renewalDate, setRenewalDate] = useState('May 1, 2023');
    const [paymentMethods, setPaymentMethods] = useState(
        [
            {
                method: 'PayPal',
            },
            {
                method: 'Visa **** **** **** 5678',
            }
        ]
    );
    const [invoiceHistory, setInvoiceHistory] = useState([
        { id: '001', date: '2023-04-01', amount: '$19.99' },
        { id: '002', date: '2023-03-01', amount: '$19.99' },
        { id: '003', date: '2023-02-01', amount: '$19.99' },
    ]);
    const subscriptionInfos = {
        'Basic': {
            title: 'Basic',
            price: '$10',
        },
        'Premium': {
            title: 'Premium',
            price: '$25',
        },
        'Pro': {
            title: 'Pro',
            price: '$50',
        }
    }

    const handlePlanChange = () => {
        // handle changing plan here
        router.push('/pricing')
    };

    const managePaymentMethod = async () => {
        // handle payment method here
        alert('Start managing payment method')
    }

    const addPaymentMethod = async () => {
        // handle adding payment method here
        alert('Start addinf payment method')
    }

    const cancelSubscription = async () => {
        // handle canceling subscription here
        setIsSubscribed(false)
    }

    const resumeSubscription = async () => {
        // handle resuming subscription here
        setIsSubscribed(true)
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
                                <p className=''><span className=' font-bold text-xl'>{currentPlan}</span></p>

                                {
                                    isSubscribed ?
                                        <button
                                            className="settings-panel-button rounded-lg"
                                            onClick={handlePlanChange}
                                        >
                                            Change Plan
                                        </button>
                                        :
                                        <button
                                            className="settings-panel-button bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                            onClick={handlePlanChange}
                                        >
                                            Upgrade To Pro
                                        </button>
                                }
                            </div>
                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Status</label>
                            {
                                status == "Active" && <p className={`settings-panel-value w-fit px-2 py-0.5 text-white dark:text-white rounded-lg bg-green-400 dark:bg-green-400`}>Active</p>
                            }
                            {
                                status == "Inactive" && <p className={`settings-panel-value w-fit px-2 py-0.5 text-white dark:text-white rounded-lg bg-purple-500 dark:bg-purple-500`}>Inactive</p>
                            }
                        </div>
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Renewal At</label>
                            <p className='settings-panel-value'>{renewalDate}</p>
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
                            {/* <p
                                className='settings-panel-text-button text-sm'
                                onClick={addPaymentMethod}
                            >+ Add payment method</p> */}
                        </div>
                        {
                            isSubscribed &&
                            <button
                                className="settings-panel-button w-fit bg-red-500 hover:bg-red-600 rounded-lg"
                                onClick={cancelSubscription}
                            >
                                Suspend Subscription
                            </button>
                        }

                    </div>

                    <div className="settings-panel-body col-span-3">
                        <div className="settings-panel-item">
                            <label className="settings-panel-label">Invoice History</label>
                            <ul className="settings-panel-value list-disc list-inside">
                                {invoiceHistory.map((invoice) => (
                                    <li key={invoice.id}>
                                        {invoice.date} - {invoice.amount}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

