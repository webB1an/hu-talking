import pickBy from 'lodash/pickBy'
import type { Obj } from '../interface/common'

export function filterParams(params: Obj) {
  return pickBy(params)
}

