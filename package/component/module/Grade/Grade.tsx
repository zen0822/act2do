/**
 * Grade 组件
 * 展示和选择等级
 * ex：★★★★☆ 或者：★★☆☆☆
 *
 * @prop className
 * @prop style
 * @prop size - 等级图标的大小 (XS | *S | M | L | XL)
 * @prop color - 等级图标的颜色 默认：灰色 #ccc
 * @prop colorActive - 被选中等级图标的颜色 默认：黄色 #ffc800
 *
 * @prop level - 级数
 * @prop readOnly - 只展示不能选择等级
 * @prop type - iconfont 的 kind，默认是 star
 * @prop total - 总共的等级数
 *
 */

import './Grade.scss'
import React from 'react'
import compConf from '../../config.json'

import Icon from '../Icon'
import Row from '../Row'
import Col from '../Col'

type TSize = 'xs' | 'XS' | 's' | 'S' | 'm' | 'M' | 'l' | 'L' | 'xl' | 'XL'

type TProp = {
  className?: string
  color?: string
  colorActive?: string
  level: number
  readOnly?: boolean
  size?: TSize
  style?: object
  total?: number
  type?: string
}

const Grade: React.FC<TProp> = ({
  className = '',
  level = 0,
  style = {},
  readOnly = false,
  total = 5,
  type = 'star',
  ...props
}): React.ReactElement => {
  const colorActive = props.colorActive || '#ffc800'
  const color = props.color || '#ccc'

  return (
    <div
      className={`${compConf.prefix}-grade ${className}`}
      style={style}
    >
      <Row>
        {Array(total).fill('').map((_item, index) => (
          <Col key={index}>
            <div onClick={(): boolean | void => {
              if (readOnly) {
                return false
              }
            }}>
              <Icon
                size={props.size}
                kind={type}
                color={(index + 1) <= level ? colorActive : color}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div >
  )
}

export default Grade
