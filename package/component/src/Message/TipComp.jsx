/**
 * 弹出样式的提示
 */

import React, { Component } from 'react'

import Message from './Message.jsx'

// 创建 tip 组件
class Tip extends Component {
  constructor(props) {
    super(props)

    this.autoHideCb = this.autoHideCb.bind(this)

    this.state = {
      message: ''
    }
  }

  show() {
    this.messageRef.show()
  }

  hide() {
    this.messageRef.hide()
  }

  autoHideCb() {
    this.props.onAutoHideCb && this.props.onAutoHideCb()

    if (this.props.tipHub.length > 0) {
      const { message, opt } = this.props.tipHub.shift()

      return this.props.tip(message, opt)
    }
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        message: this.props.store.getState().common.tip.message
      })
    })
  }

  render() {
    return <Message
      hide={this.autoHideCb}
      info={this.state.message}
      kind='fade'
      ref={(ref) => (this.messageRef = ref)}
    />
  }
}

export default Tip
