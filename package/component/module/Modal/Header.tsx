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

import React, { ReactElement } from 'react'
import Col from '../Col/Col'
import { xclass } from '../../util/comp'
import Row from '../Row'
import Icon from '../Icon'

export default function ModalHeader({
  ...props
}): ReactElement {
  const _xclass = (className: string): string => {
    return xclass('modal', className)
  }

  if (props.isFull) {
    return (
      <header
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        style={{
          cursor: props.drag ? 'move' : undefined
        }}
      >
        {!props.isBiggerFull &&
          <Col
            className={_xclass('header-nav')}
            xs={2}
            l={1}
          >
            <div onClick={props.onClickFullNav}>←</div>
          </Col>
        }
        <Col xs={props.commit ? 8 : 9} l={props.commit ? 10 : 11}>
          <span className={_xclass('header-title')}>
            {props.modalHeader}
          </span>
        </Col>
        {!props.isBiggerFull && props.commit &&
          <Col
            xs={2}
            l={1}
          >
            <span>{props.okBtn}</span>
          </Col>
        }
      </header>
    )
  } else {
    return (
      <div
        className={_xclass('header-title')}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        style={{
          cursor: props.drag ? 'move' : undefined
        }}
      >
        <Row justify={props.close ? 'justify' : 'center'}>
          <Col>
            {props.header}
          </Col>
          {props.close && (
            <Col>
              <div className='z-css-cursor-pointer' onClick={(): void => (props.no && props.no())}>
                <Icon kind='close' size='XS' />
              </div>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}
