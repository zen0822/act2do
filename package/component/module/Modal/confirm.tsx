/**
 * confirm 确认弹窗
 */

import React from 'react'
import { render } from 'react-dom'

import compConfig from '../../config.json'
import { store } from '../../redux'
import { addConfirm, addConfirmMessage, addConfirmProp } from '../../redux/modal/action'
import { Provider as ReduxProvider } from 'react-redux'
import Confirm from './ConfirmComp'

type TOpt = {
  noBtn?: string
  noCb?: () => void
  okBtn?: string
  okCb?: () => void
  header?: string
  hideCb?: () => void
  skip?: boolean
  theme?: string
}

let confirming = false // 是否正在显示 confirm 组件
const confirmHub: Array<any> = [] // 存储需要显示 confirm 的队列
let okCb: Function | null = null // 点击确定的回调函数
let noCb: Function | null = null // 点击取消的回调函数
let hideCb: Function | null = null // 关闭时的回调
let compInitOpt = {} // 组件的初始数据
let skipRoute = false // 弹框出现是否允许路由跳转
let confirmVm: any = null

/**
 * 暴露调用函数
 *
* @param {string} message - 提示信息
* @param {object} opt - 选项
*                       okCb：点击确定之后的回调函数
*                       header：弹窗标题
*                       skip: 允许路由跳转，默认 false
*/
const confirm = async (
  message: string | number,
  opt: TOpt = {}
): Promise<any> => {
  const {
    okBtn = '确定',
    noBtn = '取消',
    header = '',
    skip = false,
    theme = 'primary'
  } = opt

  if (confirming) {
    return confirmHub.push({
      message,
      opt
    })
  }

  skipRoute = skip === undefined ? false : skip

  if (opt.okCb) {
    okCb = opt.okCb
  }
  if (opt.noCb) {
    noCb = opt.noCb
  }
  if (opt.hideCb) {
    hideCb = opt.hideCb
  }

  compInitOpt = {
    theme,
    header,
    okBtn,
    noBtn
  }

  store.dispatch(addConfirmMessage(message))
  store.dispatch(addConfirmProp(compInitOpt))

  try {
    confirming = true

    await confirmVm.show()
  } catch (error) {
    console.warn(error)
  }
}

const hide = (): void => {
  return confirmVm.hide()
}

/**
 * 获取显示状态
 */
const display = (): void | boolean => {
  if (skipRoute) {
    skipRoute = false

    return false
  }

  return confirmVm.display()
}

// 创建并挂载 confirm 组件
const compId = `${compConfig.prefix}-confirm`
const confirmElement = document.createElement('div')
confirmElement.id = compId
document.body.appendChild(confirmElement)

render(
  <ReduxProvider store={store}>
    <Confirm
      confirmHub={confirmHub}
      confirm={confirm}
      onOk={(): void => (okCb && okCb())}
      onNo={(): void => (noCb && noCb())}
      onHide={(): void => {
        hideCb && hideCb()
        confirming = false
      }}
      ref={(vm: any): void => (confirmVm = vm)}
    />
  </ReduxProvider>,
  confirmElement
)

store.dispatch(addConfirm(confirmVm))

export default confirm

export {
  confirm,
  hide,
  display
}
