/**
 * menu 组件
 *
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {array} value - 初始化下拉菜单值，多选下拉框则为数组
 * @prop {array} item - 初始化下拉菜单框组
 * @prop {string} param - 表单控件的形参名
 * @prop {boolean} multiple - 设置为多选（暂时缺失）
 * @prop {boolean} required - 必须要选择
 * @prop {string} size - 输入框大小 's' | 'S' | 'm' | 'M' | 'l' | 'L'
 *
 * @event onChange - 选择框的状态发生改变事件
 */

import './Select.scss'

import React, {
  useState,
  ChangeEvent,
  useImperativeHandle,
  forwardRef,
  RefForwardingComponent,
  useCallback,
  useRef
} from 'react'
import { xclass } from '../../util/comp'

type TValue = Array<string | number> | string | number

type TProp = {
  className?: string
  defautlt?: string
  disabled?: boolean
  item: Array<{
    value: string | number
    text: string
  }>
  multiple?: boolean
  onChange?: (value: any, text: string) => void
  param?: string
  required?: boolean
  size?: 's' | 'S' | 'm' | 'M' | 'l' | 'L'
  theme?: string
  value?: TValue
}

interface Api {
  compName: string
  param: string | undefined
  val(): TValue | undefined
  verify(): any
}

const _xclass = (className: string | void | Array<string>): string => {
  return xclass('select', className)
}

const Select: RefForwardingComponent<Api, TProp> = ({
  className = '',
  disabled = false,
  defautlt,
  item,
  onChange,
  required = false,
  size = 'M',
  value,
  ...props
}, ref): React.ReactElement => {
  const preValueRef = useRef<string | number>('')

  const [verified, setVerified] = useState(false)
  const [errorHint, setErrorHint] = useState('')
  const [stateValue, setStateValue] = useState<string | number>('')

  function _compClass(): string {
    return _xclass([
      '',
      `size-${size.toLowerCase()}`
    ])
  }

  /**
   * 获取 value
   */
  function val(): TValue | undefined {
    return stateValue
  }

  /**
   * 验证
   */
  function verify(): boolean {
    if (required && (value === -1 || value === '-1')) {
      setErrorHint('必须要选择')
      setVerified(false)

      return false
    }

    setErrorHint('')
    setVerified(true)

    return true
  }

  /**
     * 选择框的状态改变
     *
     * @param {object} event
     * @param {string, number} value
     */
  function onChangeHandler(event: ChangeEvent<HTMLSelectElement>): void {
    const selectedVal = event.currentTarget.value
    const selectedIndex = event.currentTarget.selectedIndex

    onChange && onChange(selectedVal, item[selectedIndex].text)
    setStateValue(selectedVal)

    setErrorHint('')
  }

  const init = useCallback(() => {
    if (value !== preValueRef.current) {
      preValueRef.current = value as string | number

      setStateValue(value as string | number)
    }
  }, [value])

  useImperativeHandle(ref, () => ({
    compName: 'select',
    param: props.param,
    val,
    verify
  }))

  init()

  return (
    <div className={`${_compClass()} ${className}`}>
      <select
        className={_xclass('select')}
        defaultValue={defautlt}
        onChange={onChangeHandler}
        value={value as string | number}
        disabled={disabled}
      >
        {item.map((item, index) => (
          <option
            value={item.value}
            key={index.toString()}
          >
            {item.text}
          </option>
        ))}
      </select>
      <div
        className={
          _xclass('error-tip')
        }
        style={{
          display: verified ? 'none' : ''
        }}
      >{errorHint}</div>
    </div>
  )
}

export default forwardRef(Select)

export {
  Api
}
