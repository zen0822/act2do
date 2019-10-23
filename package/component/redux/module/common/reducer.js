/**
 * redux 的 common 模块
 */
import {
  combineReducers
} from 'redux'

import {
  ADD_ALERT,
  ADD_ALERT_MESSAGE,
  ADD_ALERT_PROP,
  ADD_CONFIRM,
  ADD_CONFIRM_MESSAGE,
  ADD_CONFIRM_PROP,
  ADD_TIP,
  ADD_TIP_MESSAGE,
  ADD_TOAST,
  ADD_TOAST_MESSAGE
} from './action'

const alert = (state = {}, action) => {
  switch (action.type) {
    case ADD_ALERT:
      return {
        ...state,
        ...action
      }
    case ADD_ALERT_MESSAGE:
      return {
        ...state,
        ...action
      }
    case ADD_ALERT_PROP:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const confirm = (state = {}, action) => {
  switch (action.type) {
    case ADD_CONFIRM:
      return {
        ...state,
        ...action
      }
    case ADD_CONFIRM_MESSAGE:
      return {
        ...state,
        ...action
      }
    case ADD_CONFIRM_PROP:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const tip = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIP:
      return {
        ...state,
        ...action
      }
    case ADD_TIP_MESSAGE:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const toast = (state = {}, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        ...action
      }
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
  toast,
  alert,
  confirm
})
