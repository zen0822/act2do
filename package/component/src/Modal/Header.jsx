/**
 * 模态框的头部组件
 *
 * @prop {Boolean} commit
 * @prop {String} header
 * @prop {Boolean} isBiggerFull
 * @prop {Boolean} isFull
 * @prop {String} okBtn
 *
 * @event onMouseDown
 * @event onMouseUp
 * @event onClickFullNav
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import Row from '../Row/Row'
import Col from '../Col/Col'
import { xclass } from '../../util/comp'
export default function (props) {
  const _xclass = (className) => {
    return xclass('modal', className)
  }

  if (props.isFull) {
    return (
      <header
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
      >
        {!props.isBiggerFull &&
                    <Col
                      className={_xclass('header-nav')}
                      xs={2}
                      l={1}
                      onClick={props.onClickFullNav}
                    >
                        icon 组件缺失
                    </Col>
        }
        <Col xs={props.commit ? 8 : 9} xs={props.commit ? 10 : 11}>
          <span className={_xclass('header-title')}>
            {props.modalHeader}
          </span>
        </Col>
        {!props.isBiggerFull && props.commit &&
                    <Col
                      xs={2}
                      l={1}
                    >
                      <span>{this.okBtn}</span>
                    </Col>
        }
      </header>
    )
  } else {
    return (
      <Col span={12}>
        <span className={_xclass('header-title')}>
          {props.header}
        </span>
      </Col>
    )
  }
}
