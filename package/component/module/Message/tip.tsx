/**
 * 弹出样式的提示
 */

import React from 'react'
import { render } from 'react-dom'

import Tip from './TipComp'
import compConfig from '../../config.json'
import { store } from '../../redux'
import { Provider as ReduxProvider } from 'react-redux'
import { addTip, addTipMessage } from '../../redux/message/action'

type TOpt = {
  cb?: () => void
  dereplication?: boolean
}

let tiping = false // 是否正在显示 tip 组件
const tipHub: Array<any> = [] // 存储需要显示 tip 的队列

// 创建并挂载 tip 组件
const compId = `${compConfig.prefix}-tip`
const tipElement = document.createElement('div')
let tipVm: any = null
tipElement.id = compId
document.body.appendChild(tipElement)

/**
 * 暴露调用函数
 *
 * @param {string} message - 提示信息
 * @param {object} opt - 选项
 *                     cb - 执行完之后触发的函数
 *                     dereplication - 去除重复的信息
 */
const tip = async (message = '', opt: TOpt = {}): Promise<any> => {
  if (!message) return

  if (tiping) {
    if (opt.dereplication) {
      if (tipHub.every(item => item.message !== message)) {
        return tipHub.push({
          message,
          opt
        })
      } else {
        return tipHub
      }
    } else {
      return tipHub.push({
        message,
        opt
      })
    }
  }

  store.dispatch(addTipMessage(message))

  try {
    tiping = true

    await tipVm.show()

    opt.cb && opt.cb()
  } catch (error) {
    console.warn(error)
  }
}

render(
  <ReduxProvider store={store}>
    <Tip
      ref={(vm: any): void => (tipVm = vm)}
      onAutoHideCb={(): void => {
        tiping = false
      }}
      tipHub={tipHub}
      tip={tip}
    />
  </ReduxProvider>,
  tipElement
)
store.dispatch(addTip(tipVm))


export default tip
