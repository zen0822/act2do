/**
 * icon 组件
 *
 * @prop theme - 主题
 * @prop size - 大小 (XS | S | M | L | XL)
 * @prop type - 字符图标类型
 *              (字符图标的 class 名的前缀，
 *              用户自己引入的 阿里妈妈的 iconfont 的字符图标的前缀)
 *              暂时只支持 ali iconfont
 * @prop kind - 图标的种类（ex：fa-circle -> kind='circle')
 *
 */

import './iconfont.svg.js' // iconfont 的 svg 图标文件
import './Icon.scss'

import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { xclass } from '../../util/comp'

const _xclass = (className: string | Array<any>): string => {
  return xclass('icon', className)
}

const propTypes = {
  className: PropTypes.string,
  kind: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string
}

const Icon: React.FC<InferProps<typeof propTypes>> = ({
  className = '',
  kind = '',
  size = 's',
  type = 'ali',
  theme = 'primary'
} = {}): React.ReactElement => {
  const isFa = type === 'fa'

  function _kindClass(): string {
    switch (type) {
      case 'ali':
        return `ali-icon-${kind}`
      case 'fa':
        return `fa-${kind}`
      default:
        return `${type}-${kind}`
    }
  }

  function _nameClass(): string {
    const className = [
      isFa ? type : _xclass(`${type}`)
    ]

    if (size) {
      className.push(_xclass(`${size.toLowerCase()}`))
    }

    return className.join(' ')
  }

  function compClass(): string {
    return _xclass([
      '',
      `theme-${theme}`,
      className
    ])
  }

  return (
    <div className={compClass()}>
      <div className={_xclass('stage')}>
        {isFa
          ? (
            <i className={`${_nameClass()} ${_kindClass()}`}></i>
          ) : (
            <svg className={_nameClass()}>
              <use xlinkHref={`#${_kindClass()}`}></use>
            </svg>
          )
        }
      </div>
    </div>
  )
}

export default Icon
