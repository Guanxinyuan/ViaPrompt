// /api/payment/testPayment is used to test a ton of paypal test cases
import { supabaseClient } from '@/lib/supabase';
const fetch = require('node-fetch');

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const paypalSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET;

export const config = {
    runtime: 'edge'
};


export default async function handler(req, res) {
    if (req.method == 'POST') {
        const { subscriptionInfo } = JSON.parse(await req.text())
        console.log('subscriptionInfo', subscriptionInfo)

        //test 1: insert a new subscription
        await saveSubscriptionInfo(subscriptionInfo, 'subscriptions')

        //test 2: update an existing subscription

        await saveSubscriptionInfo(subscriptionInfo, 'subscriptions')

        //test 3: delete an existing subscription
        cancelSubscription(subscriptionInfo.subscription_id)
        await deleteSubscriptionInfo(subscriptionInfo, 'subscriptions')
    }
}

const saveSubscriptionInfo = async (subscriptionInfo, table) => {
    console.log('subscriptionInfo', subscriptionInfo)
    const { data, error } = await supabaseClient
        .from(table)
        .insert(subscriptionInfo)
        .onConflict('id')
        .merge(
            {
                'start_time': subscriptionInfo.start_time,
                'end_time': subscriptionInfo.end_time,
                'status': subscriptionInfo.status,
                'plan_code': subscriptionInfo.plan_code, // plan_code is a custom state passed when user select the plan
                'updated_at': subscriptionInfo.updated_at // data.status_update_time
            }
        )
    if (error) {
        console.log('Error:', error);
        throw new Error(error.message);
    }
    console.log('Save success');
}


const deleteSubscriptionInfo = async (subscriptionInfo, table) => {
    const { data, error } = await supabaseClient
        .from(table)
        .delete()
        .eq('subscription_id', subscriptionInfo.subscription_id)
    if (error) {
        console.log('Error:', error);
        throw new Error(error.message);
    }
    console.log('Delete success');
}

