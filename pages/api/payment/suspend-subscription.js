import { suspendSubscription } from "@/lib/paypal";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { subscriptionId } = req.body;
            await suspendSubscription(subscriptionId);
            console.log("Subscription cancelled (suspended):", subscriptionId);

            // update subscription status in Supabase to CANCELLED

            res.status(200).json({ success: true, data: subscriptionId });
        } catch (error) {
            console.error("Error in suspend-subscription handler:", error);
            res.status(500).json({ success: false, message: "Error in suspend-subscription handler " + error.message });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
