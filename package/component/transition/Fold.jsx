/**
 * fold transition component - 折叠效果
 *
 * @prop className
 * @prop style
 * @prop speed - 过渡速度
 * @prop detail - 元素的详细信息
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

class Fold extends Component {
    constructor(props) {
        super(props)

        // 这个组件的 dom 元素引用
        this.$el = {}
        // 需要被折叠的元素的高度
        this.transitionHeight = props.height
        // 过渡时间
        this.transitionTime = this._getTransitionTime()
        // 过渡的的样式声明
        this.transition = `height ${this.transitionTime}ms ease-out`
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
        return xclass('transition-fold', [
            ''
        ]) + ' ' + this.props.className
    }

    /**
     * 启动进来时的过渡动画
     *
     * @param {Object} opt
     */
    async enter(opt = {}) {
        await this.beforeEnter(opt)
        await this.entering(opt)
        await this.afterEnter(opt)

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
        await this.beforeLeave(opt)
        await this.leaveing(opt)
        await this.afterLeave(opt)

        return new Promise((resolve, reject) => {
            return resolve()
        })
    }

    beforeEnter() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.props.beforeEnter && this.props.beforeEnter()

        Object.assign(el.style, {
            'transition': this.transition,
            'height': 0,
            'overflow': 'hidden'
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

        el.style.height = `${this.transitionHeight}px`

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

        Object.assign(el.style, {
            'height': '',
            'transition': '',
            'overflow': ''
        })

        this.props.afterEnter && this.props.afterEnter()
    }

    beforeLeave() {
        let el = this.$el

        if (!el) {
            return false
        }

        this.props.beforeLeave && this.props.beforeLeave()

        return Object.assign(el.style, {
            height: `${this.transitionHeight}px`,
            overflow: 'hidden',
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

        el.style.height = 0

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

        Object.assign(el.style, {
            'transition': '',
            'height': '',
            'overflow': ''
        })

        this.props.afterLeave && this.props.afterLeave()
    }

    componentDidMount() {
        if (this.props.height === undefined && this.$el) {
            this.transitionHeight = elementProp(this.$el).offsetHeight
        }
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

Fold.defaultProps = {
    className: '',
    style: {},
    speed: 'normal'
}

Fold.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    style: PropTypes.object,
    speed: PropTypes.string
}

export default Fold
