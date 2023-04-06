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
            const json = await operatePrompt(prompt, mode, model)
            console.log('json in testOpenAI ', json)

            return NextResponse.json(json, { status: 200 })
        } catch (error) {
            console.error('Error in operatePrompt', error)
            return NextResponse.json({ error: error.stack }, { status: 500 })
        }
    }
}
