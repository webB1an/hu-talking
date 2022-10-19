import mongoose from 'mongoose'

const {
  MONGO_USERNAME = 'admin',
  MONGO_PASSWORD = 'test123456',
  MONGO_HOST = 'localhost',
  MONGO_PORT = '27017',
  MONGO_INITDB_DATABASE = 'auto-answer'
} = process.env

let uri = ''

if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
  uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`
} else {
  uri = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`
}

console.log(uri)

// mongodb://admin:test123456@localhost:27017/auto-answer
mongoose.connect(uri, {
  // authSource: 'admin'
}, () => {
  console.log('connect!')
})

const db = mongoose.connection

db.once('open', () => {
  console.log('db is connect!')
})

db.on('error', error => {
  console.log(error)
})

db.on('close', () => {
  console.log('db is closed!')
})

export default mongoose
