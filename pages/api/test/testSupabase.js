// POST pages/api/cards/test.js
// import { OpenAIStream } from '@/utils/OpenAIStream'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { dummyResponses } from '@/data/cards'

export const config = {
  runtime: 'edge',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export default async (req, res) => {
  const body = JSON.parse(await req.text())
  const { prompt, mode, model } = body
  console.log('in test', prompt)

  const json = dummyResponses[mode]
  const message = json ? json.choices[0].message.content : null
  const json_object = message ? JSON.parse(message) : {}

  const { data, error } = await supabase.from('cards').insert({
    mode: mode,
    model: model,
    original_prompt: prompt,
    optimized_prompt: json_object ? JSON.stringify(json_object.prompt) : null,
    explanation: json_object ? JSON.stringify(json_object) : null,
    template_prompt: prompt,
    user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
  })
  if (error) {
    console.log('error', error.message)
    throw new Error(error.message)
  }
  console.log('Insert success')
  return message ? NextResponse.json(message) : NextResponse.json(JSON.stringify({ 'prompt': prompt }))
}
