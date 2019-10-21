/**
 * fade transition component - 放大缩小效果
 *
 * @prop className
 * @prop origin - 同 css 里的 transform-origin
 * @prop style
 * @prop speed - 过渡速度
 * @prop opacity - 使用 css 定义的 opacity 淡入淡出
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
import { render } from 'react-dom'
import compConf from '../config.json'
import { xclass } from '../util/comp'
import { prop as elementProp } from '../util/dom/prop'

class Fade extends Component {
    constructor(props) {
        super(props)

        this.$el = {} // 这个组件的 dom 元素引用
        this.transitionTime = this._getTransitionTime() // 过渡时间
        this.display = false // 组件显示状态
        this.transition = `opacity ${this.transitionTime}ms ease-out` // 过渡的的样式声明
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

    _compClass(className) {
        return xclass('transition-fade', [
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

        return new Promise((resolve, reject) => {
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

        return new Promise((resolve, reject) => {
            return resolve()
        })
    }

    beforeEnter() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.display = false
        this.props.beforeEnter && this.props.beforeEnter()

        Object.assign(el.style, {
            'transition': this.transition,
            'opacity': 0
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                el.style.display = ''

                return resolve()
            })
        })
    }

    entering() {
        let el = this.$el

        if (!el) {
            return false
        }

        // HACK: trigger browser reflow
        let height = el.offsetHeight

        this.props.entering && this.props.entering()

        el.style.opacity = this.props.opacity ? '' : 1

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve()
            }, this.transitionTime)
        })
    }

    afterEnter() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.display = true

        Object.assign(el.style, {
            'transition': '',
            'opacity': ''
        })

        this.props.afterEnter && this.props.afterEnter()
    }

    beforeLeave() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.display = true
        this.props.beforeLeave && this.props.beforeLeave()

        if (!this.props.opacity) {
            el.style.opacity = 1
        }

        return Object.assign(el.style, {
            'transition': this.transition
        })
    }

    leaveing() {
        let el = this.$el

        if (!el) {
            return false
        }

        let height = el.offsetHeight

        this.props.leaving && this.props.leaving()

        el.style.opacity = 0

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                el.style.display = 'none'

                return resolve()
            }, this.transitionTime)
        })
    }

    afterLeave() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.display = false

        Object.assign(el.style, {
            'transition': '',
            'opacity': ''
        })

        this.props.afterLeave && this.props.afterLeave()
    }

    render() {
        return (
            <div
                className={this._compClass()}
                ref={($el) => this.$el = $el}
                style={{
                    ...this.props.style,
                    display: 'none'
                }}
            >
                {this.props.children}
            </div>
        )
    }
}

Fade.defaultProps = {
    className: '',
    origin: '50% 50%',
    opacity: false,
    reStart: false,
    style: {},
    speed: 'normal'
}

Fade.propTypes = {
    className: PropTypes.string,
    origin: PropTypes.string,
    height: PropTypes.number,
    reStart: PropTypes.bool,
    opacity: PropTypes.bool,
    style: PropTypes.object,
    speed: PropTypes.string
}

export default Fade
