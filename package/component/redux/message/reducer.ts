/**
 * redux 的 common 模块
 */
import {
  Action,
  combineReducers
} from 'redux'

import {
  ADD_TIP,
  ADD_TIP_MESSAGE,
  ADD_TOAST,
  ADD_TOAST_MESSAGE
} from './action'

interface MessageState {
  toast: {
    vm: any | null
    message: string
  }
  tip: {
    vm: any | null
    message: string
  }
}

const messageInitState = {
  vm: null,
  message: ''
}

const tip = (state: MessageState['tip'] = messageInitState, action: Action): MessageState['tip'] => {
  switch (action.type) {
    case ADD_TIP:
    case ADD_TIP_MESSAGE:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const toast = (state: MessageState['tip'] = messageInitState, action: Action): MessageState['toast'] => {
  switch (action.type) {
    case ADD_TOAST:
    case ADD_TOAST_MESSAGE:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default combineReducers({
  tip,
  toast
})

export {
  MessageState
}
