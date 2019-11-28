/**
 * alert 警告弹窗
 */

import React from 'react'
import { render } from 'react-dom'

import compConfig from '../../config.json'
import { store } from '../../redux'
import { addAlert, addAlertMessage, addAlertProp } from '../../redux/modal/action'
import { Provider as ReduxProvider } from 'react-redux'
import Alert from './AlertComp'

type TOpt = {
  okCb?: () => void
  header?: string
  theme?: string
  okBtn?: string
}

let alerting = false // 是否正在显示 alert 组件
const alertHub: Array<any> = [] // 存储需要显示 alert 的队列
let okCb: Function | null = null // 点击确定的回调函数
let compInitOpt = {} // 组件的初始数据

// 创建并挂载 alert 组件
const compId = `${compConfig.prefix}-alert`
const alertElement = document.createElement('div')
let alertVm: any = null

/**
 * 暴露调用函数
 *
 * @param message - 提示信息
 * @param opt - 选项
 *                       cb：点击确定之后的回调函数
 */
const alert = async (message: string | number, opt: TOpt = {}): Promise<any> => {
  const {
    okBtn = '确定',
    theme = 'primary',
    header = ''
  } = opt

  if (alerting) {
    return alertHub.push({
      message,
      opt
    })
  }

  if (opt.okCb) {
    okCb = opt.okCb
  }

  onhashchange = (): void => {
    alertVm.hide()
  }

  compInitOpt = {
    header,
    theme,
    okBtn
  }

  store.dispatch(addAlertMessage(message))
  store.dispatch(addAlertProp(compInitOpt))

  try {
    alerting = true

    await alertVm.show()
  } catch (error) {
    console.warn(error)
  }
}

/**
 * 隐藏
 */
const hide = (): void => {
  return alertVm.hide()
}

/**
 * 获取显示状态
 */
const display = (): boolean => {
  return alertVm && alertVm.display()
}

alertElement.id = compId
document.body.appendChild(alertElement)

render(
  <ReduxProvider store={store}>
    <Alert
      alert={alert}
      alertHub={alertHub}
      onOk={(): void => {
        okCb && okCb()
      }}
      onHide={(): void => {
        alerting = false
      }}
      ref={(vm: any): void => (alertVm = vm)}
    />
  </ReduxProvider>,
  alertElement
)

store.dispatch(addAlert(alertVm))

export default alert

export {
  alert,
  hide,
  display
}
