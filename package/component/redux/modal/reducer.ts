/**
 * redux 的 modal 模块
 */
import {
  Action,
  combineReducers
} from 'redux'

import {
  ADD_ALERT,
  ADD_ALERT_MESSAGE,
  ADD_ALERT_PROP,
  ADD_CONFIRM,
  ADD_CONFIRM_MESSAGE,
  ADD_CONFIRM_PROP
} from './action'

interface ModalState {
  alert: {
    vm: any | null
    message: string
    prop: object | null
  }
  confirm: {
    vm: any | null
    message: string
    prop: object | null
  }
}

const modalInitState = {
  vm: null,
  message: '',
  prop: null
}

const alert = (state: ModalState['alert'] = modalInitState, action: Action): ModalState['alert'] => {
  switch (action.type) {
    case ADD_ALERT:
    case ADD_ALERT_MESSAGE:
    case ADD_ALERT_PROP:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const confirm = (state: ModalState['confirm'] = modalInitState, action: Action): ModalState['confirm'] => {
  switch (action.type) {
    case ADD_CONFIRM:
    case ADD_CONFIRM_MESSAGE:
    case ADD_CONFIRM_PROP:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default combineReducers({
  alert,
  confirm
})

export {
  ModalState
}
