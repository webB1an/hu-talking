import express from 'express'
import { checkSchema } from 'express-validator'
import type { Router, Request, Response } from 'express'

import CookerModel from '../models/cooker'
import { cookerCheckSchema, cookerFindCheckSchema } from '../validation/cooker'
import checkSchemaError from '../middleware/checkSchemaError'
import { filterParams } from '../utils'

const router: Router = express.Router()

router.post('/add', checkSchema(cookerCheckSchema('add')), checkSchemaError, async(req: Request, res: Response) => {
  const { name } = req.body

  const cookers = await CookerModel.find({ name })
  if (cookers.length > 0) {
    return res.send({
      code: 90003,
      msg: '输入名称已存在'
    })
  }

  console.log('---------------add---------------')

  const cooker = new CookerModel(req.body)
  await cooker.save()

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

  const cooker = await CookerModel.findOne({ id })

  if (!cooker) {
    return res.send({
      code: 90001,
      msg: '当前删除的 id 不存在'
    })
  }

  console.log('---------------delete---------------')

  await CookerModel.deleteOne({ id })

  res.json({
    code: 90001,
    msg: '删除成功！'
  })
})

router.post('/editor', checkSchema(cookerCheckSchema('editor')), checkSchemaError, async(req: Request, res: Response) => {
  const params = req.body

  const { id } = req.body

  const cooker = await CookerModel.findOne({ id })

  if (!cooker) {
    return res.send({
      code: 90001,
      msg: '当前更新的 id 不存在'
    })
  }

  console.log('---------------editor---------------')

  await CookerModel.updateOne({ id: params.id }, params)

  res.json({
    code: 90001,
    msg: '更新成功！'
  })
})

router.post('/find', checkSchema(cookerFindCheckSchema), checkSchemaError, async(req: Request, res: Response) => {
  const { requestData } = filterParams(req.body)
  const { pageSize, page } = filterParams(req.body)
  let params = {}
  if (requestData.brand) {
    params = { ...params, brand: { $regex: new RegExp(requestData.brand) }}
  }
  if (requestData.name) {
    params = { ...params, name: { $regex: new RegExp(requestData.name) }}
  }

  console.log('---------------find---------------')

  const total = await CookerModel.count(params)
  const list = await CookerModel.find(params, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((page - 1) * pageSize).limit(pageSize)

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
  const data = await CookerModel.findOne({ id })

  res.json({
    code: 90001,
    msg: '查询成功！',
    data
  })
})

router.post('/generate', async(req: Request, res: Response) => {
  const result1 = await getRandomCooker(1)
  const result2 = await getRandomCooker(2)
  const result3 = await getRandomCooker(3)
  const result4 = await getRandomCooker(4)

  const md = `
# 蒸箱款

${getMd(result1)}

# 烤箱款

${getMd(result2)}

# 消毒柜款

${getMd(result3)}

# 蒸烤一体款

${getMd(result4)}
`

  res.json({
    code: 90001,
    msg: '生成成功！',
    data: md
  })
})

async function getRandomCooker(sort: 1 | 2 | 3 | 4) {
  return await CookerModel.aggregate([
    { $match: { sort }},
    { $project: { _id: 0, __v: 0, createTime: 0, updateTime: 0 }},
    { $sort: { price: 1 }},
    { $sample: { size: 3 }}
  ])
}

const random = (max: number, min: number) => Math.floor(Math.random() * (max - min + 1) + min)

function getMd(list: any[]) {
  let md = ``
  if (list.length > 0) {
    list.forEach(item => {
      const max = item.describe.length - 1

      console.log(item.describe)
      md += `
## ${item.brand} ${item.name}

${item.pic}

- 排风量：${item.wind}
- 火力：${item.fire}
- 风压：${item.pa}

**推荐理由**：${item.describe[random(max, 0)]}

${item.url}
`
    })
  }
  return md
}

export default router
