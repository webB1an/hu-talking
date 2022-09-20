import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export default function checkSchemaError(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.json({
      code: 90002,
      msg: errors.array().map(err => err.msg).join(' | ')
    })
  }
  next()
}
