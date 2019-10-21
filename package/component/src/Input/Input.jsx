/**
 * input 组件
 *
 * @prop {string} area - 设置为输入区域
 * @prop {string} align - 文字排版（left | center | right）
 * @prop {string} border - 输入区域的边界线（thin | thick | none）
 * @prop {string} block - 宽度设为 100%
 * @prop {string} theme - 主题
 * @prop {string} className - 添加类
 * @prop {string} info - 输入框底部的提示信息
 * @prop {string} value - 初始化 value
 * @prop {string} param - 跟服务器提交数据的形参
 * @prop {string} placeholder
 * @prop {string} helperText - 輸入框下方的幫助信息
 * @prop {string} name - 輸入框名字
 * @prop {object} header - 输入框头部的代码片段
 * @prop {number} headerWidth - 输入框头部的代码片段的宽度（百分比值）
 * @prop {number} fontSize - 字体大小
 * @prop {number} height - 输入框高度
 * @prop {number} width - 输入框宽度
 * @prop {function} onChangeValidate - 输入框的内容改变时的限制规则
 * @prop {boolean} emoji - 输入框是否支持emoji的输入
 * @prop {boolean} inputInvisible - 输入不可见
 * @prop {boolean} number - 数字类型
 *
 * @prop {boolean} autoVerify - 当输入框失去焦点的时候自动检验
 * @prop {number} min - input，textarea 可输入最小长度（数字）
 * @prop {number} max - input，textarea 可输入最大长度（数字）
 * @prop {number} minNum - input，textarea 可输入最小数字
 * @prop {number} maxNum - input，textarea 可输入最大数字
 * @prop {number} errorMessage - 自定义验证的错误信息
 * @prop {string} regex - 验证值的正则(需要注意转义的字符)
 * @prop {string} regexTip - 正则错误时的提示信息
 * @prop {string} row - 输入框的行数
 * @prop {boolean} showLength - 显示字符串长度的提示
 * @prop {boolean} required - 是否不能为空
 * @prop {string} requiredTip - 为空时提示信息
 * @prop {boolean} verified - 错误的验证状态
 * @prop {string} verifiedType - 验证值的类型
 *
 * @event onBlur - 输入框失去焦点
 * @event onFocus - 输入框获取焦点
 * @event onChange - 输入框在输入的时候
 * @event onEnter - 输入框获取焦点时点击 enter （keycode = 13）触发的事件
 */

import './Input.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { render } from 'react-dom'
import { defineMessages, injectIntl, intlShape } from 'react-intl'
import Row from 'reactComp/component/Row/Row'
import Col from 'reactComp/component/Col/Col'
import Tip from 'reactComp/component/Message/Tip'

import { xclass } from '../../util/comp'
import { offset as clientOffset } from '../../util/dom/prop'

import validateRegex from './validate'

const compName = 'input'
const _xclass = (className) => {
    return xclass.call(this, compName, className)
}

const language = defineMessages({
    wrongFormat: {
        id: 'rc.input.wrongFormat'
    },
    noEmptyData: {
        id: 'rc.input.noEmptyData'
    },
    inputNum: {
        id: 'rc.input.inputNum'
    },
    noLessNum: {
        id: 'rc.input.noLessNum'
    },
    noMoreNum: {
        id: 'rc.input.noMoreNum'
    },
    noLessLength: {
        id: 'rc.input.noLessLength'
    },
    noMoreLength: {
        id: 'rc.input.noMoreLength'
    }
})

class Input extends Component {
    constructor(props) {
        super(props)

        this.compName = compName // 组件名字
        this.regexObj = null // 正则校验的正则表达式
        this.formatMessage = '' // 正则校验的错误提示
        this.refInput = null // 输入框的 ref
        this.focusing = false // 输入框获取焦点的状态
        this.refInput = null // 输入框的 ref

        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.onBlurHandler = this.onBlurHandler.bind(this)
        this.onFocusHandler = this.onFocusHandler.bind(this)

        if (props.regex) {
            this.regexObj = new RegExp(props.regex)
            this.formatMessage = props.regexTip || `${this.props.name ? this.props.name : ''}${this._getLanguage(language.wrongFormat)}`
        } else if (props.verifiedType !== undefined) {
            let validate = validateRegex(props.verifiedType)
            this.regexObj = validate.regex
            this.formatMessage = `${validate.dataTypeName}${this._getLanguage(language.wrongFormat)}`
        }

        this.state = {
            errorTip: '', // 错误的提示信息
            popErrorTip: props.errorTipType === 'tip', // 弹窗错误提示
            value: props.value,
            verified: props.verified, // 是否通过了验证
            inputTextLength: 0 // 当前输入框的字符长度
        }
    }

