// pages/subscription.js

import Head from 'next/head';
import { Fragment } from 'react';

export default function Upgrade() {
    const subscriptionInfos = {
        'Basic': {
            title: 'Basic',
            description: 'Ideal for smaller projects or personal websites.',
            featureTitle: 'Get started',
            features: ['2 GB Storage', '10,000 Monthly Visits', '24/7 Support'],
            price: '$10',
            isMostPopular: false
        },
        'Premium': {
            title: 'Premium',
            description: 'Ideal for larger projects or business websites.',
            featureTitle: 'Everything in Basic, plus:',
            features: ['10 GB Storage', '50,000 Monthly Visits', '24/7 Support'],
            price: '$25',
            isMostPopular: true
        },
        'Pro': {
            title: 'Pro',
            description: 'Designed for high-traffic websites or e-commerce sites.',
            featureTitle: 'Everything in Premium, plus:',
            features: ['20 GB Storage', '100,000 Monthly Visits', '24/7 Support'],
            price: '$50',
            isMostPopular: false
        }
    }

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
    const { title, description, featureTitle, features, price, isMostPopular } = subscriptionInfo;


    const onChoosePlanHandler = async () => {
        alert('navigate to choose plan page')
    }
    return (
        <div className="subscription-card-container">
            <div className="subscription-card">
                <div className="flex items-center justify-between">
                    <h2 className="subscription-card-title">{title}</h2>
                    {
                        isMostPopular && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full px-2 py-1">Most Popular</span>
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
                    <button
                        className="subscription-card-button"
                        onClick={onChoosePlanHandler}
                    >Choose Plan</button>
                </div>
            </div>
        </div>
    )
}