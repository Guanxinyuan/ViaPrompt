import { cancelSubscription } from "@/lib/paypal";
import { supabaseClient } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { subscriptionId } = req.body;
            await cancelSubscription(subscriptionId);
            console.log("Subscription cancelled:", subscriptionId);

            // update subscription status in Supabase to CANCELLED
            try {
                const { data, error } = await supabaseClient
                    .from('subscriptions')
                    .update({ status: 'CANCELLED' })
                    .eq('subscription_id', subscriptionId);

                if (error) {
                    throw error;
                }
                console.log("Subscription cancelled in Supabase");
            } catch (error) {
                throw new Error(`Error canceling subscription in Supabase: ${error.message}`);
            }

            res.status(200).json({ success: true, data: subscriptionId });
        } catch (error) {
            console.error("Error in cancel-subscription handler:", error);
            res.status(500).json({ success: false, message: "Error in cancel-subscription handler " + error.message });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
