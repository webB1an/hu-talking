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
  // console.log('openai', openai)
  let response
  try {
    response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      stream: true,
      messages: [{ 'role': 'user', 'content': '介绍下你自己!' }]
    })
  } catch (error) {
    console.log('---------------error---------------', error)
  }

  if (response?.data) {
    console.log('response', response)
  }

  console.log(typeof response)

  res.send(response)
})

export default router
