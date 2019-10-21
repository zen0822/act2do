/**
 * countDown 倒计时组件
 *
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {string} initVal - 计时的起始时间戳 (毫秒) ，没有则为当前的时间戳 (毫秒)
 * @prop {number} leftTime - 剩余时间
 * @prop {boolean} reverse - 设置为正计时, 默认倒计时
 * @prop {string} format - 时间倒计时的时间格式
 */

import './CountDown.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { xclass } from '../../util/comp'
import { formatSecond as timeFormat } from '../../util/data/date'

const _xclass = (className) => {
    return xclass.call(this, 'count-down', className)
}

class CountDown extends Component {
    constructor(props) {
        super(props)

        this.compName = 'countDown' // 组件名字
        this.interval = null // 定时器

        this.state = this._initData(props)
    }

    /**
     * 初始化数据
     */
    _initData(props) {
        const { leftTime } = this.props

        if (leftTime !== undefined) {
            return {
                value: leftTime
            }
        } else {
            let today = new Date().getTime()
            let value = props.value

            value = Math.round((props.initVal - today) / 1000)
            value = value < 0 ? 0 : value

            if (props.reverse) {
                value = today
            }

            return {
                value
            }
        }
    }

    /**
     * 返回当前的时间
     */
    val() {
        return this.state.value
    }

    start() {
        if (!this.props.reverse && this.state.value <= 0) {
            return false
        }

        this.interval = setInterval(() => {
            if (this.reverse) {
                this.setState((preState) => ({
                    value: ++preState.value
                }))
            } else {
                if (this.state.value - 1 < 0) {
                    return this.stop()
                }

                this.setState((preState) => ({
                    value: --preState.value
                }))
            }
        }, 1000)
    }

    stop() {
        return clearInterval(this.interval)
    }

    componentDidMount() {
        this.start()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initVal !== this.props.initVal) {
            this.stop()
            this.setState({
                value: (nextProps.type === 'time' && nextProps.initVal !== 0)
                    ? (new Date(nextProps.initVal).getTime() - new Date().getTime())
                    : 0
            }, () => {
                this.start()
            })
        }
    }

    componentWillUnmount() {
        this.stop()
    }

    render() {
        return (
            <div className={`${_xclass()} ${this.props.className}`}>
                {timeFormat(this.state.value, this.props.format)}
            </div>
        )
    }
}

CountDown.defaultProps = {
    className: '',
    kind: 'primary',
    radius: 's',
    initVal: 0,
    format: 'hh 小时 mm 分 ss 秒',
    theme: ''
}

CountDown.propTypes = {
    initVal: PropTypes.number.isRequired,
    reverse: PropTypes.bool,
    size: PropTypes.string,
    format: PropTypes.string,
    theme: PropTypes.string
}

export default CountDown
