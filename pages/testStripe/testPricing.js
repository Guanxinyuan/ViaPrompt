import { useSupabaseClient, useUser, useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useSubscription } from "@/context/SubscriptionContext";
import initStripe from "stripe";

export default function testPricing({ plans }) {
    const user = useUser();
    const session = useSession();
    const { subscription, isLoading } = useSubscription();

    const processSubscription = async (planId) => {
        const response = await fetch(`/api/subscription/${planId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
        });
        const result = await response.json();
        if (!result.success) {
            console.error('Error creating checkout session:', result.error);
            return;
        }

        console.log('subscriptions: ', result.data)
    }

    const showSubscribeButton = !!user && !subscription
    const showCreateAccountButton = !user
    const showManageSubscriptionButton = !!user
    return (
        <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
            {
                plans.map((plan) => (
                    <div key={plan.id} className="w-80 w-40 rounded shadow px-6 py-4">
                        <h2 className="text-xl">{plan.name}</h2>
                        <p className="text-zinc-500">${plan.price / 100} / {plan.interval}</p>
                        {
                            !isLoading &&
                            <div>
                                {showSubscribeButton && <button className="bg-zinc-500 text-white rounded px-4 py-2" onClick={() => processSubscription(plan.id)}>Subscribe</button>}
                                {showCreateAccountButton && <button className="bg-zinc-500 text-white rounded px-4 py-2" onClick={() => processSubscription(plan.id)}> Create Account</button>}
                                {showManageSubscriptionButton && <button className="bg-zinc-500 text-white rounded px-4 py-2" onClick={() => processSubscription(plan.id)}>Manage Subscription</button>}
                            </div>
                        }
                    </div>
                ))
            }
        </div >
    )
}

export const getStaticProps = async () => {
    const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET);
    const { data: prices } = await stripe.prices.list()

    const plans = await Promise.all(prices.map(async (price) => {
        const product = await stripe.products.retrieve(price.product);
        return {
            id: price.id,
            name: product.name,
            price: price.unit_amount,
            currency: price.currency,
            interval: price.recurring.interval,
        }
    }))

    return {
        props: {
            plans,
        },
    };
}