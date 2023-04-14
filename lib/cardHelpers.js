import { supabaseClient } from "@/lib/supabase";

export const saveCardToSupabase = async (card) => {
    console.log('In saveCardToSupabase', card);
    const { prompt, mode, model, answer, user_id } = card;
    if (!prompt || !mode || !model || !answer || !user_id) {
        throw new Error('In saveCardToSupabase, missing data');
    }

    const { data, error } = await supabaseClient.from('tempCards').insert(card);
    if (error) {
        console.log('Error:', error);
        throw new Error('In saveCardToSupabase ' + error.message);
    }
    console.log('Insertion success');
    return data;
}
