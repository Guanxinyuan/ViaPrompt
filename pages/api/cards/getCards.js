// GET api/cards/getCards.js
// Get all cards created by user

import { dummyCards } from '../../../data/cards';
import { supabaseClient } from '@/lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, error: "Method not allowed" });
        return;
    }

    try {
        const { user_id } = req.query;

        if (!user_id) {
            res.status(400).json({ success: false, message: 'User ID is required' });
            return;
        }

        const { data, error } = await supabaseClient
            .from('tempCards')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('In /api/cards/getCards: ' + error.message);
        }

        res.status(200).json({ success: true, data: data });
    } catch (ex) {
        console.error('error occurs', ex.stack);
        res.status(500).json({ success: false, error: `/api/cards/getCards ${ex.message}` });
    }
}

