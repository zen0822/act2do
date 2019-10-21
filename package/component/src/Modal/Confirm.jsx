/**
 * confirm 警告弹窗
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import compConfig from '../../config.json'
import { common as commonStore } from '../../redux/store'
import { addConfirm, addConfirmMessage, addConfirmProp } from '../../redux/module/common/action'
import Confirm from './ConfirmComp'

let confirming = false // 是否正在显示 confirm 组件
let confirmHub = [] // 存储需要显示 confirm 的队列
let okCb = null // 点击确定的回调函数
let noCb = null // 点击取消的回调函数
let hideCb = null // 关闭时的回调
let compInitOpt = {} // 组件的初始数据
let enableRoute = false // 弹框出现是否允许路由跳转

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
 *                       okCb：点击确定之后的回调函数
 *                       header：弹窗标题
 *                       route: 允许路由跳转，默认 false
 */
const confirm = async (message = '', opt = {}) => {
    if (confirming) {
        return confirmHub.push({
            message,
            opt
        })
    }

    okCb = opt.okCb
    noCb = opt.noCb
    hideCb = opt.hideCb
    enableRoute = opt.route

    compInitOpt = {
        theme: opt.theme,
        header: opt.header,
        okBtn: opt.okBtn ? opt.okBtn : '确定',
        noBtn: opt.noBtn ? opt.noBtn : '取消'
    }

    store.dispatch(addConfirmMessage(message))
    store.dispatch(addConfirmProp(compInitOpt))

    return new Promise(async (resolve, reject) => {
        try {
            confirming = true

            await confirmVm.show()

            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

const hide = () => {
    return confirmVm.hide()
}

/**
 * 获取显示状态
 */
const display = () => {
    if (enableRoute) {
        enableRoute = false

        return false
    }

    return confirmVm.display()
}

// 创建并挂载 confirm 组件
const compId = `${compConfig.prefix}-confirm`
const confirmElement = document.createElement('div')
let confirmVm = null
confirmElement.id = compId
document.body.appendChild(confirmElement)
render(
    <Confirm
        confirmHub={confirmHub}
        store={store}
        confirm={confirm}
        onOk={() => {
            okCb && okCb()
        }}
        onNo={() => {
            noCb && noCb()
        }}
        onHide={() => {
            hideCb && hideCb()
            confirming = false
        }}
        ref={(vm) => confirmVm = vm}
    />,
    confirmElement
)
store.dispatch(addConfirm(confirmVm))


export default confirm

export {
    confirm,
    hide,
    display
}
