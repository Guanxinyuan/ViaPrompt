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
  console.log('in operatePrompt', prompt, 'mode', mode, 'model', model)

  // If mode is template, return the prompt
  if (mode === 'template') {
    return prompt
  }

  // If mode is not template, call OpenAI API
  const { systemMessage, userMessage } = messages[model][mode];
  const formattedUserMessage = `${userMessage}${prompt}`;

  try {
    const json = await fetchOpenAI(systemMessage, formattedUserMessage);
    return json;
  } catch (error) {
    console.error('Error in fetching OpenAI API', error);
    throw error;
  }
};
