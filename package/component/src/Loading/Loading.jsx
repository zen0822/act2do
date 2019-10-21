/**
 * loading 组件
 * 使用自定义的loading 需要将父元素设置成 position: relative
 *
 * @prop {boolean} bgDisplay - 是否显示 loading 的背景
 * @prop {string} className
 * @prop {string} size - 尺寸
 * @prop {string} text - 等待文字
 * @prop {string} theme - 主题
 * @prop {string} type - 类型(rotate rotate2 dot)
 */

import './Loading.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'

import Icon from '../Icon/Icon'

const TYPE_ROTATE = 'rotate'

const _xclass = (className) => {
  return xclass('loading', className)
}
class Loading extends Component {
  constructor(props) {
    super(props)

    this.compName = 'loading' // 组件名字

    this.state = {
      display: false // 组件显示状态
    }
  }

  _compClass() {
    return _xclass([
      '',
      `theme-${this.props.theme}`,
      { 'mark': this.bgDisplay }
    ])
  }

  /**
     * 显示
     * @return {Object} this - 组件
     */
  show() {
    this.display = true

    return this
  }

  /**
     * 隐藏
     * @return {Object} this - 组件
     */
  hide() {
    this.display = false

    return this
  }

  createTimeout(cb) {
    this.clearTimeout()

    this.timeout = setTimeout(() => {
      this.timeout = null
      this.hide()

      return cb && cb()
    }, this.time)
  }

  clearTimeout() {
    const timeout = this.timeout

    if (timeout) {
      window.clearTimeout(timeout)
      this.timeout = null
    }
  }

  render() {
    let loadingChildren = null

    if (this.props.type === 'rotate') {
      loadingChildren = (
        <div className={_xclass('rotate')}>
          <Icon className={_xclass('icon')} size={this.props.size} kind='spinner' />
          {this.text &&
            <span className={`${compConf.prefix}-css-m-l-half`}>
              {this.text}
            </span>
          }
        </div>
      )
    } else {
      loadingChildren = (
        <div className={_xclass('dot')}>
          {this.text &&
            <span>{this.text}</span>
          }
          {[1, 2, 3].map((item, index) => {
            return (
              <span
                key={index.toString()}
                className={_xclass(`dot-${item}`)}
              >
                .
              </span>
            )
          })}
        </div>
      )
    }

    return (
      <div
        className={this._compClass() + ` ${this.props.className}`}
        style={{
          display: this.props.display ? '' : 'none'
        }}
      >
        <div className={_xclass('wrap')}>
          {loadingChildren}
          {this.props.bgDisplay &&
            <div className={xclass('bg')}></div>
          }
        </div>
      </div>
    )
  }
}

Loading.defaultProps = {
  className: '',
  bgDisplay: false,
  text: '',
  size: 'M',
  type: TYPE_ROTATE,
  theme: 'primary'
}

Loading.propTypes = {
  display: PropTypes.bool,
  className: PropTypes.string,
  bgDisplay: PropTypes.bool,
  text: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string
}

export default Loading
