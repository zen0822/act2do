/**
 * redux 的 common 模块
 */

import { Action } from 'redux'

import {
  ADD_ADDRESS_ID
} from './action'

const initialState = {
  addressId: 1
}

export default (state = initialState, action: Action): any => {
  switch (action.type) {
    case ADD_ADDRESS_ID:
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
