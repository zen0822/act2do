/**
 * alert 警告弹窗
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
  alert: any
  alertHub: Array<any>
  onOk(): void
  onHide(): void
}

type Api = {
  show(): void
  hide(): void
  display(): boolean
}

// 创建 alert 组件
const Alert: RefForwardingComponent<Api, TProp> = ({
  alert,
  alertHub,
  onOk,
  onHide
}, ref): ReactElement => {
  const modalRef = useRef<ModalApi>(null)
  const alertState = useSelector((state: State) => state.modal.alert)

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

    if (alertHub.length > 0) {
      const { message, opt } = alertHub.shift()

      return alert(message, opt)
    }
  }

  function onOkHandler(): void {
    onOk && onOk()

    return hide()
  }

  useImperativeHandle(ref, () => ({
    hide,
    show,
    display
  }))

  return (
    <Modal
      {...alertState.prop}
      type='alert'
      onOk={onOkHandler}
      onHide={onHideHandler}
      message={alertState.message}
      ref={modalRef}
    />
  )
}

export default forwardRef(Alert)
export { Api }
