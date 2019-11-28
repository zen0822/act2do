/**
 * 弹出样式的提示
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
  tip: any
  tipHub: Array<any>
  onAutoHideCb(): void
}

type Api = {
  show(): void
  hide(): void
}

type MessageApi = any

// 创建 tip 组件
const Tip: RefForwardingComponent<Api, TProp> = ({
  tip,
  tipHub,
  onAutoHideCb
}, ref): ReactElement => {
  const messageRef = useRef<MessageApi>(null)
  const tipState = useSelector((state: State) => state.message.tip)

  function show(): void {
    messageRef.current.show()
  }

  function hide(): void {
    messageRef.current.hide()
  }

  function autoHideCb(): void {
    onAutoHideCb && onAutoHideCb()

    if (tipHub.length > 0) {
      const { message, opt } = tipHub.shift()

      return tip(message, opt)
    }
  }

  useImperativeHandle(ref, () => ({
    hide,
    show
  }))

  return <Message
    hide={autoHideCb}
    info={tipState.message}
    kind='fade'
    ref={messageRef}
  />
}

export default forwardRef(Tip)
