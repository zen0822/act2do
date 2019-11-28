/**
 * 底部弹出的提示（toast)
 */

import React from 'react'
import { render } from 'react-dom'

import Toast from './ToastComp'
import compConfig from '../../config.json'
import { store } from '../../redux'
import { Provider as ReduxProvider } from 'react-redux'
import { addToast, addToastMessage } from '../../redux/message/action'

type TOpt = {
  cb?: () => void
  dereplication?: boolean
}

let toasting = false // 是否正在显示 toast 组件
const toastHub: Array<any> = [] // 存储需要显示 toast 的队列

// 创建并挂载 toast 组件
const compId = `${compConfig.prefix}-toast`
const toastElement = document.createElement('div')
let toastVm: any = null
toastElement.id = compId
document.body.appendChild(toastElement)

/**
 * 暴露调用函数
 *
 * @param {string} message - 提示信息
 * @param {object} opt - 选项
 *                     cb - 执行完之后触发的函数
 *                     dereplication - 去除重复的信息
 */
const toast = async (message = '', opt: TOpt = {}): Promise<any> => {
  if (!message) return

  if (toasting) {
    if (opt.dereplication) {
      if (toastHub.every(item => item.message !== message)) {
        return toastHub.push({
          message,
          opt
        })
      } else {
        return toastHub
      }
    } else {
      return toastHub.push({
        message,
        opt
      })
    }
  }

  store.dispatch(addToastMessage(message))

  try {
    toasting = true

    await toastVm.show()

    opt.cb && opt.cb()
  } catch (error) {
    console.warn(error)
  }
}

render(
  <ReduxProvider store={store}>
    <Toast
      ref={(vm: any): void => (toastVm = vm)}
      onAutoHideCb={(): void => {
        toasting = false
      }}
      toastHub={toastHub}
      toast={toast}
    />
  </ReduxProvider>,
  toastElement
)
store.dispatch(addToast(toastVm))


export default toast
