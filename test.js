import { Configuration, OpenAIApi } from 'openai'

async function chat() {
  const configuration = new Configuration({
    apiKey: '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'
  })

  const openai = new OpenAIApi(configuration)
  console.log('openai', openai)

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ 'role': 'user', 'content': 'Hello!' }]
  })

  console.log('response', response)
}

chat()
