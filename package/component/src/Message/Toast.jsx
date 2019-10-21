/**
 * 底部弹出的提示（toast)
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import Message from './Message.jsx'
import compConfig from '../../config.json'
import { common as commonStore } from '../../redux/store'
import { addToast, addToastMessage } from '../../redux/module/common/action'

let toasting = false // 是否正在显示 toast 组件
let toastHub = [] // 存储需要显示 toast 的队列

const store = createStore(
    commonStore,
    applyMiddleware(
        thunkMiddleware
    )
)

// 创建 toast 组件
class Toast extends Component {
    constructor(props) {
        super(props)

        this.autoHideCb = this.autoHideCb.bind(this)

        this.state = {
            message: ''
        }
    }

    show() {
        this.refs.message.show()
    }

    hide() {
        this.refs.message.hide()
    }

    autoHideCb() {
        toasting = false

        if (toastHub.length > 0) {
            const { message, opt } = toastHub.shift()

            return toast(message, opt)
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                message: store.getState().common.toast.message
            })
        })
    }

    render() {
        return <Message
            hide={this.autoHideCb}
            info={this.state.message}
            position='bottom'
            kind='fade'
            ref='message' />
    }
}

// 创建并挂载 toast 组件
const compId = `${compConfig.prefix}-toast`
const toastElement = document.createElement('div')
let toastVm = null
toastElement.id = compId
document.body.appendChild(toastElement)
render(<Toast ref={(vm) => toastVm = vm} />, toastElement)
store.dispatch(addToast(toastVm))

/**
 * 暴露调用函数
 *
 * @param {string} message - 提示信息
 * @param {object} opt - 选项
 */
const toast = async (message = '', opt = {}) => {
    if (toasting) {
        return toastHub.push({
            message,
            opt
        })
    }

    store.dispatch(addToastMessage(message))

    return new Promise(async (resolve, reject) => {
        try {
            toasting = true

            await toastVm.show()

            opt.cb && opt.cb()

            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

export default toast
