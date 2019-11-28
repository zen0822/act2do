/**
 * 底部弹出的提示（toast)
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
import Message from './Message'

type TProp = {
 toast: any
  toastHub: Array<any>
  onAutoHideCb(): void
}

type Api = {
  show(): void
  hide(): void
}

type MessageApi = any

// 创建toast 组件
const Toast: RefForwardingComponent<Api, TProp> = ({
  toast,
  toastHub,
  onAutoHideCb
}, ref): ReactElement => {
  const messageRef = useRef<MessageApi>(null)
  const toastState = useSelector((state: State) => state.message.toast)

  function show(): void {
    messageRef.current.show()
  }

  function hide(): void {
    messageRef.current.hide()
  }

  function autoHideCb(): void {
    onAutoHideCb && onAutoHideCb()

    if (toastHub.length > 0) {
      const { message, opt } = toastHub.shift()

      return toast(message, opt)
    }
  }

  useImperativeHandle(ref, () => ({
    hide,
    show
  }))

  return <Message
    hide={autoHideCb}
    info={toastState.message}
    position='bottom'
    kind='fade'
    ref={messageRef}
  />
}

export default forwardRef(Toast)
