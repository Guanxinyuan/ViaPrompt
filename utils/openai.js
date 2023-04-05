import { NextResponse } from 'next/server'

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

export const promptOptimizer = async (prompt) => {
  const systemMessage = `You're a prompt engineer. You will help me write a prompt for an AI art generator called Midjourney.

    I will give you short content ideas and your job is to elaborate these into one full, explicit, coherent, and artistic prompt.
    
    The prompt involves illustrating, describing and improving the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Here is a formula you could use:
    
    (main content description insert here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colors reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here)
    
    when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, concise and articulate language. 
    
    Your response should include a json key-value pair for the above attributes, and the final prompt. Make the prompt also an attribute of the json. Do not include word "midjourney" in the final prompt.`
  const userMessage = `Generate a Midjourney prompt: ${prompt}`
  try {
    const json = await fetchOpenAI(systemMessage, userMessage)
    return json
  } catch (error) {
    console.error('Error in promptOptimizer', error)
    return NextResponse.json({ error: error.stack }, { status: 500 })
  }
}

export const promptDecomposer = async (prompt) => {
  const systemMessage = `You're a prompt engineer. You will help me decompose prompts to various categories for an ai art generator called Midjourney.

    I will provide you with a Midjourney prompt and you will thoroughly, completely decompose it into the following attributes: 
    
    main_object: the main object of the prompt,
    medium (list of keywords): artistic medium and format,
    style (list of keywords): genres and popular culture,
    artists (list of keywords): artist names extracted from the style attribute,
    lighting (list of keywords): the lighting of the view,
    colors (list of keywords): color styles and palettes,
    camera (list of keywords): camera lenses,
    perspective (list of keywords): perspective, positional elements,
    scale (list of keywords): scale
    
    If an attribute is absent from the prompt, leave the value to be N/A. When giving the decomposed prompt, remove the brackets, and output with a json key: value pair.
    
    Remember, all components should directly quote the given prompt.`
  const userMessage = `Decompose the Midjourney prompt: ${prompt}`
  try {
    const json = await fetchOpenAI(systemMessage, userMessage)
    return json
  } catch (error) {
    console.error('Error in promptDecomposer', error)
    return NextResponse.json({ error: error.stack }, { status: 500 })
  }
}

export const promptTemplater = async (prompt) => {
  console.log('templatePrompt ' + prompt)
  return prompt
}

export const operatePrompt = async (prompt, mode) => {
  switch (mode) {
    case 'Optimize':
      return await promptOptimizer(prompt)
    case 'Decompose':
      return await promptDecomposer(prompt)
    case 'Template':
      return await promptTemplater(prompt)
  }
}
