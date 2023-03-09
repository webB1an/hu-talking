import express from 'express'
import { Configuration, OpenAIApi } from 'openai'
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from 'eventsource-parser'

import type { Router, Request, Response } from 'express'

const router: Router = express.Router()

router.post('/chat', async(req: Request, res: Response) => {
  const { apiKey, messages } = req.body

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let counter = 0
  console.log('apiKey', apiKey)
  console.log('messages', messages)

  const configuration = new Configuration({
    apiKey
  })

  const openai = new OpenAIApi(configuration)

  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      stream: true,
      max_tokens: 100,
      messages
    })

    const stream = new ReadableStream({
      async start(controller) {
        // callback
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === 'event') {
            const data = event.data
            // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const text = json.choices[0].text
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // this is a prefix character (i.e., "\n\n"), do nothing
                return
              }
              const queue = encoder.encode(text)
              controller.enqueue(queue)
              counter++
            } catch (e) {
              // maybe parse error
              controller.error(e)
            }
          }
        }

        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks and invoke an event for each SSE event stream
        const parser = createParser(onParse)
        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res as any) {
          parser.feed(decoder.decode(chunk))
        }
      }
    })

    console.log('stream', stream)
  } catch (error) {
    console.log('---------------error---------------', error)
  }
})

export default router
