/**
 * list item transition component - 列表元素的动画
 *
 * @prop className
 * @prop origin - 同 css 里的 transform-origin
 * @prop style
 * @prop speed - 过渡速度
 * @prop detail - 元素的详细信息
 * @prop restart - 当动画需要再次调用时是否执行，例如 连续调用 两次 enter() 是否执行两次过渡动画，默认为否
 *
 * @event beforeEnter - 进来过渡之前
 * @event enter - 进来过渡期间
 * @event afterEnter - 进来过渡完成
 * @event beforeLeave - 离开过渡之前
 * @event leave - 离开过渡期间
 * @event afterLeave - 离开过渡之后
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { xclass } from '../../util/comp'

class ListTransition extends Component {
  constructor(props) {
    super(props)

    this.$el = {} // 这个组件的 dom 元素引用
    this.transitionTime = this._getTransitionTime() // 过渡时间
    this.display = false // 组件显示状态
    this.transition = `transform ${this.transitionTime}ms ease-out` // 过渡的的样式声明
  }

  _getTransitionTime() {
    switch (this.props.speed) {
      case 'normal':
        return 300
      case 'fast':
        return 150
      case 'slow':
        return 450
      default:
        return 300
    }
  }

  _compClass() {
    return xclass('list-transition-item', [
      ''
    ]) + ' ' + this.props.className
  }

  /**
   * 启动进来时的过渡动画
   *
   * @param {Object} opt
   */
  async enter(opt = {}) {
    if (this.props.reStart || !this.display) {
      await this.beforeEnter(opt)
      await this.entering(opt)
      await this.afterEnter(opt)
    }

    return new Promise((resolve) => {
      return resolve()
    })
  }

  /**
   * 启动离开时的过渡动画
   *
   * @param {Object} opt
   */
  async leave(opt = {}) {
    if (this.props.reStart || this.display) {
      await this.beforeLeave(opt)
      await this.leaveing(opt)
      await this.afterLeave(opt)
    }

    return new Promise((resolve) => {
      return resolve()
    })
  }

  beforeEnter() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.display = false
    this.props.beforeEnter && this.props.beforeEnter()

    Object.assign(el.style, {
      'transition': this.transition,
      'transform': 'scale(.6)',
      'transform-origin': this.props.origin
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        el.style.visibility = ''

        return resolve()
      }, 200)
    })
  }

  entering() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.props.entering && this.props.entering()

    el.style.transform = ''

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve()
      }, this.transitionTime)
    })
  }

  afterEnter() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.display = true

    Object.assign(el.style, {
      'transition': '',
      'transform-origin': ''
    })

    this.props.afterEnter && this.props.afterEnter()
  }

  beforeLeave() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.display = true
    this.props.beforeLeave && this.props.beforeLeave()

    Object.assign(el.style, {
      'transform-origin': this.props.origin
    })

    return Object.assign(el.style, {
      'transition': this.transition
    })
  }

  leaveing() {
    const el = this.$el

    if (!el) {
      return false
    }

    const height = el.offsetHeight
    console.log(height)

    this.props.leaving && this.props.leaving()

    el.style.transform = 'scale(.6)'

    return new Promise((resolve) => {
      setTimeout(() => {
        el.style.visibility = 'hidden'

        return resolve()
      }, this.transitionTime)
    })
  }

  afterLeave() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.display = false

    Object.assign(el.style, {
      'transition': '',
      'transform': '',
      'transform-origin': ''
    })

    this.props.afterLeave && this.props.afterLeave()
  }

  render() {
    return (
      <div
        className={this._compClass()}
        ref={($el) => (this.$el = $el)}
        style={{
          ...this.props.style,
          visibility: 'hidden'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

ListTransition.defaultProps = {
  className: '',
  origin: '50% 50%',
  reStart: false,
  style: {},
  speed: 'normal'
}

ListTransition.propTypes = {
  className: PropTypes.string,
  origin: PropTypes.string,
  height: PropTypes.number,
  reStart: PropTypes.bool,
  style: PropTypes.object,
  speed: PropTypes.string
}

export default ListTransition
