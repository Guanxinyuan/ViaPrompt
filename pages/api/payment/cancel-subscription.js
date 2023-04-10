import { cancelSubscription } from "@/lib/paypal";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { subscriptionId } = req.body;
            await cancelSubscription(subscriptionId);
            console.log("Subscription cancelled:", subscriptionId);
            res.status(200).json({ subscriptionId });
        } catch (error) {
            console.error("Error in handler:", error);
            res.status(500).json({ message: "Error canceling subscription", error: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}