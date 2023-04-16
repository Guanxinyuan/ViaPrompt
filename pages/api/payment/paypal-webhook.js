import { supabaseClient } from "@/lib/supabaseClient";
import { verifyWebhookSignature } from '../../utils/paypalClient';

export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(req)) {
        res.status(400).send('Invalid webhook signature');
        return;
    }

    // Process the BILLING.SUBSCRIPTION.RENEWED event
    const event = req.body;
    if (event.event_type === 'BILLING.SUBSCRIPTION.RENEWED') {
        const subscriptionId = event.resource.id;
        const userId = event.resource.custom_id; // Assuming you stored user ID in the custom_id field
        const newBillingCycleDate = event.resource.billing_info.next_billing_time;

        // Update user subscription info in Supabase
        const { error } = await supabaseClient
            .from('subscriptions')
            .update({ billing_cycle_date: newBillingCycleDate })
            .eq('user_id', userId)
            .eq('subscription_id', subscriptionId);

        if (error) {
            console.error('Error updating subscription in Supabase:', error);
            res.status(500).send('Error updating subscription');
        } else {
            res.status(200).send('Subscription updated successfully');
        }
    } else {
        res.status(200).send('Unhandled event type');
    }
}
