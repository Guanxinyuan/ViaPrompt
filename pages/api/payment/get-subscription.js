import { supabaseClient } from "@/lib/supabase";

export default async function handler(req, res) {
    const { user_id } = req.query;

    if (!user_id) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            throw error;
        }

        // console.log('Success in get-subscription: ', data[0])
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.log('Error in get-subscription: ', err.message)
        res.status(500).json({ success: false, message: err.message });
    }
}
