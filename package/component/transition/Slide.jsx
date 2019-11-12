/**
 * slide transition component - 滑动效果
 *
 * @prop className
 * @prop style
 * @prop speed - 滑动速度
 * @prop direction - 滑动的方向 (west | south | north | east)
 * @prop switch - true 为进入的过渡，false 为离开的过渡
 * @prop detail - 元素的详细信息
 *                offsetParent 的 height 和 width，基于 offsetParent 的偏移值 top 和 left，自身的 height 和 width)
 * @prop offset - 元素滑动的偏移值,
 *                direction 为 south：实例顶部距离实例的 offsetParent 的顶部的偏移值
 *                direction 为 north：实例低部距离实例的 offsetParent 的低部的偏移值
 *                direction 为 west：实例右边距离实例的 offsetParent 的右边的偏移值
 *                direction 为 east：实例左边距离实例的 offsetParent 的左边的偏移值
 * @event beforeEnter - 进来过渡之前
 * @event enter - 进来过渡期间
 * @event afterEnter - 进来过渡完成
 * @event beforeLeave - 离开过渡之前
 * @event leave - 离开过渡期间
 * @event afterLeave - 离开过渡之后
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { xclass } from '../util/comp'

class Slide extends Component {
  constructor(props) {
    super(props)

    this.transitionTime = this._getTransitionTime()
    this.transition = `transform ${this.transitionTime}ms ease-out`
    this.display = false // 组件显示状态
    this.slideOffset = props.offset // 滑动的偏移值
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
    return xclass('transition-slide', [
      ''
    ]) + ' ' + this.props.className
  }

  _getTranslate() {
    switch (this.props.direction) {
      case 'south':
        return `translateY(calc(-110% - ${this.slideOffset}px))`
      case 'north':
        return `translateY(calc(110% + ${this.slideOffset}px))`
      case 'east':
        return `translateX(calc(-110% - ${this.slideOffset}px))`
      case 'west':
        return `translateX(calc(110% + ${this.slideOffset}px))`
      default:
        return `translateY(calc(-110% - ${this.slideOffset}px))`
    }
  }

  /**
     * 启动进来时的过渡动画
     *
     * @param {Object} opt
     */
  async enter(opt = {}) {
    try {
      await this.beforeEnter(opt)
      await this.entering(opt)
      await this.afterEnter(opt)
    } catch (error) {
      console.warn(error)
    }
  }

  /**
     * 启动离开时的过渡动画
     *
     * @param {Object} opt
     */
  async leave(opt = {}) {
    try {
      this.transiting = this.isEntering = true

      await this.beforeLeave(opt)
      await this.leaveing(opt)
      await this.afterLeave(opt)

      this.transiting = this.isEntering = false
    } catch (error) {
      console.warn(error)
    }
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
      'transform': this._getTranslate()
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        el.style.display = ''

        return resolve()
      })
    })
  }

  entering() {
    const el = this.$el

    if (!el) {
      return false
    }

    // HACK: trigger browser reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const height = el.offsetHeight

    this.props.entering && this.props.entering()

    Object.assign(el.style, {
      'transform': ''
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve()
      }, this.transitionTime)
    })
  }

  afterEnter() {
    this.display = true
    const el = this.$el

    if (!el) {
      return false
    }

    Object.assign(el.style, {
      'transition': ''
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

    return Object.assign(el.style, {
      'transition': this.transition,
      'transform': ''
    })
  }

  leaveing() {
    const el = this.$el

    if (!el) {
      return false
    }

    this.props.leaving && this.props.leaving()

    Object.assign(el.style, {
      'transform': this._getTranslate()
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        el.style.display = 'none'

        return resolve()
      }, this.transitionTime)
    })
  }

  afterLeave() {
    this.display = false
    const el = this.$el

    if (!el) {
      return false
    }

    Object.assign(el.style, {
      'transition': '',
      'transform': ''
    })

    this.props.afterLeave && this.props.afterLeave()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.slideOffset = nextProps.offset
  }

  render() {
    return (
      <div
        className={this._compClass()}
        ref={($el) => (this.$el = $el)}
        style={{
          ...this.props.style,
          display: this.display ? '' : 'none'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

Slide.defaultProps = {
  className: '',
  style: {},
  speed: 'normal',
  direction: 'south',
  switch: false,
  offset: 0
}

Slide.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  speed: PropTypes.string,
  direction: PropTypes.string,
  switch: PropTypes.bool,
  offset: PropTypes.number.isRequired
}

export default Slide
