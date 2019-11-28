/**
 * confirm 警告弹窗
 */

import React, {
  ReactElement,
  forwardRef,
  useRef,
  useImperativeHandle,
  RefForwardingComponent
} from 'react'

import { useSelector } from 'react-redux'
import { State } from '../../redux'
import Modal, { Api as ModalApi } from './Modal'

type TProp = {
  confirm: any
  confirmHub: Array<any>
  onOk(): void
  onNo(): void
  onHide(): void
}

type Api = {
  show(): void
  hide(): void
  display(): boolean
}

// 创建 confirm 组件
const Confirm: RefForwardingComponent<Api, TProp> = ({
  confirm,
  confirmHub,
  onOk,
  onNo,
  onHide
}, ref): ReactElement => {
  const modalRef = useRef<ModalApi>(null)
  const confirmState = useSelector((state: State) => state.modal.confirm)

  function show(): void {
    modalRef.current && modalRef.current.show()
  }

  function hide(): void {
    modalRef.current && modalRef.current.hide()
  }

  function display(): boolean {
    return modalRef.current ? modalRef.current.display : false
  }

  function onHideHandler(): void {
    onHide && onHide()

    if (confirmHub.length > 0) {
      const { message, opt } = confirmHub.shift()

      return confirm(message, opt)
    }
  }

  function onOkHandler(): void {
    onOk && onOk()

    return hide()
  }

  function onNoHandler(): void {
    onNo && onNo()

    return hide()
  }

  useImperativeHandle(ref, () => ({
    hide,
    show,
    display
  }))

  return (
    <Modal
      {...confirmState.prop}
      type='confirm'
      onOk={onOkHandler}
      onNo={onNoHandler}
      onHide={onHideHandler}
      message={confirmState.message}
      ref={modalRef}
    />
  )
}

export default forwardRef(Confirm)
export { Api }