    _getLanguage(config, opt) {
        return this.props.intl.formatMessage(config, opt)
    }

    /**
     * 验证数据是否为空
     *
     * @return {Object} -
     *                  verified - 验证情况
     *                  errorTip - 错误提示
     */
    _verifyEmpty(firstVerify) {
        const { requiredTip, name } = this.props
        let errorTip = ''

        if (this.props.required) {
            errorTip = requiredTip || `${name || ''}${this._getLanguage(language.noEmptyData)}`

            return {
                verified: false,
                errorTip
            }
        }

        return {
            verified: true,
            errorTip
        }
    }

    onChangeHandler(event) {
        const {
            numFixed,
            number,
            emoji,
            onChangeValidate
        } = this.props
        let value = event.target.value

        if (this.props.max && value.length > this.props.max) {
            value = value.substr(0, this.props.max)
        }

        if (onChangeValidate && onChangeValidate(value)) {
            return false
        }

        if (!!value && number) {
            if (!/(^-?\d+)(\.?)(\d*$)/.test(value)) {
                return false
            }

            if (this.props.maxNum && value > this.props.maxNum) {
                return false
            }

            if (numFixed && value.toString().includes('.') && value.toString().split('.')[1].length > numFixed) {
                return false
            }
        }

        if (!emoji && /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig.test(value)) {
            return false
        }

        this.props.onChange && this.props.onChange({
            value: value
        })

        this.setState({
            value: value,
            inputTextLength: value.length
        }, () => {
            if (this.props.autoVerify) {
                this.verify({
                    verifyRegex: false
                })
            }
        })
    }

    onBlurHandler(event) {
        this.focusing = false
        const { number, autoVerify, onChange } = this.props
        let value = event.target.value
        if (number && !!value) {
            value = parseFloat(value)
            this.setState({
                value
            })
            onChange && onChange({
                value: value
            })
        }

        if (autoVerify) {
            return this.verify()
        }
    }

    onFocusHandler(event) {
        const { onFocus } = this.props
        onFocus && onFocus(event)
        this.focusing = true
        onFocus && onFocus(event)

        return this.setState({
            verified: true,
            errorTip: ''
        })
    }

    onKeyPressHandler(event) {
        if (event.charCode === 13) {
            return this.props.onEnter && this.props.onEnter()
        }
    }

    val() {
        return this.state.value
    }

    /**
     * 验证数据格式
     *
     * @param {Boolean} - 是否是第一次验证
     * @return {Object} - this - 组件
     */
    verify({ verifyRegex = true, firstVerify } = {}) {
        let verified = true
        let errorTip = ''
        let value = this.state.value
        const inputName = this.props.name || ''

        const returnFun = () => {
            if (!verified) {
                document.body.scrollTop = clientOffset(this.refs.me).top
            }

            this.setState({
                verified,
                errorTip: errorTip
            }, () => {
                !this.state.verified && this.state.popErrorTip && Tip(this.state.errorTip)
            })


            return verified
        }

        if (!this.props.number) {
            if (!value.trim) {
                console.warn('也许你的数据是数字类型，如果是的请在 props 的 number 传入 true')
            } else {
                value = value.trim()
            }
        }

        if (!value && value !== 0) {
            let verifyEmpty = this._verifyEmpty()

            verified = verifyEmpty.verified
            errorTip = verifyEmpty.errorTip

            return returnFun()
        } else {
            if (this.props.number && isNaN(value)) {
                errorTip = `${inputName}${this._getLanguage(language.inputNum)}`
                verified = false

                return returnFun()
            }

            if (this.props.min) {
                if (this.props.number) {
                    verified = this.props.min <= value
                    errorTip = verified ? '' : `${inputName}${this._getLanguage(language.noLessNum, { num: this.props.min })}`
                } else {
                    verified = this.props.min <= value.toString().length
                    errorTip = verified ? '' : `${inputName}${this._getLanguage(language.noLessLength, { length: this.props.min })}`
                }

                if (!verified) {
                    return returnFun()
                }
            }

            if (this.props.max) {
                verified = this.props.max >= value.toString().length
                errorTip = verified ? '' : `${inputName}${this._getLanguage(language.noMoreLength, { length: this.props.max })}`

                if (!verified) {
                    return returnFun()
                }
            }

            if (this.props.minNum && this.props.number) {
                let num = Number(value)

                verified = this.props.minNum <= num
                errorTip = verified ? '' : `${inputName}${this._getLanguage(language.noLessNum, { num: this.props.minNum })}`

                if (!verified) {
                    return returnFun()
                }
            }

            if (this.props.maxNum && this.props.number) {
                let num = Number(value)

                verified = this.props.maxNum >= num
                errorTip = verified ? '' : `${inputName}${this._getLanguage(language.noMoreNum, { num: this.props.maxNum })}`

                if (!verified) {
                    return returnFun()
                }
            }

            if (verifyRegex && (this.props.regex || this.props.verifiedType) && !this.regexObj.test(value)) {
                verified = false

                if (firstVerify) {
                    errorTip = ''
                } else {
                    errorTip = this.formatMessage
                }

                return returnFun()
            }
        }

        return returnFun()
    }

