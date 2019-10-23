/**
 * row 组件
 *
 * @prop className
 * @prop style
 * @prop align - 定义了列在行上垂直方向上的对齐方式，对应 flex 的 align-items 属性
 *    可选值[start, end, center]
 * @prop gap - 每列的间隔是多少（px）-- 草案
 * @prop justify - 定义了列在行上的水平空间的对齐方式，对应 flex 的 justify-content 属性
 *    可选值[start, end, center, justify, around]
 * @prop wrap - 定义列的换行模式，对应 flex 的 flex-wrap 属性（nowrap | wrap）
 * @prop type - 布局类型
 *
 */

import './Row.scss'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'

const layoutType = ['grid', 'flex', 'flow']

class Row extends Component {
  constructor(props) {
    super(props)

    const compClass = xclass('row', [
      `align-${this.props.align}`,
      `justify-${this.props.justify}`,
      this.props.wrap
    ])

    this.compName = 'row'
    this.$el = null // 组件的 dom 对象

    this.state = {
      compClass: `${compClass} ${compConf.prefix}-row ${props.className}`
    }
  }

  componentDidMount() {
    this.$el = this.refs.me
  }

  render() {
    return (
      <div ref='me' className={this.state.compClass} style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}

Row.defaultProps = {
  className: '',
  align: 'center',
  gap: 0,
  justify: 'center',
  wrap: 'wrap',
  type: 'flow'
}

Row.propTypes = {
  align: PropTypes.string.isRequired,
  gap: PropTypes.number.isRequired,
  justify: PropTypes.string.isRequired,
  wrap: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Row
