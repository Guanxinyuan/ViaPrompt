// POST pages/api/cards/create.js

import { saveCardToSupabase } from '@/lib/cardHelpers'
// import { operatePromptByCompletion } from '@/utils/openai'
import { executeTask } from '@/utils/openai'
import { NextResponse } from 'next/server'
import { hasEnoughCredits, updateCreditsAndUsage } from '@/lib/creditHelpers'

export const config = {
  runtime: 'edge',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, error: 'Invalid request method' })
  }

  try {
    const { prompt, task, model, user_id, required_credits, description } = JSON.parse(await req.text())
    console.log('in create: prompt', prompt, 'task', task, 'model', model, 'user_id', user_id, 'required_credits', required_credits, 'description', description)

    // 1. Check if the user has enough credits
    const enoughCredits = await hasEnoughCredits(user_id, required_credits);

    if (!enoughCredits) {
      return NextResponse.json({ success: false, error: 'Insufficient credits.' });
    }

    // 2. Operate ChatGPT API
    const result = await executeTask({
      model, task,
      userInput: prompt,
      maxTokens: 500,
      type: 'completion',
    });

    const card = {
      created_at: new Date().toISOString(),
      task: task,
      model: model,
      prompt: prompt,
      user_id: user_id,
      answer: result,
    };

    // 3. Save result to Supabase
    await saveCardToSupabase(card)

    // 4. Update the credits balance and usage history within a transaction
    const credits = await updateCreditsAndUsage(user_id, required_credits, description);
    console.log('in create: card', card, 'credits', credits)

    // 5. Return card to client
    return NextResponse.json({
      success: true,
      data: {
        card: card,
        credits: {
          credits_balance: credits.credits_balance,
          total_credits: credits.total_credits,
          free_credits_balance: credits.free_credits_balance,
          total_free_credits: credits.total_free_credits,
        }
      }
    });

  } catch (error) {
    console.error('Error in /api/cards/create', error.stack)
    return NextResponse.json({ success: false, error: error.message })
  }
}
