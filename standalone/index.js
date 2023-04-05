import { operatePrompt } from '@/utils/openai'
import { NextResponse } from 'next/server'

const config = {
  runtime: 'edge',
}

async function getAnswer(req, res) {
  console.log('req.method create', req.method)
  if (req.method === 'POST') {
    // const card_id = generateSnowflake()
    // console.log(card_id)
    const body = JSON.parse(await req.text())
    const { prompt, mode } = body
    console.log('in getAnswer', prompt, 'mode', mode)

    // Operate ChatGPT API
    const json = await operatePrompt(prompt, mode)
    console.log('json in getAnswer ', json)

    return NextResponse.json(json, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  }
}

module.exports = { getAnswer, config }
