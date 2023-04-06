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
      const json = await operatePrompt(prompt, mode, model)
      console.log('json in create ', json)

      return NextResponse.json(json, { status: 200 })
    } catch (error) {
      console.error('Error in operatePrompt', error.stack)
      return NextResponse.json({ error: error.stack }, { status: 500 })
    }
  }
}
