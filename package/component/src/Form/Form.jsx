/**
 * Form 组件
 *
 * @prop {string} className - 添加类
 * @prop {string} verifyData - 获取表单数据的时候进行数据验证
 */

import './Form.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Row, Col } from 'reactComp'
import { xclass } from '../../util/comp'

// 组件名字
const compName = 'form'
// 表单控件的组件名字
const controlName = ['input', 'menu', 'check', 'areaPicker', 'upload']

const _xclass = (className) => {
  return xclass.call(this, compName, className)
}

class Form extends Component {
  constructor(props) {
    super(props)

    this.compName = compName
    this.value = {} // 表单控件的值
    this.controlHub = []
  }

  /**
     * 初始化表单组件
     */
  _initForm() {
    const controlHub = []

    this.controlHub.forEach((item) => {
      controlName.forEach((controlName) => {
        if (controlName === item.compName) {
          controlHub.push(item)
        }
      })
    })

    this.control = controlHub
  }

  /**
     * 传递控件
     */
  hub(controlHub) {
    this.controlHub = controlHub.slice()

    this._initForm()
  }

  /**
     * 遍历传进来的表单控件的值和表单是否全部验证正确
     *
     * @return {object} -
     *                   verified: 表单是否全部验证正确
     *                   value: 表单值
     */
  mapControl() {
    let verified = true

    this.control.every((item) => {
      if (!controlName.includes(item.compName)) {
        return false
      }

      if (item.props.param) {
        switch (item.compName) {
          case 'check':
            Object.assign(this.value, {
              [item.props.param]: item.val()
            })

            return true
          case 'areaPicker':
          case 'menu':
          default:
            if (item.verify()) {
              Object.assign(this.value, {
                [item.props.param]: item.val()
              })

              return true
            }

            verified = false

            return false
        }
      }

      return true
    })

    return {
      value: this.value,
      verified
    }
  }

  /**
     * 获取表单的值
     */
  val() {
    return this.mapControl().value
  }

  render() {
    return (
      <div className={`${_xclass()} ${this.props.className}`}>
        <form>
          {this.props.children}
        </form>
      </div>
    )
  }
}

Form.defaultProps = {
  className: '',
  verifyData: false
}

Form.propTypes = {
  className: PropTypes.string,
  verifyData: PropTypes.bool
}

export default Form
