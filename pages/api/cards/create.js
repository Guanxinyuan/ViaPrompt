// POST pages/api/cards/create.js

import { operatePrompt } from '@/utils/openai'
import { NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(await req.text())
      const { prompt, mode, model } = body
      console.log('in create prompt', prompt, 'mode', mode, 'model', model)

      // Operate ChatGPT API
      const response = await operatePrompt(prompt, mode, model)
      console.log('json in create ', json)

      const message = response ? response.choices[0].message.content : null;
      const messageObject = message ? JSON.parse(message) : {};

      const cardData = {
        mode: mode,
        model: model,
        original_prompt: prompt,
        optimized_prompt: messageObject ? JSON.stringify(messageObject.prompt) : null,
        explanation: messageObject ? JSON.stringify(messageObject) : null,
        template_prompt: prompt,
        user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
      };

      return NextResponse.json(cardData, { status: 200 })
    } catch (error) {
      console.error('Error in operatePrompt', error.stack)
      return NextResponse.json({ error: error.stack }, { status: 500 })
    }
  }
}
