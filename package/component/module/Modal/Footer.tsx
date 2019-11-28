/**
 * 模态框的尾部组件
 *
 * @prop {Boolean} isFull
 * @prop {String} noBtn
 * @prop {String} okBtn
 * @prop {String} type
 *
 * @event ok
 * @event no
 */

import React, { ReactElement } from 'react'
import Btn from '../Btn'
import Row from '../Row'
import Col from '../Col'
import { xclass } from '../../util/comp'

type TProp = {
  isFull?: boolean
  noBtn?: string
  okBtn?: string
  no?: () => void
  ok?: () => void
  theme?: string
  type?: string
}

const ModalFooter: React.FC<TProp> = ({
  okBtn,
  ok,
  noBtn,
  no,
  theme,
  type
}): ReactElement => {
  const _xclass = (className: string): string => {
    return xclass('modal', className)
  }

  const footerClass = ''
  const noBtnDisplay = type !== 'alert' && noBtn

  const okBtnEle = (
    <Btn
      theme={theme}
      kind={theme}
      value={okBtn}
      type='flat'
      onClick={ok}
      radius='L'
      size='M'
    />
  )
  const noBtnEle = (
    <Btn
      theme={theme}
      kind={'default'}
      value={noBtn}
      type='flat'
      onClick={no}
      radius='L'
      size='M'
      className={_xclass('cancel-btn')}
    />
  )

  return (
    <footer
      className={footerClass}
    >
      <Row justify='end'>
        {noBtnDisplay && (
          <Col>
            {noBtnEle}
          </Col>
        )}
        {okBtn && (
          <Col>
            {okBtnEle}
          </Col>
        )}
      </Row>
    </footer>
  )
}

export default ModalFooter
