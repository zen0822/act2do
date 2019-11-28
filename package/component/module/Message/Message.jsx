/**
 * message 组件
 *
 * @prop {string} className
 * @prop {string} direction - 滑动的方向 (west | south | north | east)
 * @prop {string} position - 信息停留的位置 (center | top | bottom | left | right)
 * @prop {boolean} notAutoHide - 不要自动隐藏
 * @prop {string} info - 提示信息
 * @prop {boolean} kind - 提示动画（默认是 slide），后续加上其他动画效果例如：bounce
 * @prop {string} speed - 速度
 * @prop {string} theme - 主题
 * @prop {string} type - 提示类型（default, success, danger）
 *
 * @prop {function} show - 显示之后的回调函数
 * @prop {function} hide - 隐藏之后的回调函数
 */

import './Message.scss'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Pop from '../Pop/Pop'
import { xclass } from '../../util/comp'

import {
  handleEleDisplay
} from '../../util/dom/prop'

const _xclass = (className) => {
  return xclass('message', className)
}

const MESSAGE_DISPLAY_TIME = 1500

class Message extends Component {
  constructor(props) {
    super(props)

    this.compName = 'message' // 组件名字
    this.timer = {} // setTimeout 定时器
    this.messageDisplay = false // 组件显示状态

    this._afterPopEnter = this._afterPopEnter.bind(this)
    this._afterPopLeave = this._afterPopLeave.bind(this)
  }

  _compClass() {
    return _xclass([
      '',
      `type-${this.props.type}`
    ]) + ' ' + this.props.className
  }

  /**
     * pop 进来的钩子
     */
  _afterPopEnter() {
    if (!this.props.notAutoHide) {
      this.timer = setTimeout(() => {
        this.hide()
      }, MESSAGE_DISPLAY_TIME)
    }
  }

  /**
     * pop 离开的钩子
     */
  _afterPopLeave() {
    this.meRef.style.display = 'none'
  }

  /**
     * 显示 message
     *
     * @param {Number} - 当前页码
     * @return {Object}
     */
  async show() {
    this.messageDisplay = true
    this.meRef.style.display = ''

    try {
      await this.popRef.enter()

      this.props.show && this.props.show()
    } catch (error) {
      console.warn(error)
    }
  }

  /**
     * 隐藏 message
     *
     * @return {Object}
     */
  async hide() {
    this.messageDisplay = false
    clearTimeout(this.timer)

    try {
      await this.popRef.leave()

      this.props.hide && this.props.hide()
    } catch (error) {
      console.warn(error)
    }
  }

  componentDidMount() {
    handleEleDisplay({
      element: this.meRef,
      cb: () => {
        this.popRef.computePosition()
      }
    })
  }

  componentDidUpdate() {
    handleEleDisplay({
      element: this.meRef,
      cb: () => {
        this.popRef.computePosition()
      }
    })
  }

  render() {
    return (
      <div
        className={`${this._compClass()}`}
        ref={(ref) => (this.meRef = ref)}
        style={{
          display: this.messageDisplay ? '' : 'none'
        }}
      >
        <Pop
          afterEnter={this._afterPopEnter}
          afterLeave={this._afterPopLeave}
          className={`${_xclass('pop')}`}
          position={this.props.position}
          ref={(ref) => (this.popRef = ref)}
          speed={this.props.speed}
          kind={this.props.kind}
        >
          {this.props.info === undefined
            ? this.props.children
            : this.props.info
          }
        </Pop>
      </div>
    )
  }
}

Message.defaultProps = {
  className: '',
  direction: 'south',
  position: 'center',
  notAutoHide: false,
  kind: 'fade',
  speed: 'normal',
  theme: 'primary',
  type: 'pop'
}

Message.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.string,
  kind: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  position: PropTypes.string,
  notAutoHide: PropTypes.bool,
  speed: PropTypes.string,
  theme: PropTypes.string,
  type: PropTypes.string
}

export default Message
