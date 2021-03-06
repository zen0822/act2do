/*
 * action 创建函数
 */
import { AnyAction } from 'redux'

export const ADD_ALERT = 'ADD_ALERT'
export const ADD_ALERT_MESSAGE = 'ADD_ALERT_MESSAGE'
export const ADD_ALERT_PROP = 'ADD_ALERT_PROP'

export const ADD_CONFIRM = 'ADD_CONFIRM'
export const ADD_CONFIRM_MESSAGE = 'ADD_CONFIRM_MESSAGE'
export const ADD_CONFIRM_PROP = 'ADD_CONFIRM_PROP'

export const ADD_TIP = 'ADD_TIP'
export const ADD_TIP_MESSAGE = 'ADD_TIP_MESSAGE'

export const ADD_TOAST = 'ADD_TOAST'
export const ADD_TOAST_MESSAGE = 'ADD_TOAST_MESSAGE'

export const addAlert = (vm: any): AnyAction => {
  return {
    type: ADD_ALERT,
    vm
  }
}

export const addAlertMessage = (message: string | number): AnyAction => {
  return {
    type: ADD_ALERT_MESSAGE,
    message
  }
}

export const addAlertProp = (prop: object): AnyAction => {
  return {
    type: ADD_ALERT_PROP,
    prop
  }
}

export const addConfirm = (vm: any): AnyAction => {
  return {
    type: ADD_CONFIRM,
    vm
  }
}

export const addConfirmMessage = (message: string | number): AnyAction => {
  return {
    type: ADD_CONFIRM_MESSAGE,
    message
  }
}

export const addConfirmProp = (prop: object): AnyAction => {
  return {
    type: ADD_CONFIRM_PROP,
    prop
  }
}

export const addTip = (vm: any): AnyAction => {
  return {
    type: ADD_TIP,
    vm
  }
}

export const addTipMessage = (message: string | number): AnyAction => {
  return {
    type: ADD_TIP_MESSAGE,
    message
  }
}

export const addToast = (vm: object): AnyAction => {
  return {
    type: ADD_TOAST,
    vm
  }
}

export const addToastMessage = (message: string | number): AnyAction => {
  return {
    type: ADD_TOAST_MESSAGE,
    message
  }
}
