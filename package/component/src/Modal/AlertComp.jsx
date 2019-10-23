/**
 * alert 警告弹窗
 */

import React, { Component } from 'react'
import Modal from './Modal.jsx'

// 创建 alert 组件
class Alert extends Component {
  constructor(props) {
    super(props)

    this.onHideHandler = this.onHideHandler.bind(this)
    this.onOkHandler = this.onOkHandler.bind(this)

    this.state = {
      message: ''
    }
  }

  show() {
    this.refs.alert.show()
  }

  hide() {
    this.refs.alert.hide()
  }

  display() {
    return this.refs.alert.modalDisplay
  }

  onHideHandler() {
    this.props.onHide && this.props.onHide()

    if (this.props.alertHub.length > 0) {
      const { message, opt } = this.props.alertHub.shift()

      return this.props.alert(message, opt)
    }
  }

  onOkHandler() {
    this.props.onOk && this.props.onOk()

    return this.hide()
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        message: this.props.store.getState().common.alert.message
      })
    })
  }

  render() {
    return <Modal
      {...this.props.store.getState().common.alert.prop}
      type='alert'
      onOk={this.onOkHandler}
      onHide={this.onHideHandler}
      message={this.state.message}
      ref='alert'
    />
  }
}

export default Alert
