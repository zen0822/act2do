/**
 * input 组件
 *
 * @prop {string} area - 设置为输入区域
 * @prop {string} align - 文字排版（left | center | right）
 * @prop {boolean} autoVerify - 当输入框失去焦点的时候自动检验
 * @prop {string} block - 宽度设为 100%
 * @prop {string} border - 输入区域的边界线（thin | thick | none）
 * @prop {string} className - 添加类
 * @prop {boolean} emoji - 输入框是否支持emoji的输入
 * @prop {number} errorMessage - 自定义验证的错误信息
 * @prop {number} fontSize - 字体大小
 * @prop {string} helperText - 輸入框下方的幫助信息
 * @prop {object} header - 输入框头部的代码片段
 * @prop {number} headerWidth - 输入框头部的代码片段的宽度（百分比值）
 * @prop {number} height - 输入框高度
 * @prop {string} info - 输入框底部的提示信息
 * @prop {boolean} inputInvisible - 输入不可见
 * @prop {number} max - input，textarea 可输入最大长度（数字）
 * @prop {number} maxNum - input，textarea 可输入最大数字
 * @prop {number} min - input，textarea 可输入最小长度（数字）
 * @prop {number} minNum - input，textarea 可输入最小数字
 * @prop {string} name - 輸入框名字
 * @prop {boolean} number - 数字类型
 * @prop {string} param - 跟服务器提交数据的形参
 * @prop {string} placeholder
 * @prop {string} regex - 验证值的正则(需要注意转义的字符)
 * @prop {string} regexHint - 正则错误时的提示信息
 * @prop {string} row - 输入框的行数
 * @prop {boolean} required - 是否不能为空
 * @prop {string} requiredHint - 为空时提示信息
 * @prop {boolean} showLength - 显示字符串长度的提示
 * @prop {string} theme - 主题
 * @prop {string | number} value - 初始化 value
 * @prop {boolean} verified - 错误的验证状态
 * @prop {string} verifiedType - 验证值的类型
 * @prop {number} width - 输入框宽度
 *
 * @event onBlur - 输入框失去焦点
 * @event onFocus - 输入框获取焦点
 * @event onChange - 输入框在输入的时候
 * @event onChangeValidate - 输入框的内容改变时的限制规则
 * @event onEnter - 输入框获取焦点时点击 enter （keycode = 13）触发的事件
 */

import './Input.scss'
import { hot } from 'react-hot-loader'
import React, { useState, useEffect, useRef } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import Row from '../Row/Row'
import Col from '../Col/Col'
import Tip from '../Message/Tip'

import { xclass } from '../../util/comp'
import { offset as clientOffset } from '../../util/dom/prop'
import validateRegex from './validate'

