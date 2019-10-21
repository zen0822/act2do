/**
 * btn 组件
 *
 * @prop {string} theme - 主题
 * @prop {boolean} block - 宽度和父元素一样
 * @prop {boolean} loading - 开启等待，默认关闭
 * @prop {string} className
 * @prop {boolean} disabled - 禁止点击
 * @prop {string} initVal - 初始化 value
 * @prop {string} kind - 按钮类型 (primary | secondary | success | warning)
 * @prop {string} link - 链接地址（不为空则默认将按钮转换为链接地址）
 * @prop {boolean} cushion - 按钮的透明底层
 * @prop {boolean} cushionColor - 按钮的透明底层颜色
 * @prop {string} size - 按钮大小 (S | M | L)
 * @prop {string} type - 按钮类型 (button | flat | float | outline)
 * @prop {boolean} targetBlank - 链接在新窗口打开，默认 false
 * @prop {string} radius - 按钮边角半价 (none | S | M | L)
 * @prop {object} eleStyle - 按钮样式
 *
 * @event onClick - 点击按钮事件
 */

import './Btn.scss'
import '../../index'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Loading from '../Loading/Loading'
import { xclass } from '../../util/comp'

class Btn extends Component {
    constructor(props) {
        super(props)

        this.compName = 'btn' // 组件名字
        this.clickHandler = this.clickHandler.bind(this)
    }

    _xclass(className) {
        return xclass.call(this, 'btn', className)
    }

    _compClass() {
        const className = [
            '',
            `radius-${this.props.radius.toLowerCase()}`,
            `size-${this.props.size.toLowerCase()}`,
            `type-${this.props.type}`,
            `kind-${this.props.kind}`
        ]

        if (this.props.disabled) {
            className.push('disabled')
        }

        if (this.props.block) {
            className.push('block')
        }

        if (this.props.cushion) {
            className.push('cushion')
        }

        return this._xclass(className)
    }

    /**
     * 点击按钮
     *
     * @param {*} event
     * @param {*} value
     */
    clickHandler(event) {
        !this.props.disabled && this.props.onClick && this.props.onClick(event)
    }

    render() {
        const {
            style,
            cushionColor,
            disabled,
            loading,
            eleStyle
        } = this.props

        return (
            <div
                className={`${this._compClass()} ${this.props.className}`}
                onClick={this.clickHandler}
                style={{
                    backgroundColor: cushionColor,
                    ...style
                }}
            >
                {disabled && (
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className={this._xclass('overlay')}>
                    </div>
                )}

                <div
                    className={this._xclass('ele')}
                    style={eleStyle}
                >
                    <div className={this._xclass('ele-border')}>
                        {loading
                            ? (
                                <Loading display size='S' />)
                            : (
                                this.props.children
                                    ? this.props.children
                                    : this.props.link
                                        ? <a target={this.props.targetBlank ? '_blank' : ''} href={this.props.link}>{this.props.initVal}</a>
                                        : this.props.initVal
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

Btn.defaultProps = {
    className: '',
    disabled: false,
    block: false,
    loading: false,
    kind: 'primary',
    initVal: '',
    link: '',
    cushion: false,
    radius: 'S',
    size: 'M',
    targetBlank: false,
    type: 'button'
}

Btn.propTypes = {
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    loading: PropTypes.bool,
    radius: PropTypes.string,
    size: PropTypes.string,
    cushion: PropTypes.bool,
    link: PropTypes.string,
    theme: PropTypes.string,
    type: PropTypes.string,
    targetBlank: PropTypes.bool,
    initVal: PropTypes.string
}

export default Btn
