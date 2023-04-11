import { getPayPalHistory } from '@/lib/paypal'
import { supabaseClient } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const user_id = req.query.subscription_id;
    if (!user_id) {
        res.status(400).json({ error: 'Missing user_id parameter' });
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('subscriptions')
            .select('subscription_id')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        if (error) {
            throw error;
        }

        const startTime = '2023-01-01T00:00:20.940Z'
        const endTime = new Date().toISOString()
        let rawInvoices = []
        for (const subscription of data) {
            const subscriptionId = subscription.subscription_id;
            const subscriptionInvoices = await getPayPalHistory(subscriptionId, startTime, endTime);
            rawInvoices.push(...subscriptionInvoices);
        }
        const invoices = rawInvoices.map(invoice => {
            return {
                amount: invoice.amount_with_breakdown.gross_amount.value,
                currency: invoice.amount_with_breakdown.gross_amount.currency_code,
                time: invoice.time,
            }
        })
        console.log('Success in get-history: ', invoices)
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        console.error('Error in get-history handler:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
