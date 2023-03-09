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
  let response
  try {
    response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      stream: true,
      messages
    })
  } catch (error) {
    console.log('---------------error---------------', error)
  }

  res.json({
    code: 90001,
    msg: '发送成功！',
    response: response?.data
  })
})

export default router
