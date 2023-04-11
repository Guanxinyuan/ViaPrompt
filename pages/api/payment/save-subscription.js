// pages/api/save-subscription.js

import { supabaseClient } from "@/lib/supabase";

export default async function saveSubscription(req, res) {
    if (req.method === 'POST') {
        const {
            subscription_id,
            start_time,
            next_billing_time,
            status,
            update_time,
            created_time,
            plan_code,
            user_id,
        } = req.body;

        const subscriptionInfo = {
            subscription_id: subscription_id,
            start_time: start_time,
            end_time: next_billing_time,
            status: status,
            updated_at: new Date().toISOString(),
            created_at: created_time,
            plan_code: plan_code,
            user_id: user_id,
        };
        console.log('subscriptionInfo', subscriptionInfo);

        try {
            const { data, error } = await supabaseClient
                .from('subscriptions')
                .upsert(subscriptionInfo, {
                    conflict_target: 'subscription_id',
                    conflict_action: 'update',
                    update_columns: [
                        'start_time',
                        'end_time',
                        'status',
                        'plan_code',
                        'updated_at',
                    ],
                })
                .select();

            if (error) {
                throw error;
            }

            console.log('Save success');
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.log('Error in save-subscription: ', error);
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
