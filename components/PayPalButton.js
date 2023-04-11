import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSubscription } from "@/context/SubscriptionContext";
import { subscriptionInfos } from "@/config";

export default function PayPalButton({ fundingSource, color, planCode, ...rest }) {

    const { status, updatedSubscription } = rest;
    const router = useRouter();
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const currency = 'USD'
    const user = useUser();
    const { subscription, setSubscription } = useSubscription();

    // useEffect(() => {
    //     console.log(subscription.plan_code, planCode, status, subscription.status)
    //     subscription && planCode != subscription.plan_code && planCode != 'palaxy-000' && (subscription.status === 'ACTIVE' || subscription.status === 'SUSPENDED') ?
    //         console.log(`revise subscription: ${subscription.plan_code} to plan: ${subscriptionInfos[planCode].planId}`) :
    //         console.log(`create subscription: ${subscriptionInfos[planCode].planId}`)
    // }, [])

    const createSubscription = async (data, actions) => {
        if (subscription && planCode != subscription.plan_code && planCode != 'palaxy-000' && (subscription.status === 'ACTIVE' || subscription.status === 'SUSPENDED')) {
            console.log(`revise subscription: ${subscription.subscription_id} to plan: ${subscriptionInfos[planCode].planId}`)
            // if subscription exists, revise it by changing the plan id
            return actions.subscription.revise(subscription.subscription_id, {
                plan_id: subscriptionInfos[planCode].planId,
            });
        } else {
            return actions.subscription.create({
                plan_id: subscriptionInfos[planCode].planId,
            });
        }
    }

    const saveSubscriptionData = async (subscriptionData) => {
        try {
            const response = await fetch('/api/payment/save-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscriptionData),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            console.log('Subscription saved successfully:', result.data);
            setSubscription(result.data)
        } catch (error) {
            console.error('Error saving subscription:', error.message);
        }
    }


    const onApprove = async (data, actions) => {
        const subscription = await actions.subscription.get();
        console.log(subscription)
        const { id, plan_id, start_time, status, create_time, update_time } = subscription;
        const { next_billing_time } = subscription.billing_info;

        await saveSubscriptionData({
            subscription_id: id,
            start_time: start_time,
            next_billing_time: next_billing_time,
            status: status,
            update_time: update_time,
            created_time: create_time,
            plan_code: planCode,
            user_id: user.id,
        });

    };

    const style = {
        layout: "vertical",
        shape: "rect",
        label: "paypal",
        color: color,
    }

    return (
        <PayPalScriptProvider options={{
            "client-id": clientId,
            "currency": currency,
            "intent": "subscription",
            "vault": true,
            "components": "buttons",
        }}>
            {/* Your component that will contain the PayPal button */}
            <PayPalButtons
                createSubscription={createSubscription}
                onApprove={onApprove}
                style={style}
                fundingSource={fundingSource}
            />

        </PayPalScriptProvider>

    )
}