/**
 * alert 警告弹窗
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import compConfig from '../../config.json'
import { common as commonStore } from '../../redux/store'
import { addAlert, addAlertMessage, addAlertProp } from '../../redux/module/common/action'
import Alert from './AlertComp'

let alerting = false // 是否正在显示 alert 组件
let alertHub = [] // 存储需要显示 alert 的队列
let okCb = null // 点击确定的回调函数
let compInitOpt = {} // 组件的初始数据

const store = createStore(
    commonStore,
    applyMiddleware(
        thunkMiddleware
    )
)

/**
 * 暴露调用函数
 *
 * @param {string} message - 提示信息
 * @param {object} opt - 选项
 *                       cb：点击确定之后的回调函数
 */
const alert = async (message = '', opt = {}) => {
    if (alerting) {
        return alertHub.push({
            message,
            opt
        })
    }

    okCb = opt.okCb

    onhashchange = () => {
        alertVm.hide()
    }

    compInitOpt = {
        theme: opt.theme,
        okBtn: opt.okBtn ? opt.okBtn : '确定'
    }

    store.dispatch(addAlertMessage(message))
    store.dispatch(addAlertProp(compInitOpt))

    return new Promise(async (resolve, reject) => {
        try {
            alerting = true

            await alertVm.show()

            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

const hide = () => {
    return alertVm.hide()
}

/**
 * 获取显示状态
 */
const display = () => {
    return alertVm.display()
}

// 创建并挂载 alert 组件
const compId = `${compConfig.prefix}-alert`
const alertElement = document.createElement('div')
let alertVm = null
alertElement.id = compId
document.body.appendChild(alertElement)
render(
    <Alert
        alertHub={alertHub}
        store={store}
        onOk={() => {
            okCb && okCb()
        }}
        alert={alert}
        onHide={() => {
            alerting = false
        }}
        ref={(vm) => alertVm = vm}
    />,
    alertElement
)
store.dispatch(addAlert(alertVm))

export default alert

export {
    confirm,
    hide,
    display
}
