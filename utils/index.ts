import pickBy from 'lodash/pickBy'
import type { Obj } from '../interface/common'

export function filterParams(params: Obj) {
  return pickBy(params)
}

export const random = (max: number, min: number) => Math.floor(Math.random() * (max - min + 1) + min)
