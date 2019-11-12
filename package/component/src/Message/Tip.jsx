/**
 * 弹出样式的提示
 */

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import Tip from './TipComp.jsx'
import compConfig from '../../config.json'
import { common as commonStore } from '../../redux/store'
import { addTip, addTipMessage } from '../../redux/module/common/action'

let tiping = false // 是否正在显示 tip 组件
const tipHub = [] // 存储需要显示 tip 的队列

const store = createStore(
  commonStore,
  applyMiddleware(
    thunkMiddleware
  )
)

// 创建并挂载 tip 组件
const compId = `${compConfig.prefix}-tip`
const tipElement = document.createElement('div')
let tipVm = null
tipElement.id = compId
document.body.appendChild(tipElement)

/**
 * 暴露调用函数
 *
 * @param {string} message - 提示信息
 * @param {object} opt - 选项
 */
const tip = async (message = '', opt = {}) => {
  if (!message) return
  if (tiping) {
    if (opt.deWeighting) {
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
  <Tip
    store={store}
    ref={(vm) => (tipVm = vm)}
    onAutoHideCb={() => {
      tiping = false
    }}
    tipHub={tipHub}
    tip={tip}
  />,
  tipElement
)
store.dispatch(addTip(tipVm))


export default tip
