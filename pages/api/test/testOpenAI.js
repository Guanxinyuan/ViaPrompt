// POST pages/api/test/testOpenAI.js
import { NextResponse } from 'next/server'
import { operatePromptByChat, operatePromptByCompletion } from '@/utils/openai'

export const config = { runtime: 'edge' }

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(await req.text())
            const { userPrompt: prompt, task, model } = body
            console.log('in testOpenAI userPrompt', userPrompt, 'task', task, 'model', model)

            // Operate ChatGPT API
            const result = await operatePromptByCompletion(userPrompt, task, model)
            console.log('response in testOpenAI ', response)

            let cardData = {
                task: task,
                model: model,
                prompt: userPrompt,
                user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
            };

            switch (task) {
                case 'optimize': cardData = { ...cardData, answer: result }; break;
                case 'decompose': cardData = { ...cardData, answer: result }; break;
                case 'template': cardData = { ...cardData, answer: prompt }; break;
            }

            return NextResponse.json(cardData, { status: 200 })
        } catch (error) {
            console.error('Error in testOpenAI', error)
            return NextResponse.json({ error: error.stack }, { status: 500 })
        }
    }
}
