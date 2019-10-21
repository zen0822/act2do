/**
 * menu 组件
 *
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {array} value - 初始化下拉菜单值，多选下拉框则为数组
 * @prop {array} item - 初始化下拉菜单框组
 * @prop {string} param - 表单控件的形参名
 * @prop {boolean} multiple - 设置为多选
 * @prop {boolean} required - 必须要选择
 *
 * @event onChange - 选择框的状态发生改变事件
 */

import './Menu.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import Row from '../Row/Row'
import Col from '../Col/Col'
import { xclass } from '../../util/comp'

const _xclass = (className) => {
    return xclass.call(this, 'menu', className)
}

class Menu extends Component {
    constructor(props) {
        super(props)

        this.compName = 'menu' // 组件名字

        this.changeHandler = this.changeHandler.bind(this)

        this.state = {
            verified: false,
            errorTip: '',
            value: props.value,
            item: props.item
        }
    }

    _compClass() {
        return _xclass([
            ''
        ])
    }

    /**
     * 获取 value
     */
    val() {
        return this.state.value
    }

    /**
     * 验证
     */
    verify() {
        if (this.props.required && (this.state.value === -1 || this.state.value === '-1')) {
            this.setState({
                errorTip: '必须要选择',
                verified: false
            })

            return false
        }

        this.setState({
            errorTip: '',
            verified: true
        })

        return true
    }

    /**
     * 选择框的状态改变
     *
     * @param {object} event
     * @param {string, number} value
     */
    changeHandler(event) {
        let selectedVal = event.currentTarget.value

        this.props.onChange && this.props.onChange({
            emitter: this,
            text: this.props.item[event.currentTarget.selectedIndex].text,
            value: selectedVal
        })

        return this.setState({
            errorTip: '',
            value: selectedVal
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            item: nextProps.item
        })
    }

    render() {
        return (
            <div className={`${this._compClass()} ${this.props.className}`}>
                <select
                    className={_xclass('select')}
                    defaultValue={this.props.defautlt}
                    onChange={(event) => this.changeHandler(event)}
                    value={this.state.value}
                >
                    {this.state.item.map((item, index) => {
                        return (
                            <option
                                value={item.value}
                                key={index.toString()}
                            >
                                {item.text}
                            </option>
                        )
                    })}
                </select>
                <div
                    className={
                        _xclass('error-tip')
                    }
                    style={{
                        display: this.state.verified ? 'none' : ''
                    }}
                >{this.state.errorTip}</div>
            </div>
        )
    }
}

Menu.defaultProps = {
    className: '',
    multiple: false,
    required: false,
    theme: ''
}

Menu.propTypes = {
    className: PropTypes.string,
    item: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number
    ]),
    multiple: PropTypes.bool,
    param: PropTypes.string,
    required: PropTypes.bool,
    theme: PropTypes.string
}

export default Menu
