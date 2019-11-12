/**
 * confirm 警告弹窗
 */

import React, { Component } from 'react'
import Modal from './Modal.jsx'

// 创建 confirm 组件
class Confirm extends Component {
  constructor(props) {
    super(props)

    this.onHideHandler = this.onHideHandler.bind(this)
    this.onOkHandler = this.onOkHandler.bind(this)
    this.onNoHandler = this.onNoHandler.bind(this)

    this.state = {
      message: ''
    }
  }

  show() {
    this.confirmRef.confirm.show()
  }

  hide() {
    this.confirmRef.confirm.hide()
  }

  display() {
    return this.confirmRef.confirm.modalDisplay
  }

  onHideHandler() {
    this.props.onHide && this.props.onHide()

    if (this.props.confirmHub.length > 0) {
      const { message, opt } = this.props.confirmHub.shift()

      return this.props.confirm(message, opt)
    }
  }

  onOkHandler() {
    this.props.onOk && this.props.onOk()

    return this.hide()
  }

  onNoHandler() {
    this.props.onNo && this.props.onNo()

    return this.hide()
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        message: this.props.store.getState().common.confirm.message
      })
    })
  }

  render() {
    return <Modal
      {...this.props.store.getState().common.confirm.prop}
      type='confirm'
      onOk={this.onOkHandler}
      onNo={this.onNoHandler}
      onHide={this.onHideHandler}
      message={this.state.message}
      ref={(ref) => (this.confirmRef = ref)}
    />
  }
}

export default Confirm
