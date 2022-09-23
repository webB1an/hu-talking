import express from 'express'
import { checkSchema } from 'express-validator'
import type { Router, Request, Response } from 'express'
import type { Obj } from '../interface/common'

import AirModel from '../models/air'
import { airCheckSchema, airFindCheckSchema } from '../validation/air'
import checkSchemaError from '../middleware/checkSchemaError'

import { filterParams, random } from '../utils'

const router: Router = express.Router()

router.post('/add', checkSchema(airCheckSchema('add')), checkSchemaError, async(req: Request, res: Response) => {
  const { type } = req.body

  const airs = await AirModel.find({ type })
  if (airs.length > 0) {
    return res.send({
      code: 90003,
      msg: '输入名称已存在'
    })
  }

  console.log('---------------add---------------')

  const air = new AirModel(req.body)
  await air.save()

  res.json({
    code: 90001,
    msg: '新建成功！'
  })
})

router.post('/del', async(req: Request, res: Response) => {
  const { id } = req.body

  if (!id) {
    return res.send({
      code: 90002,
      msg: '缺少需要删除的 id'
    })
  }

  const air = await AirModel.findOne({ id })

  if (!air) {
    return res.send({
      code: 90001,
      msg: '当前删除的 id 不存在'
    })
  }

  console.log('---------------delete---------------')

  await AirModel.deleteOne({ id })

  res.json({
    code: 90001,
    msg: '删除成功！'
  })
})

router.post('/editor', checkSchema(airCheckSchema('editor')), checkSchemaError, async(req: Request, res: Response) => {
  const params = req.body

  const { id } = req.body

  const air = await AirModel.findOne({ id })

  if (!air) {
    return res.send({
      code: 90001,
      msg: '当前更新的 id 不存在'
    })
  }

  console.log('---------------editor---------------')

  await AirModel.updateOne({ id: params.id }, params)

  res.json({
    code: 90001,
    msg: '更新成功！'
  })
})

router.post('/find', checkSchema(airFindCheckSchema), checkSchemaError, async(req: Request, res: Response) => {
  const { requestData } = filterParams(req.body)
  const { pageSize, page } = filterParams(req.body)

  let params = {}
  let minPrice = 0
  let maxPrice = 50000

  if (requestData.sort) {
    params = { ...params, sort: requestData.sort }
  }
  if (requestData.brand) {
    params = { ...params, brand: { $regex: new RegExp(requestData.brand) }}
  }
  if (requestData.type) {
    params = { ...params, type: { $regex: new RegExp(requestData.type) }}
  }
  if (requestData.maxPrice) {
    maxPrice = requestData.maxPrice
  }
  if (requestData.minPrice) {
    minPrice = requestData.minPrice
  }

  params = { ...params, price: { $gte: minPrice, $lte: maxPrice }}

  console.log('---------------find---------------')

  const total = await AirModel.count(params)
  const list = await AirModel.find(params, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((page - 1) * pageSize).limit(pageSize)

  res.json({
    code: 90001,
    msg: '查询成功！',
    data: {
      total,
      list
    }
  })
})

router.post('/detail/:id', async(req: Request, res: Response) => {
  const id = req.params.id
  const data = await AirModel.findOne({ id })

  res.json({
    code: 90001,
    msg: '查询成功！',
    data
  })
})

router.post('/generate', async(req: Request, res: Response) => {
  const { power, minPrice = 0, maxPrice = 50000 } = filterParams(req.body)
  let params = {}

  if (power) {
    params = { ...params, power }
  }
  params = { ...params, price: { $gte: minPrice, $lte: maxPrice }}

  const result1 = await getRandomCooker({ ...params, sort: 1 })
  const result2 = await getRandomCooker({ ...params, sort: 2 })

  const md = `
# 挂式空调

${getMd(result1)}

# 柜式空调

${getMd(result2)}

# 消毒柜款
`

  res.json({
    code: 90001,
    msg: '生成成功！',
    data: md
  })
})

async function getRandomCooker(parmas: Obj) {
  return await AirModel.aggregate([
    { $match: { ...parmas }},
    { $project: { _id: 0, __v: 0, createTime: 0, updateTime: 0 }},
    { $sort: { price: 1 }},
    { $sample: { size: 3 }}
  ])
}

function getMd(list: any[]) {
  let md = ``
  if (list.length > 0) {
    list.forEach(item => {
      const max = item.describe.length - 1

      console.log(item.describe)
      md += `
## ${item.brand} ${item.type}

- 最低价：${item.price}
- 匹数：${item.power} 匹
- 质保：${item.quality} 年

**推荐理由**：${item.describe[random(max, 0)]}

${item.url}
`
    })
  }
  return md
}

export default router
