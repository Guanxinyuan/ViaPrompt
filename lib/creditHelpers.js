import { supabaseClient } from "@/lib/supabase"

export async function grantFreeCreditsOnSignup(userId) {
    try {
        const { error } = await supabaseClient
            .from('users')
            .update({ free_credits_balance: 20 })
            .eq('id', userId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating free_credits_balance:', error.message);
        throw error;
    }
}


export async function subscribeToPlan(userId, plan) {
    try {
        const creditsToAdd = plan === 'basic' ? 100 : 0; // Add appropriate conditions for other plans

        const { error } = await supabaseClient
            .from('users')
            .update({ credits_balance: creditsToAdd, free_credits_balance: 0 })
            .eq('id', userId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating credits_balance and resetting free_credits_balance:', error.message);
        throw error;
    }
}


export async function hasEnoughCredits(userId, requiredCredits) {
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('credits_balance, free_credits_balance')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data.credits_balance + data.free_credits_balance >= requiredCredits;
    } catch (error) {
        console.error('Error fetching credits_balance and free_credits_balance:', error.message);
        throw error;
    }
}


export async function updateCreditsAndUsage(userId, creditsUsed, description) {
    try {
        const { data, error } = await supabaseClient.rpc('perform_credit_operations', {
            p_user_id: userId,
            p_credits_used: creditsUsed,
            p_description: description,
        });

        if (error) throw error;
        return {
            credits_balance: data[0].new_credits_balance,
            total_credits: data[0].total_credits_fetched,
            free_credits_balance: data[0].new_free_credits_balance,
            total_free_credits: data[0].total_free_credits_fetched,
        }
    } catch (error) {
        console.error('Error updating credits and usage history within a transaction:', error.message);
        throw error;
    }
}
