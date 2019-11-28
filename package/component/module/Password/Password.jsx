/**
 * @prop password - 初始化密码
 * @event onChange - 密码变化的事件
 */

import './Password.scss'

import React, { Component } from 'react'
import Row from 'reactComp/component/Row/Row'
import Col from 'reactComp/component/Col/Col'
import Input from 'reactComp/component/Input/Input'

const compPrefix = 'comp-password-comp'

const _xclass = (className) => {
  return `${compPrefix}-${className}`
}

class Password extends Component {
  constructor(props) {
    super(props)

    this.inputRef = []
    this.currentFocusIndex = 0

    this.state = {
      passwordNum: Array(6).fill('')
    }
  }

  _clickInput() {
    if (this.inputRef.length === 0) {
      return false
    }

    const passwordNum = this.state.passwordNum
    const passwordLength = passwordNum.length

    if (passwordNum[passwordLength - 1] !== '') {
      this.inputRef[passwordLength - 1].focus()

      return false
    }

    passwordNum.every((item, index) => {
      const inputIndex = index === 0 ? index : index - 1

      if (item === '') {
        this.inputRef[inputIndex].focus()

        return false
      }

      return true
    })
  }

  _nextFocusInput() {
    const passwordLength = this.state.passwordNum.length
    this.currentFocusIndex = ++this.currentFocusIndex

    if (this.currentFocusIndex === passwordLength) {
      this.currentFocusIndex = passwordLength - 1
    }

    this.inputRef[this.currentFocusIndex].focus()
  }

  _preFocusInput() {
    this.currentFocusIndex = --this.currentFocusIndex

    if (this.currentFocusIndex === -1) {
      this.currentFocusIndex = 0
    }

    this.inputRef[this.currentFocusIndex].focus()
  }

  _handleChange(value, index) {
    const { passwordNum } = this.state
    const { onChange } = this.props
    const passwordLength = passwordNum.length

    this.currentFocusIndex = index
    const passwordNumTemp = Array.from(passwordNum)

    if (value.length === 0) {
      passwordNumTemp[index] = ''
    }

    if (value.length === 1) {
      passwordNumTemp[index] = value[0]
    }

    if (value.length === 2) {
      passwordNumTemp[index] = value[0]

      if (index !== passwordLength - 1) {
        passwordNumTemp[index + 1] = value[1]
      }
    }

    this.setState({
      passwordNum: passwordNumTemp
    }, () => {
      if (value.length === 0) {
        this._preFocusInput()
      }

      if (value.length === 2) {
        this._nextFocusInput()
      }

      onChange && onChange({ value: passwordNumTemp.join('') })
    })
  }

  reset() {
    this.setState({
      passwordNum: Array(6).fill('')
    })
  }

  focus() {
    return this.me.click()
  }

  render() {
    const { passwordNum } = this.state

    return (
      <div ref={(ref) => this.me = ref} className={compPrefix} onClick={() => this._clickInput()}>
        <Row justify='justify' className={_xclass('input-ul')}>
          {passwordNum.map((item, index) => (
            <Col className={_xclass('input-li')} key={index}>
              <Input
                border='none'
                fontSize={30}
                className={_xclass('input-ele')}
                value={item}
                max={2}
                inputInvisible
                onChangeValidate={(value) => {
                  return !(/^\d*$/.test(value))
                }}
                ref={(ref) => ref && (this.inputRef[index] = ref.getWrappedInstance().refInput)}
                onChange={({ value }) => { this._handleChange(value, index) }}
              />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Password
