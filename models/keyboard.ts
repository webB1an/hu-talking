import mongoose from 'mongoose'
import shortid from 'shortid'
const Schema = mongoose.Schema

const KeyboardModel = new Schema({
  id: {
    type: String,
    default: shortid.generate,
    index: true
  },
  name: String,
  price: Number, // 价格
  switchs: String, // 轴体类型
  keys: Number, // 按键数
  light: String, // 背光
  connect: {
    type: Number,
    emua: [0, 1, 2, 3, 4, 5, 6] // 0：有线 1：2.4G 2：蓝牙 3：2.4G双模 4：蓝牙双模 5：三模 6：所有
  },
  describe: Array,
  url: String,
  createTime: {
    type: Number,
    default: Date.now
  },
  updateTime: {
    type: Number,
    default: Date.now
  }
})

export default mongoose.model('keyboard', KeyboardModel)