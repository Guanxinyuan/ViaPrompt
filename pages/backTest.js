// This page is used to test the API calls. There is a button that calls the API, and a text box that displays the result.
import { useState } from 'react'

const canParseJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export default function TestAPI() {
  return (
    <div className='min-h-screen grid grid-rows-2 gap-20 text-sm'>
      <div className='h-content gap-6 py-6 items-center flex flex-col'>
        <h1 className='text-2xl'>Supabase Test</h1>
        <div className='flex flex-row gap-6'>
          <TestSupaCard model={'midjourney'} mode={'Optimize'} />
          <TestSupaCard model={'midjourney'} mode={'Decompose'} />
          <TestSupaCard model={'midjourney'} mode={'Template'} />
        </div>
      </div>
      <div className='flex flex-col gap-6 py-6 items-center'>

        <h1 className='text-2xl'>OpenAI Test</h1>
        <div className='flex flex-row gap-6'>
          <OpenAICard model={'midjourney'} mode={'optimize'} />
          <OpenAICard model={'midjourney'} mode={'decompose'} />
          <OpenAICard model={'test'} mode={'translate'} />
        </div>
      </div>
    </div>
  )
}


const TestSupaCard = ({ mode, model }) => {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('in submit ', prompt)
    const response = await fetch(`/api/test/testSupabase`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        mode: mode,
        model: model
      }),
    })

    const result = await response.json()
    console.log('result', result)
    // const answer = result.choices[0].message.content
    const answer = result
    if (canParseJSON(answer)) {
      console.log('answer', JSON.parse(answer))
      switch (mode) {
        case 'Optimize': setAnswer(JSON.parse(answer).prompt); break;
        // case 'Decompose': setAnswer(JSON.parse(answer)); break;
        case 'Decompose': setAnswer(answer); break;
        case 'Template': setAnswer(JSON.parse(answer).prompt); break;
      }
    }
  }

  return (
    <div className='border border-red h-[30vh] w-[30vw] flex flex-col gap-6'>

      <form
        className='flex flex-col gap-2 justify-center items-center h-full w-full'
        onSubmit={onSubmitHandler}>
        <label htmlFor="content">{mode}</label>
        <textarea
          className="text-black h-5/6 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Supa{mode}</button>
      </form>
      <div className='border border-red'>
        <p className='whitespace-pre-line'>{answer}</p>
      </div>
    </div>
  )
}

const OpenAICard = ({ mode, model }) => {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('in submit ', prompt)
    const response = await fetch(`/api/test/testOpenAI`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        mode: mode,
        model: model
      }),
    })

    const result = await response.json()
    console.log('result', result)
    const answer = result.choices[0].message.content
    console.log('answer', answer)
    setAnswer(answer)
  }

  return (
    <div className='border border-red h-[30vh] w-[30vw] flex flex-col gap-6'>

      <form
        className='flex flex-col gap-2 justify-center items-center h-full w-full'
        onSubmit={onSubmitHandler}>
        <label htmlFor="content">{mode}</label>
        <textarea
          className="text-black h-5/6 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Open{mode}</button>
      </form>
      <div className='border border-red'>
        <p className='whitespace-pre-line'>{answer}</p>
      </div>
    </div>
  )
}