import initStripe from 'stripe';
import { supabaseClient } from '@/lib/supabase';

export default async function handler(req, res) {
    console.log('req.body', req.body);
    if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).json({ success: false, error: 'You are not authorized to call the API' });
    }

    // const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET);
    // const customer = await stripe.customers.create({
    //     email: req.body.record.email,
    // });

    await supabaseClient.from('profiles')
        .update({ stripe_customer: customer.id })
        .eq('id', req.body.record.id);

    res.status(200).json({ success: true, data: customer.id });
}

