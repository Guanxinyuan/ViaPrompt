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
            .single();

        if (error) {
            throw error;
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
