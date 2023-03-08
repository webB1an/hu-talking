import express from 'express'
import type { Router, Request, Response } from 'express'
import KeyboardModel from '../models/keyboard'


const router: Router = express.Router()

router.post('/find', async(req, res, next) => {
  const { id = '', name = '', switchs = '', light = '', connect = 6, minPrice = 0, maxPrice = 4000, minKeys = 0, maxKeys = 108 } = req.body
  let options

  if (id) {
    options = { id }
  } else {
    options = { price: { '$gte': minPrice, '$lte': maxPrice }, keys: { '$gte': minKeys, '$lte': maxKeys }}

    if (name) {
      const reg = new RegExp(name)
      options = { ...options, name: { $regex: reg }}
    }

    if (switchs) {
      options = { ...options, switchs }
    }

    if (light) {
      options = { ...options, light }
    }

    if (connect !== 6) {
      options = { ...options, connect }
    }
  }

  console.log('---------------search options---------------', options)

  const total = await KeyboardModel.count(options)
  const list = await KeyboardModel.find(options, { _id: 0, __v: 0, createTime: 0, updateTime: 0 }).sort({ price: 1 })

  res.json({
    code: 90001,
    msg: '查询成功！',
    data: {
      total,
      list
    }
  })
})

router.post('/add', async(req, res, next) => {
  const { name, price, switchs, keys, light, connect, describe, url } = req.body
  console.log('---------------req.body---------------', req.body)
  const keyboard = await KeyboardModel.find({ name })

  if (keyboard.length) {
    return res.send({
      code: 90003,
      msg: '输入名称已存在'
    })
  } else {
    await KeyboardModel.insertMany([
      { name, price, switchs, keys, light, connect, describe, url }
    ])
    res.json({
      code: 90001,
      msg: '新建成功！'
    })
  }
})

router.post('/detail/:id', async(req, res, next) => {
  const id = req.params.id
  console.log('---------------req.body---------------', req.body)

  if (!id) {
    return res.send({
      code: 90003,
      msg: '参数不正确！'
    })
  }

  const data = await KeyboardModel.findOne({ id })

  res.json({
    code: 90001,
    msg: '查询成功！',
    data
  })
})

router.post('/editor', async(req, res, next) => {
  const {
    id = '',
    name = '',
    price = '',
    switchs = '',
    keys = '',
    connect = 0,
    light = '',
    describe = '',
    url = ''
  } = req.body

  console.log('---------------req.body---------------', req.body)

  if (!id) {
    return res.send({
      code: 90003,
      msg: '参数不正确！'
    })
  } else {
    await KeyboardModel.updateOne({ id }, {
      $set: {
        name,
        price,
        switchs,
        keys,
        connect,
        light,
        describe,
        url
      }
    })

    res.json({
      code: 90001,
      msg: '数据修改成功！'
    })
  }
})

router.post('/del', async(req: Request, res: Response) => {
  const { id } = req.body

  if (!id) {
    return res.send({
      code: 90002,
      msg: '缺少需要删除的 id'
    })
  }

  const cooker = await KeyboardModel.findOne({ id })

  if (!cooker) {
    return res.send({
      code: 90001,
      msg: '当前删除的 id 不存在'
    })
  }

  console.log('---------------delete---------------')

  await KeyboardModel.deleteOne({ id })

  res.json({
    code: 90001,
    msg: '删除成功！'
  })
})

router.post('/generate', async(req: Request, res: Response) => {
  const { id = '', name = '', switchs = '', light = '', connect = 6, minPrice = 0, maxPrice = 4000, minKeys = 0, maxKeys = 108 } = req.body
  let options

  if (id) {
    options = { id }
  } else {
    options = { price: { '$gte': minPrice, '$lte': maxPrice }, keys: { '$gte': minKeys, '$lte': maxKeys }}

    if (name) {
      const reg = new RegExp(name)
      options = { ...options, name: { $regex: reg }}
    }

    if (switchs) {
      options = { ...options, switchs }
    }

    if (light) {
      options = { ...options, light }
    }

    if (connect !== 6) {
      options = { ...options, connect }
    }
  }

  const result = await KeyboardModel.aggregate([
    { $match: options},
    { $project: { _id: 0, __v: 0, createTime: 0, updateTime: 0 }},
    { $sample: { size: 3 }},
    { $sort: { price: 1 }},
  ])

  res.json({
    code: 90001,
    msg: '查询成功！',
    data: result
  })
})

export default router