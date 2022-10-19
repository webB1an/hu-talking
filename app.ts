import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import type { Express } from 'express'
import type { Server } from 'http'


if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
  dotenv.config({ path: './dev.env' })
} else {
  dotenv.config({ path: './prod.env' })
}


import './db'

console.log('====================================================================')
console.log('PORT', process.env.PORT)
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('====================================================================')

const app:Express = express()
const server: Server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(process.env.PORT, () => {
  console.log(`Express server is listening at ${process.env.PORT}`)
})
