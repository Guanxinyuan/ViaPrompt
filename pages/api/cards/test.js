// POST pages/api/cards/test.js
// import { OpenAIStream } from '@/utils/OpenAIStream'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = {
  runtime: 'edge',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export default async (req, res) => {
  const body = JSON.parse(await req.text())
  const { prompt, mode } = body
  console.log('in test', prompt)

  // Operate ChatGPT API
  const systemPrompt = "You're a English to French translater."

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Translate the text: ${prompt}` },
    ],
  }

  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
  //   },
  //   body: JSON.stringify(payload),
  // })
  // console.log('response in test ', response)
  // const json = await response.json()
  // console.log('json in test ', json)

  // const stream = await OpenAIStream(payload)
  const json = {
    choices: [
      {
        message: {
          content: JSON.stringify({
            content:
              'A landscape of rolling hills and rocky outcroppings in the Scottish Highlands',
            medium: 'oil painting',
            style:
              'inspired by the Romanticism movement, with a touch of impressionism',
            lighting:
              'the warm glow of the setting sun casting long shadows across the hills',
            colors:
              ' rich earthy tones with pops of vibrant greens and purples',
            composition:
              'A wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth. The focal point is a small loch nestled among the hills, with a lone tree on its banks.',
            prompt:
              'Create an oil painting inspired by the Romanticism movement, with a touch of impressionism, depicting a landscape of rolling hills and rocky outcroppings in the Scottish Highlands at sunset. Use rich earthy tones with pops of vibrant greens and purples to emphasize the warm glow of the setting sun casting long shadows across the hills. The focal point of the painting should be a small loch nestled among the hills, with a lone tree on its banks. Take a wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth.',
          }),
        },
      },
    ],
  }

  const json_object = JSON.parse(json.choices[0].message.content)

  // const { data, error } = await supabase.from('cards').insert({
  //   card_id: 2,
  //   mode: mode,
  //   model: 'gpt-4',
  //   original_prompt: prompt,
  //   optimized_prompt: json_object.prompt,
  //   explanation: JSON.stringify(json_object),
  //   template_prompt: prompt,
  //   user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
  // })
  // if (error) {
  //   throw new Error(error.message)
  // }
  // console.log('Insert success')

  const response = await fetch('https://openback-zeta.vercel.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      mode: mode,
    }),
  })
  console.log('response in test ', response)
  return NextResponse.json(json_object)
}
