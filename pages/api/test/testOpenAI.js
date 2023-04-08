// POST pages/api/test/testOpenAI.js
import { NextResponse } from 'next/server'
import { operatePrompt } from '@/utils/openai'

export const config = { runtime: 'edge' }

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(await req.text())
            const { prompt, mode, model } = body
            console.log('in testOpenAI prompt', prompt, 'mode', mode, 'model', model)

            // Operate ChatGPT API
            const response = await operatePrompt(prompt, mode, model)
            console.log('response in testOpenAI ', response)

            const message = response ? response.choices[0].message.content : null;

            let cardData = {
                mode: mode,
                model: model,
                prompt: prompt,
                user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
            };

            switch (mode) {
                case 'optimize': cardData = { ...cardData, answer: message }; break;
                case 'decompose': cardData = { ...cardData, answer: message }; break;
                case 'template': cardData = { ...cardData, answer: prompt }; break;
            }

            return NextResponse.json(cardData, { status: 200 })
        } catch (error) {
            console.error('Error in testOpenAI', error)
            return NextResponse.json({ error: error.stack }, { status: 500 })
        }
    }
}
