/**
 * row 组件
 *
 * @prop className
 * @prop style
 * @prop align - 定义了列在行上垂直方向上的对齐方式，对应 flex 的 align-items 属性
 *    可选值[start, end, center]
 * @prop gap - 每列的间隔是多少（px）-- 草案
 * @prop justify - 定义了列在行上的水平空间的对齐方式，对应 flex 的 justify-content 属性
 *    可选值[start, end, center, justify, around]
 * @prop wrap - 定义列的换行模式，对应 flex 的 flex-wrap 属性（nowrap | wrap）
 * @prop type - 布局类型
 * @prop width - 宽度
 *
 */

import './Row.scss'
import React from 'react'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'

type RowPropTypes = {
  align?: 'start' | 'end' | 'center'
  className?: string
  justify?: 'start' | 'end' | 'center' | 'justify' | 'around'
  style?: object
  noWrap?: boolean
  width?: string | number
}

const Row: React.FC<RowPropTypes> = ({
  align = 'center',
  className = '',
  justify = 'justify',
  style = {},
  noWrap = false,
  width,
  ...props
}): React.ReactElement => {
  const compClass = xclass('row', [
    `align-${align}`,
    `justify-${justify}`,
    noWrap ? 'nowrap' : 'wrap'
  ], true)

  return (
    <div
      className={`${compClass} ${compConf.prefix}-row ${className}`}
      style={{
        ...style,
        width
      }}
    >
      {props.children}
    </div >
  )
}


export default Row
