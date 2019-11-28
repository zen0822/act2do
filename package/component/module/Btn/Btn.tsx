/**
 * btn 组件
 *
 * @prop {string} className
 * @prop {boolean} loading - 开启等待，默认关闭
 * @prop {string} value - 初始化 value
 * @prop {string} theme - 主题
 *
 * @prop {boolean} block - 宽度和父元素一样
 * @prop {boolean} disabled - 禁止点击
 * @prop {object} eleStyle - 按钮样式
 * @prop {boolean} cushion - 按钮的透明底层
 * @prop {boolean} cushionColor - 按钮的透明底层颜色
 * @prop {string} kind - 按钮类型 (primary | secondary | success | warning)
 * @prop {string} link - 链接地址（不为空则默认将按钮转换为链接地址）
 * @prop {string} radius - 按钮边角半价 (none | S | M | L)
 * @prop {string} size - 按钮大小 (S | M | L)
 * @prop {string} type - 按钮类型 (button | flat | float | outline)
 * @prop {boolean} targetBlank - 链接在新窗口打开，默认 false
 *
 * @event onClick - 点击按钮事件
 */

import './Btn.scss'
import '../../index'

import React, {
  FC,
  ReactElement,
  MouseEvent
} from 'react'
import Loading from '../Loading/Loading'
import { xclass } from '../../util/comp'

type TProp = {
  block?: boolean
  className?: string
  cushion?: boolean
  cushionColor?: string
  disabled?: boolean
  eleStyle?: object
  kind?: 'primary' | 'danger' | 'success' | 'warning' | 'default' | 'gold' | 'white' | 'dark'
  loading?: boolean
  link?: string
  onClick?: Function
  radius?: 's' | 'S' | 'm' | 'M' | 'l' | 'L' | 'none'
  size?: 's' | 'S' | 'm' | 'M' | 'l' | 'L' | 'l' | 'XL'
  style?: object
  theme?: string
  type?: 'button' | 'flat' | 'float' | 'outline'
  targetBlank?: boolean
  value?: string
}

const Btn: FC<TProp> = ({
  block = false,
  className = '',
  cushion = false,
  disabled = false,
  eleStyle = {},
  loading = false,
  kind = 'primary',
  link = '',
  radius = 'S',
  size = 'M',
  targetBlank = false,
  type = 'button',
  value = '',
  ...props
}): ReactElement => {
  function _xclass(className: string | Array<string>): string {
    return xclass('btn', className)
  }

  function _compClass(): string {
    const className = [
      '',
      `radius-${radius.toLowerCase()}`,
      `size-${size.toLowerCase()}`,
      `type-${type}`,
      `kind-${kind}`
    ]

    if (disabled) {
      className.push('disabled')
    }

    if (block) {
      className.push('block')
    }

    if (cushion) {
      className.push('cushion')
    }

    return _xclass(className)
  }

  /**
   * 点击按钮
   *
   * @param {*} event
   * @param {*} value
   */
  function clickHandler(event: MouseEvent): void {
    !disabled && props.onClick && props.onClick(event)
  }

  return (
    <div
      className={`${_compClass()} ${className}`}
      onClick={clickHandler}
      style={{
        backgroundColor: props.cushionColor,
        ...props.style
      }}
    >
      {disabled && (
        <div
          onClick={(event: MouseEvent): void => event.stopPropagation()}
          className={_xclass('overlay')}>
        </div>
      )}

      <div
        className={_xclass('ele')}
        style={eleStyle}
      >
        <div className={_xclass('ele-border')}>
          {loading
            ? (
              <Loading display size='S' />)
            : link
              ? (
                <a target={targetBlank ? '_blank' : ''} href={link}>{props.children || value}</a>
              ) : props.children || value
          }
        </div>
      </div>
    </div>
  )
}

export default Btn
