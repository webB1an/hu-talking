import mongoose from 'mongoose'
import shortid from 'shortid'

const Schema = mongoose.Schema

const airSchema = new Schema({
  id: {
    type: String,
    default: shortid.generate,
    index: true
  },
  sort: {
    type: Number,
    enum: [1, 2] // 挂式、柜式
  },
  brand: String, // 品牌
  type: String, // 型号
  price: Number,
  power: String, // 匹数
  quality: Number, // 质保几年
  url: String,
  describe: Array,
  createTime: {
    type: Number,
    default: Date.now
  }
})

export default mongoose.model('air', airSchema)
