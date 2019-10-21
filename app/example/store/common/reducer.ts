/**
 * redux 的 common 模块
 */

import {
  ADD_OFFLINE_IMG
} from './action'

export default (state = {}, action: { type: string }): any => {
  switch (action.type) {
    case ADD_OFFLINE_IMG:
      return {
        ...state,
        ...action
      }
    default:
      return {
        ...state
      }
  }
}
