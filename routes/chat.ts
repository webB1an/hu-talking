import express from 'express'
import { Configuration, OpenAIApi } from 'openai'
import type { Router, Request, Response } from 'express'

const router: Router = express.Router()

router.post('/chat', async(req: Request, res: Response) => {
  const { apiKey } = req.body

  console.log('apiKey', apiKey)

  const configuration = new Configuration({
    apiKey
  })

  const openai = new OpenAIApi(configuration)
  console.log('openai', openai)

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ 'role': 'user', 'content': 'Hello!' }]
  })

  console.log('response', response)

  res.json({
    code: 90001,
    msg: '发送成功！',
    response
  })
})

export default router
