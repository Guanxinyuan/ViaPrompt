import { useState } from "react";
import axios from "axios";
import { dummySubscription } from "@/data/subscriptions";

export default function TestFlow() {
    const [subscriptionId, setSubscriptionId] = useState("");

    const createSubscription = async () => {
        try {
            const planId = "P-79633757P1179854LMQVKV3A";
            const { data } = await axios.post("/api/payment/create-subscription", {
                planId
            });
            setSubscriptionId(data.id);
            console.log("Subscription created:", data);

            // Extract the approval URL from the links array
            const approvalUrl = data.links.find((link) => link.rel === "approve").href;

            // Redirect the user to the approval URL
            // window.location.href = approvalUrl;
        } catch (error) {
            console.error("Error creating subscription in frontend:", error);
        }
    };

    const approveSubscription = async () => {
        try {
            const { data } = await axios.post("/api/payment/approve-subscription", {
                subscriptionId,
            });
            console.log("Subscription approved:", data);
        } catch (error) {
            console.error("Error approving subscription in frontend:", error);
        }
    };

    const upgradeSubscription = async () => {
        try {
            const newPlanId = "P-7EU59045RN1576841MQZXFWI";
            const { data } = await axios.post("/api/payment/upgrade-subscription", {
                subscriptionId,
                newPlanId,
            });
            console.log("Subscription upgraded:", data);
        } catch (error) {
            console.error("Error upgrading subscription in frontend:", error);
        }
    };

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

            if (!response.ok) {
                throw new Error(`Error canceling subscription: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data)
            console.log("Subscription canceled:", data.subscriptionId);
        } catch (error) {
            console.error("Error canceling subscription in frontend:", error);
        }
    };

    const { id, plan_id, start_time, status, create_time, update_time } = dummySubscription;
    const { next_billing_time } = dummySubscription.billing_info;

    // Include the "Approve Subscription" button in the component's return statement:
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <button onClick={createSubscription}>
                Create Subscription
            </button>
            <button onClick={approveSubscription} disabled={!subscriptionId}>
                Approve Subscription
            </button>
            <button onClick={upgradeSubscription} disabled={!subscriptionId}>
                Upgrade Subscription
            </button>
            <button onClick={cancelSubscription} disabled={!subscriptionId}>
                Cancel Subscription
            </button>
            <div>
                <p>id: {id}</p>
                <p>plan_id: {plan_id}</p>
                <p>start_time: {start_time}</p>
                <p>status: {status}</p>
                <p>create_time: {create_time}</p>
                <p>update_time: {update_time}</p>
                <p>next_billing time: {next_billing_time}</p>
            </div>
        </div>
    );
}
