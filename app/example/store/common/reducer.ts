/**
 * redux 的 common 模块
 */

import { Action } from 'redux'

import {
  ADD_ADDRESS_ID
} from './action'

interface CommonState {
  addressId: number
}

const initialState = {
  addressId: 0
}

export default (state: CommonState = initialState, action: Action): any => {
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

export {
  CommonState
}