const compName = 'input'
const _xclass = (className?: string | Array<string>): string => {
  return xclass(compName, className)
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

type InputPropTypes = {
  align?: string
  autoFocus?: boolean
  area?: boolean
  border?: string
  block?: boolean
  autoVerify?: boolean
  emoji?: boolean
  theme?: string
  className?: string
  errorHintType?: string
  errorMessage?: string
  fontSize?: number
  height?: number | string
  info?: string
  inputInvisible?: boolean
  max?: number
  maxNum?: number
  min?: number
  minNum?: number
  name?: string
  number?: boolean
  numFixed?: number
  param?: string
  helperText?: string
  header?: React.ReactNode
  headerWidth?: string
  placeholder?: string
  regex?: string
  regexHint?: string
  required?: boolean
  requiredHint?: string
  row?: number
  showLength?: boolean
  verifiedType?: string
  verified?: boolean
  value?: number | string
  width?: number | string
  onBlur?: Function
  onFocus?: Function
  onChange?: Function
  onChangeValidate?: Function
  onEnter?: Function
}

const Input: React.FC<InputPropTypes> = ({
  align,
  autoFocus = false,
  area = false,
  border = 'thin',
  block = false,
  autoVerify = false,
  className = '',
  emoji = false,
  errorMessage = '',
  errorHintType = 'hint',
  fontSize,
  header,
  headerWidth,
  helperText = '',
  height,
  inputInvisible = false,
  number = false,
  param = '',
  placeholder = '',
  value = '',
  regex,
  regexHint,
  required = false,
  row,
  showLength = false,
  width,
  verifiedType,
  onChange,
  onChangeValidate,
  ...props
}): React.ReactElement => {
  const intl = useIntl()
  const me = useRef(null)
  let regexObj: any = null // 正则校验的正则表达式
  let formatMessage = '' // 正则校验的错误提示

  function _getLanguage(config: { id: string }, opt?: any): any {
    return intl && intl.formatMessage(config, opt)
  }

  if (regex) {
    regexObj = new RegExp(regex)
    formatMessage = regexHint || `${name || ''}${_getLanguage(language.wrongFormat)}`
  } else if (verifiedType !== undefined) {
    const validate = validateRegex(verifiedType)

    regexObj = validate.regex
    formatMessage = `${validate.dataTypeName}${_getLanguage(language.wrongFormat)}`
  }

  const [errorHint, setErrorHint] = useState('') // 错误的提示信息
  const popErrorHint = errorHintType === 'tip' // 弹窗错误提示
  const [verified, setVerified] = useState(props.verified) // 是否通过了验证
  const [inputTextLength, setInputTextLength] = useState(0) // 当前输入框的字符长度


  /**
   * 验证数据是否为空
   *
   * @return {Object} -
   *                  verified - 验证情况
   *                  errorHint - 错误提示
   */
  function _verifyEmpty(): any {
    const { requiredHint, name } = props
    let errorHint = ''

    if (required) {
      errorHint = requiredHint || `${name || ''}${_getLanguage(language.noEmptyData)}`

      return {
        verified: false,
        errorHint
      }
    }

    return {
      verified: true,
      errorHint
    }
  }

  /**
   * 验证数据格式
   *
   * @param {Boolean} - 是否是第一次验证
   * @return {Object} - this - 组件
   */
  function verify({ verifyRegex = true, firstVerify = false } = {}): Function {
    let verified = true
    let errorHint = ''
    const inputName = name || ''
    const { min, max, minNum, maxNum } = props

    const returnFun = (): any => {
      if (!verified) {
        // useEffect(() => {
        //   document.body.scrollTop = clientOffset(me).top
        // })
      }

      setVerified(verified)
      setErrorHint(errorHint)

      // useEffect(() => {
      //   !verified && popErrorHint && Tip(errorHint)
      // })

      return verified
    }

    if (!number) {
      if (typeof value === 'number') {
        console.warn('也许你的数据是数字类型，如果是的请在 props 的 number 传入 true')
      } else {
        value = value.trim()
      }
    }

    if (!value && value !== 0) {
      const verifyEmpty = _verifyEmpty()

      verified = verifyEmpty.verified
      errorHint = verifyEmpty.errorHint

      return returnFun()
    } else {
      if (number && isNaN(value as number)) {
        errorHint = `${inputName}${_getLanguage(language.inputNum)}`
        verified = false

        return returnFun()
      }

      if (min) {
        if (number) {
          verified = min <= value
          errorHint = verified ? '' : `${inputName}${_getLanguage(language.noLessNum, { num: min })}`
        } else {
          verified = min <= value.toString().length
          errorHint = verified ? '' : `${inputName}${_getLanguage(language.noLessLength, { length: min })}`
        }

        if (!verified) {
          return returnFun()
        }
      }

      if (max) {
        verified = max >= value.toString().length
        errorHint = verified ? '' : `${inputName}${_getLanguage(language.noMoreLength, { length: max })}`

        if (!verified) {
          return returnFun()
        }
      }

      if (minNum && number) {
        const num = Number(value)

        verified = minNum <= num
        errorHint = verified ? '' : `${inputName}${_getLanguage(language.noLessNum, { num: minNum })}`

        if (!verified) {
          return returnFun()
        }
      }

      if (maxNum && number) {
        const num = Number(value)

        verified = maxNum >= num
        errorHint = verified ? '' : `${inputName}${_getLanguage(language.noMoreNum, { num: maxNum })}`

        if (!verified) {
          return returnFun()
        }
      }

      if (verifyRegex && (regex || verifiedType) && !regexObj.test(value)) {
        verified = false

        if (firstVerify) {
          errorHint = ''
        } else {
          errorHint = formatMessage
        }

        return returnFun()
      }
    }

    return returnFun()
  }

  function onChangeHandler(event: any): boolean | void {
    const {
      numFixed,
      max,
      maxNum
    } = props
    let value = event.target.value

    if (max && value.length > max) {
      value = value.substr(0, max)
    }

    if (onChangeValidate && onChangeValidate(value)) {
      return false
    }

    if (!!value && number) {
      if (!/(^-?\d+)(\.?)(\d*$)/.test(value)) {
        return false
      }

      if (maxNum && value > maxNum) {
        return false
      }

      if (numFixed && value.toString().includes('.') && value.toString().split('.')[1].length > numFixed) {
        return false
      }
    }

    // eslint-disable-next-line no-misleading-character-class
    const emojiRegex = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
    if (!emoji && emojiRegex.test(value)) {
      return false
    }

    onChange && onChange(value)

    setInputTextLength(value.length)

    if (autoVerify) {
      verify({
        verifyRegex: false
      })
    }
  }

  function onBlurHandler(event: any): void {
    let value = event.target.value

    if (number && !!value) {
      value = parseFloat(value)

      onChange && onChange(value)
    }

    if (autoVerify) {
      verify()
    }
  }

  function onFocusHandler(event: any): void {
    const { onFocus } = props
    onFocus && onFocus(event)
    onFocus && onFocus(event)

    setVerified(true)
    setErrorHint('')
  }

  function onKeyPressHandler(event: any): void {
    if (event.charCode === 13) {
      props.onEnter && props.onEnter()
    }
  }


  /**
     * 验证数据格式并且弹出错误
     *
     * @return {Object} - this - 组件
     */
  // function validate(): void {
  //   verify()

  //   if (!verified) {
  //     errorBorderDisplay = true

  //     return false
  //   }
  // }

  return (
    <div
      className={
        `${_xclass()}
          ${_xclass(`border-${border}`)}
          ${className}
          ${block ? _xclass('block') : ''}`
      }
      ref={me}
      style={{
        width
      }}
    >
      <Row className={_xclass('wrap')}>
        <Col className={_xclass('wrap-header')} width={headerWidth}>
          {header}
        </Col>
        <Col className={_xclass('wrap-input')} width={`calc(100% - ${headerWidth})`}>
          {area
            ? (
              <textarea
                autoFocus={autoFocus}
                className={_xclass('tag-textarea')}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                placeholder={placeholder}
                rows={row}
                value={value}
                ref={me}
                style={{
                  fontSize,
                  textAlign: (align as any),
                  height
                }}
              >
              </textarea>
            ) : (
              <input
                autoFocus={autoFocus}
                className={_xclass('tag-input')}
                onChange={onChangeHandler}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onKeyPress={onKeyPressHandler}
                placeholder={placeholder}
                ref={me}
                type={inputInvisible ? 'password' : 'text'}
                value={value}
                style={{
                  textAlign: (align as any),
                  fontSize: fontSize,
                  height
                }}
              />
            )
          }
        </Col>
      </Row>

      {showLength &&
        <div className={_xclass('input-length')}>
          {`${inputTextLength} / ${props.max}`}
        </div>
      }

      <div
        className={_xclass('error-tip')}
        style={{
          display: errorHintType === 'hint' && !verified ? '' : 'none'
        }}
      >{errorHint}</div>

      {helperText && <div className={_xclass('helper-text')}>{helperText}</div>}
    </div>
  )
}


export default Input