    /**
     * 验证数据格式并且弹出错误
     *
     * @return {Object} - this - 组件
     */
    validate() {
        this.verify()

        if (!this.verified) {
            this.errorBorderDisplay = true

            return false
        }

        return this
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            verified: nextProps.verified
        })
    }

    render() {
        const {
            errorTipType,
            inputInvisible,
            fontSize,
            height,
            width,
            align,
            autoFocus
        } = this.props

        return (
            <div
                className={
                    `${_xclass()}
                    ${_xclass(`border-${this.props.border}`)}
                    ${this.props.className}
                    ${this.props.block ? _xclass('block') : ''}`
                }
                ref='me'
                style={{
                    width: width
                }}
            >
                <Row className={_xclass('wrap')}>
                    <Col className={_xclass('wrap-header')} style={{ width: `${this.props.headerWidth}%` }}>
                        {this.props.header}
                    </Col>
                    <Col className={_xclass('wrap-input')} style={{ width: `${100 - this.props.headerWidth}%` }}>
                        {this.props.area
                            ? (
                                <textarea
                                    autoFocus={autoFocus}
                                    className={_xclass('tag-textarea')}
                                    onChange={this.onChangeHandler}
                                    onKeyPress={(event) => this.onKeyPressHandler(event)}
                                    onFocus={this.onFocusHandler}
                                    onBlur={this.onBlurHandler}
                                    placeholder={this.props.placeholder}
                                    rows={this.props.row}
                                    value={this.state.value}
                                    ref={(ref) => this.refInput = ref}
                                    style={{
                                        fontSize,
                                        textAlign: align,
                                        height: height
                                    }}
                                >
                                </textarea>
                            ) : (
                                <input
                                    autoFocus={autoFocus}
                                    className={_xclass('tag-input')}
                                    onChange={this.onChangeHandler}
                                    onFocus={this.onFocusHandler}
                                    onBlur={this.onBlurHandler}
                                    onKeyPress={(event) => this.onKeyPressHandler(event)}
                                    placeholder={this.props.placeholder}
                                    ref={(ref) => this.refInput = ref}
                                    type={inputInvisible ? 'password' : 'text'}
                                    value={this.state.value}
                                    style={{
                                        textAlign: align,
                                        fontSize: fontSize,
                                        height: height
                                    }}
                                />
                            )
                        }
                    </Col>
                </Row>
                {this.props.showLength &&
                    <div className={_xclass('input-length')}>
                        {`${this.state.inputTextLength} / ${this.props.max}`}
                    </div>
                }
                <div
                    className={_xclass('error-tip')}
                    style={{
                        display: errorTipType === 'hint' && !this.state.verified ? '' : 'none'
                    }}
                >{this.state.errorTip}</div>
                {this.props.helperText && <div className={_xclass('helper-text')}>{this.props.helperText}</div>}
            </div>
        )
    }
}

Input.defaultProps = {
    autoFocus: false,
    area: false,
    border: 'thin',
    block: false,
    autoVerify: false,
    className: '',
    value: '',
    param: '',
    helperText: '',
    verified: true,
    number: false,
    errorMessage: '',
    showLength: false,
    errorTipType: 'hint',
    emoji: false,
    inputInvisible: false
}

Input.propTypes = {
    autoFocus: PropTypes.bool,
    area: PropTypes.bool,
    border: PropTypes.string,
    block: PropTypes.bool,
    autoVerify: PropTypes.bool,
    emoji: PropTypes.bool,
    theme: PropTypes.string,
    className: PropTypes.string,
    errorMessage: PropTypes.string,
    info: PropTypes.string,
    max: PropTypes.number,
    maxNum: PropTypes.number,
    min: PropTypes.number,
    minNum: PropTypes.number,
    param: PropTypes.string,
    helperText: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    showLength: PropTypes.bool,
    regex: PropTypes.string,
    verifiedType: PropTypes.string,
    inputInvisible: PropTypes.bool,
    verified: PropTypes.bool,
    intl: intlShape.isRequired,
    errorTipType: PropTypes.string,
    number: PropTypes.bool,
    numFixed: PropTypes.number
}

export default injectIntl(Input, {
    withRef: true
})
