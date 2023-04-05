// This page is used to test the API calls. There is a button that calls the API, and a text box that displays the result.
import { useState } from 'react'
export default function TestAPI() {
  const [content, setContent] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('in submit ', content)
    const response = await fetch(`/api/cards/test`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: content.trim(),
        mode: 'Optimize',
      }),
    })

    const result = await response.json()
    console.log('result', result)
    // const answer = result.choices[0].message.content
    // console.log('answer', answer)
    // setAnswer(answer)
  }

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault()
  //   setAnswer('')
  //   const response = await fetch('/api/cards/test', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       prompt: content,
  //     }),
  //   })

  //   if (!response.ok) {
  //     throw new Error(response.statusText)
  //   }

  //   console.log('response in onSubmitHandler ', response)
  //   const data = response.body
  //   console.log('data in onSubmitHandler ', data)
  //   if (!data) {
  //     return
  //   }
  //   const reader = data.getReader()
  //   const decoder = new TextDecoder()
  //   let done = false

  //   while (!done) {
  //     const { value, done: doneReading } = await reader.read()
  //     done = doneReading
  //     const chunkValue = decoder.decode(value)
  //     setAnswer((prev) => prev + chunkValue)
  //   }

  //   setLoading(false)
  // }

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <textarea
          className="text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">TestAPI</button>
      </form>
      <div>
        <p>{answer}</p>
      </div>
    </div>
  )
}
