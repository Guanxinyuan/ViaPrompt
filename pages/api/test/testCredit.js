import { supabaseClient } from "@/lib/supabase";
import { hasEnoughCredits, updateCreditsAndUsage } from "@/lib/creditHelpers";

export default async function handler(req, res) {
    // Extract user ID, required credits, and description from the request
    // ...

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }

    const { user_id, required_credits, description } = req.body;
    // Check if the user has enough credits
    console.log('In testCredit.js: user_id, required_credits, description:', user_id, required_credits, description)
    const enoughCredits = await hasEnoughCredits(user_id, required_credits);

    if (!enoughCredits) {
        return res.status(400).json({ success: false, error: 'Insufficient credits.' });
    }

    // Perform the required task
    // ...

    // Update the credits balance and usage history within a transaction
    try {
        const credits = await updateCreditsAndUsage(user_id, required_credits, description);
        return res.status(200).json({
            success: true,
            data: {
                credits_balance: credits.credits_balance,
                free_credits_balance: credits.free_credits_balance,
            }
        });
    } catch (error) {
        console.error('Error updating credits and usage history within a transaction:', error.message);
        return res.status(500).json({ success: false, error: 'Failed to update credits and usage history.' });
    }
}
