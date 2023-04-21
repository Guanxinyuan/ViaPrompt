import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import initStripte from 'stripe'

export default async function handler(req, res) {

    const supabaseClient = createServerSupabaseClient({ req, res });

    const { data: { session }, error: fetchSessionError } = await supabaseClient.auth.getSession()

    if (fetchSessionError) {
        console.error('fetchSessionError: ', fetchSessionError.message)
        res.status(500).json({ success: false, error: `fetchSessionError: ${fetchSessionError.message}` })
        return

    }
    const user = session.user

    const { data, error: fetchStripeCustomerError } = await supabaseClient
        .from('profiles')
        .select('stripe_customer')
        .eq('id', user.id)
        .single()

    if (fetchStripeCustomerError) {
        console.error('fetchStripeCustomerError: ', fetchStripeCustomerError.message)
        res.status(500).json({ success: false, error: `fetchStripeCustomerError: ${fetchStripeCustomerError.message}` })
        return
    }
    const stripe_customer = data?.stripe_customer
    console.log(user.id, stripe_customer)

    res.status(200).json({
        success: true,
        data: {
            ...user,
            stripe_customer
        }
    });
}