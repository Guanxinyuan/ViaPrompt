// This page is used to test the API calls. There is a button that calls the API, and a text box that displays the result.
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { parseAnswer } from '@/utils/parseAnswer'

export default function TestAPI() {
  return (
    <div className='min-h-screen grid grid-rows-2 gap-20 text-sm'>
      <div className='h-content gap-6 py-6 items-center flex flex-col'>
        <h1 className='text-2xl'>Credits Test</h1>
        <div className='flex flex-row gap-6'>
          <CreditCard mode={'analyze'} requiredCredits={1} />
        </div>
      </div>
      <div className='h-content gap-6 py-6 items-center flex flex-col'>
        <h1 className='text-2xl'>Supabase Test</h1>
        <div className='flex flex-row gap-6'>
          <TestSupaCard model={'midjourney'} mode={'optimize'} />
          <TestSupaCard model={'midjourney'} mode={'explain'} />
          <TestSupaCard model={'midjourney'} mode={'template'} />
        </div>
      </div>
      <div className='flex flex-col gap-6 py-6 items-center'>
        <h1 className='text-2xl'>OpenAI Test</h1>
        <div className='flex flex-row gap-6'>
          <OpenAICard model={'midjourney'} mode={'optimize'} />
          <OpenAICard model={'midjourney'} mode={'explain'} />
          <OpenAICard model={'test'} mode={'translate'} />
        </div>
      </div>
    </div>
  )
}


const TestSupaCard = ({ mode, model }) => {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const user = useUser()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('in submit ', prompt)
    // const response = await fetch(`/api/test/testSupabase`, {
    const response = await fetch(`/api/cards/create`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        mode: mode,
        model: model,
        user_id: user.id
      }),
    })

    const result = await response.json()
    if (!result.success) {
      console.log('error', result.error)
      return
    }
    const cardData = result.data
    console.log('cardData', cardData)

    const parsedAnswer = parseAnswer(mode, cardData.answer)
    setAnswer(parsedAnswer)
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
  const user = useUser()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('in submit ', prompt)
    // const response = await fetch(`/api/test/testOpenAI`, {
    const response = await fetch(`/api/cards/create`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.trim(),
        mode: mode,
        model: model,
        required_credits: 1,
        description: 'test',
        user_id: user.id
      }),
    })

    const cardData = await response.json()
    switch (mode) {
      case 'optimize': setAnswer(JSON.parse(cardData.answer).prompt); break;
      case 'decompose': setAnswer(cardData.answer); break;
      case 'translate': setAnswer(cardData.answer); break;
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
        <button type="submit">Open{mode}</button>
      </form>
      <div className='border border-red'>
        <p className='whitespace-pre-line'>{answer}</p>
      </div>
    </div>
  )
}

import { supabaseClient } from '@/lib/supabase'
const CreditCard = ({ mode, requiredCredits }) => {
  const user = useUser()
  const [credits, setCredits] = useState(0)
  const [freeCredits, setFreeCredits] = useState(0)

  useEffect(() => {

  }, [user])

  const fetchNewCredits = async () => {
    // const response = await fetch(`/api/test/testCredit`, {
    const response = await fetch(`/api/cards/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        required_credits: requiredCredits,
        description: mode
      }),
    })

    const result = await response.json()
    if (!result.success) {
      console.log('error', result.error)
      return
    }
    const { credits_balance, free_credits_balance } = result.data
    console.log(`New credits balance: ${credits_balance}`)
    setCredits(credits_balance)
    setFreeCredits(free_credits_balance)
  }

  // const fetchNewCredits = async () => {
  //   const { data, error } = await supabaseClient.rpc('perform_credit_operations', {
  //     p_user_id: user.id,
  //     p_credits_used: requiredCredits,
  //     p_description: mode,
  //   });
  //   const { new_credits_balance, new_free_credits_balance } = data[0]

  //   console.log(`New credits balance: ${new_credits_balance}`)
  //   console.log(`New free credits balance: ${new_free_credits_balance}`)
  // }



  return (
    <div className='border border-red h-[30vh] w-[30vw] flex flex-col gap-6'>
      <div className='border h-8 cursor-pointer' onClick={fetchNewCredits}>Reduce Credit</div>
      <p>Credits: {credits}</p>
      <p>Free Credits: {freeCredits}</p>
    </div>
  )
}