// pages/subscription.js
import PaymentModal from '@/components/PaymentModal';
import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';
import { subscriptionInfos } from '@/config';
import { useSubscription } from '@/context/SubscriptionContext';

export default function UpgradePage() {

    return (
        <Fragment>
            <Head>
                <title>Pricing & Plans</title>
                <meta name="description" content="Choose the perfect subscription plan for your needs" />
            </Head>

            <div className="w-full min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className='w-2/3 mx-auto'>
                    <div className='subscription-header'>
                        <h1 className="text-3xl font-extrabold text-black dark:text-white">Choose a Plan</h1>
                        <p className="text-zinc-500">Select the perfect subscription plan for your needs.</p>
                    </div>

                    <div className={`mt-10 grid gap-5 
                        ${Object.keys(subscriptionInfos).length == 2 && "sm:grid-cols-1 lg:grid-cols-2"} 
                        ${Object.keys(subscriptionInfos).length == 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
                    >
                        {
                            Object.keys(subscriptionInfos).map((key) => {
                                return <SubscriptionCard key={key} subscriptionInfo={subscriptionInfos[key]} />
                            })
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};



export function SubscriptionCard({ subscriptionInfo }) {

    const { title, planCode, description, featureTitle, features, price, isMostPopular } = subscriptionInfo;
    const [checkout, setCheckout] = useState(false);
    const { subscription } = useSubscription();
    const status = subscription?.status;

    return (
        <div className="subscription-card-container" >
            <div className="subscription-card rounded-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="subscription-card-title">{title}</h2>
                    {
                        isMostPopular && <span className="bg-yellow-600 text-white text-xs font-semibold rounded-full px-2 py-1">Most Popular</span>
                    }
                </div>
                <div className='subscription-card-price-section'>
                    <p className="subscription-card-price">{price}</p>
                    <span>Monthly</span>
                </div>
                <p className="subscription-card-description">{description}</p>
                <div className='flex flex-col gap-4'>
                    <p className="subscription-card-feature-title">{featureTitle}</p>
                    <ul className="subscription-card-feature-section">
                        {
                            features.map((feature, index) => {
                                return <li key={index}>{feature}</li>
                            })
                        }
                    </ul>
                    {
                        subscription?.plan_code == planCode && status == 'ACTIVE' ?
                            <button
                                className="text-yellow-500 font-bold py-2 px-4 mt-6" disabled>Current Plan</button>
                            :
                            planCode != "palaxy-000" ?
                                <button
                                    className="subscription-card-button"
                                    onClick={() => setCheckout(true)}>Choose Plan</button>
                                :
                                <button className="text-yellow-500 font-bold py-2 px-4 mt-6 opacity-0" disabled>Curent Plan</button>

                    }
                </div>
                {
                    checkout && <PaymentModal subscriptionInfo={subscriptionInfo} onCloseModal={() => setCheckout(false)} />
                }
            </div>
        </div>
    )
}