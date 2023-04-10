import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ fundingSource, color, planCode, ...rest }) {

    const { status, updatedSubscription } = rest;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.NEXT_PUBLIC_PAYPAL_SECRET;
    const currency = 'USD'

    const createSubscription = async (data, actions) => {
        if (updatedSubscription && status && (status === 'ACTIVE' || status === 'SUSPENDED')) {

            // if subscription exists, revise it by chaning the plan id
            return actions.subscription.revise(subscriptionId, {
                "plan_id": "NEW_SUBSCRIPTION_PLAN_ID"
            });
        } else {
            return actions.subscription.create({
                plan_id: "P-79633757P1179854LMQVKV3A",
            });
        }
    }

    const onApprove = async (data, actions) => {
        const subscription = await actions.subscription.get();
        console.log(subscription)
        const { id, plan_id, start_time, status, create_time, update_time } = subscription;
        const { next_billing_time } = subscription.billing_info;

        const response = await fetch("/api/payment/cancel-subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                plan_id: plan_id,
                start_time: start_time,
                status: status,
                create_time: create_time,
                update_time: update_time,
                next_billing_time: next_billing_time,
                plan_code: planCode,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error approving subscription: ${response.statusText}`);
        }

        const responseData = await response.json();
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