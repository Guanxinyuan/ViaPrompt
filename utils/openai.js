import { NextResponse } from 'next/server'
import { messages } from '@/data/chatMessages'

const fetchOpenAI = async (systemMessage, userMessage) => {
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
    ],
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
    },
    body: JSON.stringify(payload),
  })

  const json = await response.json()
  return json
}

export const operatePrompt = async (prompt, mode, model) => {
  const systemMessage = messages[model][mode].systemMessage
  const userMessage = messages[model][mode].userMessage + prompt
  try {
    const json = await fetchOpenAI(systemMessage, userMessage)
    return json
  } catch (error) {
    console.error('Error in fetching OpenAI API', error.stack)
    throw error
  }
}
