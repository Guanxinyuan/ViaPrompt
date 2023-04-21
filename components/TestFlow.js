import { useState } from "react";
import axios from "axios";
import { dummySubscription } from "@/data/subscriptions";
import PayPalButton from "@/components/PayPalButton";

export default function TestFlow() {
    // const [subscriptionId, setSubscriptionId] = useState("");
    const [subscriptionId, setSubscriptionId] = useState('I-ED56U6BMCNEL')
    const [operationExecuted, setOperationExecuted] = useState('')

    const cancelSubscription = async () => {
        setOperationExecuted('Cancel (suspend)')
        try {
            console.log("subscriptionId in cancelSubscription:", subscriptionId);
            const response = await fetch("/api/payment/suspend-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionId }),
            });

            const result = await response.json();
            console.log(result)

            if (!result.success) {
                throw new Error(`Error canceling subscription: ${response.statusText}`);
            }
            console.log("Subscription canceled:", result.data);
        } catch (error) {
            console.error("Error canceling subscription in frontend:", error);
        }
    };

    const resumeSubscription = async () => {
        setOperationExecuted('Resume')
        try {
            console.log("agreementId in resumeSubscription:", subscriptionId);
            const response = await fetch("/api/payment/resume-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionId }),
            });

            const result = await response.json()
            if (!result.success) {
                throw new Error(`Error resuming subscription: ${response.statusText}`);
            }
            console.log("Subscription resumed:", result.data);
        } catch (error) {
            console.error("Error resuming subscription in frontend:", error);
        }
    };

    // const { id, plan_id, start_time, status, create_time, update_time } = dummySubscription;
    // const { next_billing_time } = dummySubscription.billing_info;

    // Include the "Approve Subscription" button in the component's return statement:
    return (
        <div className="min-h-screen flex flex-col gap-6 items-center py-10">
            <div className="flex gap-6">
                <PayPalButton fundingSource={'paypal'} color={'gold'} planCode={'palaxy-001'} />
                <button
                    className="rounded-lg border w-60 py-2 dark:bg-red-500"
                    onClick={cancelSubscription}
                    disabled={!subscriptionId}>
                    Cancel Subscription (Suspend)
                </button>
                <button
                    className="rounded-lg border w-60 py-2 dark:bg-blue-500"
                    onClick={resumeSubscription}>
                    Resume Subscription
                </button>
            </div>
            <div>
                {operationExecuted}
                <span className="dark:text-zinc-400">Current subscription id: </span>{subscriptionId}
            </div>
            {/* <div>
                <p>id: {id}</p>
                <p>plan_id: {plan_id}</p>
                <p>start_time: {start_time}</p>
                <p>status: {status}</p>
                <p>create_time: {create_time}</p>
                <p>update_time: {update_time}</p>
                <p>next_billing time: {next_billing_time}</p>
            </div> */}
        </div>
    );
}
