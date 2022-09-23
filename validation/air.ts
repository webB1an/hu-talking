import type { Schema } from 'express-validator'

export const airCheckSchema: (type: 'add' | 'editor') => Schema = (type: 'add' | 'editor') => {
  const check: Schema = {
    sort: {
      toInt: true,
      isIn: {
        options: [[1, 2]],
        errorMessage: 'sort 请输入正确的参数'
      }
    },
    brand: {
      notEmpty: true,
      errorMessage: 'brand 参数不能为空'
    },
    type: {
      notEmpty: true,
      errorMessage: 'type 参数不能为空'
    },
    price: {
      notEmpty: true,
      errorMessage: 'price 请输入正确的参数类型'
    },
    power: {
      notEmpty: true,
      errorMessage: 'power 参数不能为空'
    },
    quality: {
      toInt: true,
      isInt: true,
      errorMessage: 'quality 请输入正确的参数类型'
    },
    url: {
      notEmpty: true,
      errorMessage: 'url 参数不能为空'
    },
    describe: {
      notEmpty: true,
      isArray: true,
      errorMessage: 'describe 请输入正确的参数类型'
      // custom: {
      //   options: (value, { req, location, path }) => {
      //     try {
      //       if (!Array.isArray(JSON.parse(value))) throw new Error('describe 请输入正确的参数类型')
      //       return JSON.parse(value)
      //     } catch (error) {
      //       throw new Error('describe 请输入正确的参数类型')
      //     }
      //   }
      // }
    }
  }

  return type === 'add' ? check : {
    id: {
      notEmpty: true,
      errorMessage: 'id 参数不能为空'
    },
    ...check
  }
}

export const airFindCheckSchema: Schema = {
  pageSize: {
    notEmpty: true,
    isInt: true,
    errorMessage: '缺少 pageSize 参数'
  },
  page: {
    notEmpty: true,
    isInt: true,
    errorMessage: '缺少 page 参数'
  },
  requestData: {
    custom: {
      options: (value, { req, location, path }) => {
        try {
          if (typeof value === 'object') return value
          return JSON.parse(value)
        } catch (error) {
          throw new Error('请输入正确的参数类型')
        }
      }
    }
  }
}
