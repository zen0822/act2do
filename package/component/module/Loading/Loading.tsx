/**
 * loading 组件
 * 使用自定义的loading 需要将父元素设置成 position: relative
 *
 * @prop {boolean} bgDisplay - 是否显示 loading 的背景
 * @prop {string} className
 * @prop {string} size - 尺寸
 * @prop {string} text - 等待文字
 * @prop {string} theme - 主题
 * @prop {string} type - 类型(rotate rotate2 dot)
 */

import React from 'react'
import PropTypes, { InferProps } from 'prop-types'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'
import { css4 } from '../../util/css'
import Icon from '../Icon/Icon'

css4 ? import(`./Loading.var.scss`) : import(`./Loading.scss`)

const TYPE_ROTATE = 'rotate'

const _xclass = (className: string | Array<any>): string => {
  return xclass('loading', className)
}

const propTypes = {
  bgDisplay: PropTypes.bool,
  className: PropTypes.string,
  display: PropTypes.bool,
  size: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string
}

const Loading: React.FC<InferProps<typeof propTypes>> = ({
  className = '',
  bgDisplay = false,
  display = false,
  size = 'M',
  text = '',
  theme = 'primary',
  type = TYPE_ROTATE
}): React.ReactElement => {
  let loadingChildren = null

  function compClass(): string {
    return _xclass([
      '',
      `theme-${theme}`,
      { 'mark': bgDisplay }
    ])
  }

  if (type === 'rotate') {
    loadingChildren = (
      <div className={_xclass('rotate')}>
        <Icon className={_xclass('icon')} size={size} kind='spinner' />
        {text &&
          <span className={`${compConf.prefix}-css-m-l-half`}>
            {text}
          </span>
        }
      </div>
    )
  } else {
    loadingChildren = (
      <div className={_xclass('dot')}>
        {text &&
          <span>{text}</span>
        }
        {[1, 2, 3].map((item, index) => {
          return (
            <span
              key={index.toString()}
              className={_xclass(`dot-${item}`)}
            >.</span>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={`${compClass()}${className ? ` ${className}` : ''}`}
      style={{
        display: display ? '' : 'none'
      }}
    >
      <div className={_xclass('wrap')}>
        {loadingChildren}
        {bgDisplay &&
          <div className={_xclass('bg')}></div>
        }
      </div>
    </div>
  )
}


export default Loading
