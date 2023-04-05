// POST pages/api/cards/create.js

import { dummyCards } from '../../../data/cards'
import { generateSnowflake } from '@/utils/snowflake'
import { operatePrompt } from '@/utils/openai'
import { NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req, res) {
  console.log('req.method create', req.method)
  if (req.method === 'POST') {
    // const card_id = generateSnowflake()
    // console.log(card_id)
    const body = JSON.parse(await req.text())
    const { prompt, mode } = body
    console.log('in create prompt', prompt, 'mode', mode)

    // Operate ChatGPT API
    const json = await operatePrompt(prompt, mode)
    console.log('json in create ', json)

    return NextResponse.json(json, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  }
}
