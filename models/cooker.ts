import mongoose from 'mongoose'
import shortid from 'shortid'

const Schema = mongoose.Schema

const cookerSchema = new Schema({
  id: {
    type: String,
    default: shortid.generate,
    index: true
  },
  sort: {
    type: Number,
    enum: [1, 2, 3, 4] // 蒸、烤、消毒、蒸烤一体
  },
  brand: String,
  name: String,
  price: Number,
  url: String,
  pic: String,
  wind: Number,
  fire: Number,
  pa: Number,
  describe: Array,
  createTime: {
    type: Number,
    default: Date.now
  }
})

export default mongoose.model('cooker', cookerSchema)
