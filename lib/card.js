import { supabaseClient } from "@/lib/supabase";

export const saveCardToSupabase = async (cardData) => {
    console.log('In saveCardToSupabase', cardData);
    const { prompt, mode, model, answer, user_id } = cardData;
    if (!prompt || !mode || !model || !answer || !user_id) {
        throw new Error('In saveCardToSupabase, missing data');
    }

    const { data, error } = await supabaseClient.from('tempCards').insert(cardData);
    if (error) {
        console.log('Error:', error);
        throw new Error('In saveCardToSupabase ' + error.message);
    }
    console.log('Insertion success');
    return data;
}

