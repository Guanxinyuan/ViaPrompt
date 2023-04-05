import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'

export async function OpenAIStream(payload) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  let counter = 0

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
    },
    body: JSON.stringify(payload),
  })

  console.log('res in OpenAIStream ', res)

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event) {
        if (event.type === 'event') {
          const data = event.data
          console.log('data in OpenAIStream ', data)
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            console.log('json in OpenAIStream ', json)
            const text = json.choices[0].message?.content || ''
            console.log('text in OpenAIStream ', text)
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return
            }
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (e) {
            controller.error(e)
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks & invoke an event for each SSE event stream
      const parser = createParser(onParse)

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk))
      }
      console.log('res in OpenAIStream ', res)
    },
  })

  return stream
}
