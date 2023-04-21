import { createClient } from '@supabase/supabase-js';
import { subscriptionInfos } from '@/config/subscriptionConfig'
import { getSubscriptionInfo } from '@/lib/paypal'
// import jwt from 'jsonwebtoken';

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseClientServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

// const createSupabaseClientForRole = (role = 'webhook-handler') => {
//     const payload = {
//         role: role,
//     }
//     const secret = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET // your Supabase JWT secret
//     const token = jwt.sign(payload, secret, { expiresIn: '1h' })

//     const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY, {
//         realtime: {
//             headers: {
//                 apikey: secret,
//             },
//             params: {
//                 apikey: token,
//             },
//         },
//     })
//     return supabase
// }

export async function updateSubscription(event) {
    const eventType = event.event_type;

    console.log('Supabase update subscription:', eventType, event.resource)

    // const subscriptionId = event.resource.id;
    const subscriptionId = 'I-ED56U6BMCNEL'
    const startTime = event.resource.start_time || event.resource.start_date;
    const endTime = event.resource?.agreement_details?.next_billing_date ?? event.resource?.billing_info?.next_billing_time;
    const status = event.resource.status;
    const planId = event.resource.plan_id;
    let planCode = 'palaxy-008'
    for (let code in subscriptionInfos) {
        if (subscriptionInfos[code].planId == planId) {
            planCode = code
        }
    }

    let userId = event.resource.custom_id // This should come with CREATED event
    let shouldUpdate = true;

    let updateData = {
        subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
        start_time: startTime,
        end_time: endTime,
        status: status,
        plan_code: planCode,
    };


    switch (eventType) {
        case 'BILLING.SUBSCRIPTION.CANCELLED':
            updateData.status = 'cancelled';
            break;
        case 'BILLING.SUBSCRIPTION.EXPIRED':
            updateData.status = 'expired';
            break;
        case 'BILLING.SUBSCRIPTION.SUSPENDED': // Map 'suspended' status to 'cancelled'
            updateData.status = 'suspended';
            break;
        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            updateData.status = 'payment_failed';
            break;
        case 'BILLING.SUBSCRIPTION.CREATED':  // When subcription first creates; No billing info provided. See ACTIVATED
            updateData.status = 'active'
            break;
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
            updateData.status = 'active';
            break;
        case 'PAYMENT.SALE.COMPLETED':
            const { data: subscriptionInfo, error: errorInfo } = await getSubscriptionInfo(subscriptionId);
            console.log('subscriptionInfo', subscriptionInfo)
            updateData.status = 'active';
            break;
        default:
            console.log('Unhandled event type:', eventType);
            shouldUpdate = false;
            break;
    }

    if (shouldUpdate) {

        // If event is not CREATED, it means a subscription already exists
        if (!userId) {
            console.log('User id is not passed, now fetch it.')
            const { data: subscription, error } = await supabaseClientServiceRole
                .from('subscriptions')
                .select('user_id')
                .eq('subscription_id', subscriptionId)
                .single();

            if (error) {
                console.error('Error in fetching user_id in updateSubscription: ', error);
                // throw error;
            }

            userId = subscription?.user_id;
            console.log('user_id', userId)
        }

        // Update the user_id field
        updateData.user_id = userId

        console.log('Supabase update data: ', eventType, updateData);
        const { error } = await supabaseClientServiceRole
            .from('subscriptions')
            .upsert(updateData, {
                conflict_target: 'subscription_id',
                conflict_action: 'update',
                update_columns: [
                    'start_time',
                    'end_time',
                    'status',
                    'plan_code',
                    'updated_at',
                ],
            });

        if (error) {
            console.error('Error updating subscription:', error.message);
            // throw error;
        }
    }
}
