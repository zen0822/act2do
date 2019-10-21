/**
 * icon 组件
 *
 * @prop theme - 主题
 * @prop size - 大小 (XS | S | M | L | XL)
 * @prop type - 字符图标类型
 *              (字符图标的 class 名的前缀，
 *              用户自己引入的 阿里妈妈的 iconfont 的字符图标的前缀)
 * @prop kind - 图标的种类（ex：fa-circle -> kind='circle')
 *
 */

import './iconfont.svg.js' // iconfont 的 svg 图标文件
import './Icon.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { xclass } from '../../util/comp'

const compPrefix = 'icon'

const SIZE_S = 'S'
const TYPE_ALI = 'ali'

const _xclass = (className) => {
  return xclass(compPrefix, className)
}

class Icon extends Component {
  constructor(props) {
    super(props)

    this.compName = compPrefix // 组件名字
  }

  isFa() {
    return this.props.type === 'fa'
  }

  _nameClass() {
    const className = [
      _xclass(`${this.props.size.toLowerCase()}`),
      this.isFa() ? this.props.type : _xclass(`${this.props.type}`)
    ]

    return className.join(' ')
  }

  _kindClass() {
    switch (this.props.type) {
      case 'ali': return `ali-icon-${this.props.kind}`
      case 'fa': return `fa-${this.props.kind}`
      default: return `${this.props.type}-${this.props.kind}`
    }
  }

  render() {
    return (
      <div className={`${_xclass('')} ${this.props.className}`}>
        <div className={_xclass('stage')}>
          {this.isFa()
            ? (
              <i className={`${this._nameClass()} ${this._kindClass()}`}></i>
            ) : (
              <svg className={this._nameClass()}>
                <use xlinkHref={`#${this._kindClass()}`}></use>
              </svg>
            )
          }
        </div>
      </div>
    )
  }
}

Icon.defaultProps = {
  className: '',
  kind: '',
  size: SIZE_S,
  type: TYPE_ALI,
  theme: 'primary'
}

Icon.propTypes = {
  className: PropTypes.string,
  kind: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string
}

export default Icon
