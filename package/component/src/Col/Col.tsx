/**
 * col 组件
 *
 * @prop className
 * @prop style
 * @prop gap（已废弃） - 定义间隔的宽度（px），覆盖行设置的间隔 (5, 10, 20, 30, 40, 50)
 * @prop pull - 定义了列在 x 反方向偏移的栅格数
 * @prop push - 定义了列在 x 正方向偏移的栅格数
 * @prop offset - 定义了列离开头的栅格数
 * @prop span - 定义了列在行上的水平跨度（采用 12 栏栅格）
 * @prop xs - 加小设备的水平跨度栅格数
 * @prop s - 小设备的水平跨度栅格数
 * @prop m - 中设备的水平跨度栅格数
 * @prop l - 大型设备的水平跨度栅格数
 * @prop xl - 超大型设备的水平跨度栅格数
 * @prop grid - 集合所有设备水平跨度的栅格数
 * @prop height - 高度
 * @prop width - 宽度
 *
 */

import './Col.scss'
import React from 'react'
import { xclass } from '../../util/comp'

type numProps = 'xs' | 's' | 'm' | 'l' | 'xl' | 'span'

type ColPropTypes = {
  className?: string,
  gap?: number,
  pull?: number,
  push?: number,
  offset?: number,
  span?: number,
  style?: object,
  xs?: number,
  s?: number,
  m?: number,
  l?: number,
  xl?: number,
  grid?: {
    [key: string]: number,
  },
  width?: string,
  height?: string
}

const Col: React.FC<ColPropTypes> = ({
  className = '',
  gap = 0,
  pull = 0,
  push = 0,
  offset = 0,
  height = '',
  width = '',
  ...props
}): React.ReactElement => {
  function compClass(): string {
    const classOpt = []
    const deviceType: string[] = ['xs', 's', 'm', 'l', 'xl', 'span']

    if (gap > 0) {
      classOpt.push(`gap-${gap}`)
    }

    if (pull > 0) {
      classOpt.push(`pull-${pull}`)
    }

    if (push > 0) {
      classOpt.push(`push-${push}`)
    }

    if (offset > 0) {
      classOpt.push(`offset-${offset}`)
    }

    if (!props.grid) {
      deviceType.forEach((item) => {
        const propsItem = props[(item as numProps)] || 0

        if (propsItem > 0) {
          classOpt.push(`${item}-${propsItem}`)
        }
      })
    } else {
      deviceType.forEach((item) => {
        const propsItem = props[(item as numProps)] || 0
        const propsGirdItem = props.grid ? props.grid[item] : 0

        if (propsItem > 0) {
          classOpt.push(`${item}-${propsItem}`)
        } else if (propsGirdItem > 0) {
          classOpt.push(`${item}-${propsGirdItem}`)
        }
      })
    }

    return xclass('col', [
      '',
      ...classOpt
    ], true)
  }

  return (
    <div
      className={`${compClass()} ${className}`}
      style={{
        height: height,
        width: width,
        ...props.style
      }}
    >
      {props.children}
    </div>
  )
}

export default Col
