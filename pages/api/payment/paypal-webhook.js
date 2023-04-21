import { updateSubscription } from "@/lib/supabase";
import { verifyWebhookSignature } from '@/lib/paypal';

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            // const isValid = await verifyWebhookSignature(req);
            const isValid = true

            if (isValid) {
                const event = req.body;
                await updateSubscription(event);
                res.status(200).json({ message: 'Webhook processed successfully' });
            } else {
                res.status(400).json({ message: 'Invalid webhook signature' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
            // res.status(200).json({ message: 'Please stop' })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
