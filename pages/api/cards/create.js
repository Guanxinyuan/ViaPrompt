// POST pages/api/cards/create.js

import { saveCardToSupabase } from '@/lib/card'
import { operatePrompt } from '@/utils/openai'
import { NextResponse } from 'next/server'
import { dummyResponses } from '@/data/cards'

export const config = {
  runtime: 'edge',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt, mode, model, user_id } = JSON.parse(await req.text())
      console.log('in create: prompt', prompt, 'mode', mode, 'model', model)

      // Operate ChatGPT API
      const response = await operatePrompt(prompt, mode, model)
      // const response = dummyResponses[mode];
      const message = response ? response.choices[0].message.content : null;

      const cardData = {
        mode: mode,
        model: model,
        prompt: prompt,
        user_id: user_id,
        answer: message,
      };

      // Save result to Supabase
      await saveCardToSupabase(cardData)

      // Return card to client
      return NextResponse.json({ success: true, data: cardData })
    } catch (error) {
      console.error('Error in /api/cards/create', error.stack)
      return NextResponse.json({ success: false, error: error.message })
    }
  } else {
    return NextResponse.json({ success: false, error: 'Invalid request method' })
  }
}
