/**
 * check 组件
 *
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {array|string|number} value - 初始化选择框值，checkbox 是数组，radio 则为字符串或者数字
 * @prop {array} item - 初始化选择框组
 * @prop {string} param - 表单控件的形参名
 * @prop {boolean} radio - 设置为单选
 * @prop {boolean} disabled - 设置为只读
 *
 * @event onChange - 选择框的状态发生改变事件
 */

import './Check.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import Row from '../Row/Row'
import Col from '../Col/Col'
import { xclass } from '../../util/comp'
import { uid } from '../../util/util'

class Check extends Component {
  constructor(props) {
    super(props)

    this.compName = 'check' // 组件名字
    this.uniqueName = uid() // 选择框的 name 的值

    this.changeHandler = this.changeHandler.bind(this)

    this.state = {
      value: props.value,
      item: props.item
    }
  }

  _xclass(className) {
    return xclass.call(this, 'check', className)
  }

  _compClass() {
    return this._xclass([
      ''
    ])
  }

  /**
     * 删除或者增加 checkbox 的 value 值
     *
     * @param {String, Number} - checkbox 的值
     */
  _changeCheckbox(val) {
    let hasDelflag = false
    const value = this.state.value.slice()

    value.every((item, index) => {
      if (val === item) {
        hasDelflag = true
        value.splice(index, 1)

        return false
      }

      return true
    })

    if (!hasDelflag) {
      value.push(val)
    }

    return this.setState({
      value
    })
  }

  /**
     * 获取 value
     */
  val() {
    return this.state.value
  }

  /**
     * 选择框的状态改变
     *
     * @param {object} event
     * @param {string, number} value
     */
  changeHandler(event, value) {
    this.props.onChange && this.props.onChange()

    const checked = event.currentTarget.checked

    if (this.props.radio) {
      this.setState({
        value
      })
    } else {
      this._changeCheckbox(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      item: nextProps.item
    })
  }

  render() {
    return (
      <div className={`${this._compClass()} ${this.props.className}`}>
        <Row>
          {this.state.item.map((item, index) => {
            return (
              <Col key={index.toString()}>
                <label className={this._xclass('label')}>
                  <input
                    onChange={(event) => this.changeHandler(event, item.value)}
                    type={this.props.radio ? 'radio' : 'checkbox'}
                    checked={
                      this.props.radio
                        ? this.state.value === item.value
                        : this.state.value.includes(item.value)
                    }
                    disabled={this.props.disabled}
                    name={this.props.param ? this.props.param : this.uniqueName}
                  />
                  <span>
                    {item.text}
                  </span>
                </label>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}

Check.defaultProps = {
  className: '',
  param: '',
  radio: false,
  disabled: false,
  theme: ''
}

Check.propTypes = {
  className: PropTypes.string,
  item: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number
  ]),
  param: PropTypes.string,
  radio: PropTypes.bool,
  disabled: PropTypes.bool,
  theme: PropTypes.string
}

export default Check
