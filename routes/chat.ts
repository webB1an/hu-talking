import express from 'express'
import { Configuration, OpenAIApi } from 'openai'

import type { Router, Request, Response } from 'express'

const router: Router = express.Router()

router.post('/chat', async(req: Request, res: Response) => {
  const { apiKey, messages } = req.body

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
    // eslint-disable-next-line
    // @ts-ignore
    res.data.on('data', data => {
      // eslint-disable-next-line
      // @ts-ignore
      const lines = data.toString().split('\n').filter(line => line.trim() !== '')
      for (const line of lines) {
        const message = line.replace(/^data: /, '')
        if (message === '[DONE]') {
          return // Stream finished
        }
        try {
          const parsed = JSON.parse(message)
          console.log(parsed.choices[0].text)
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error)
        }
      }
    })
  } catch (error) {
    console.log('---------------error---------------', error)
  }
})

export default router
