/**
 * modal 模态框组件
 *
 * @prop className
 * @prop commit - 当是 full 类型的时候，
 *                不用确认直接提交的模态框，默认为否
 * @prop clickBgToHide - 点击弹窗的背景可以触发隐藏
 * @prop header - 弹窗头部标题
 * @prop message - 模态框信息
 * @prop display - 显示状态
 * @prop deviceRange - 设备宽度范围
 *
 * @prop okBtn - 确定按钮名字
 * @prop noBtn - 取消按钮名字
 * @prop okBtnDisplay - 确定按钮是否显示
 * @prop noBtnDisplay - 取消按钮是否显示
 *
 * @prop headerDisplay - 是否显示弹窗头部
 * @prop footerDisplay - 是否显示弹窗底部
 * @prop pure - 如果设置了 true 则弹窗体就只能是 props.children，头部和底部都会被隐藏
 *
 * @prop height - 弹窗内容的高度 (Number | 'auto' | '100%')
 * @prop type - 弹窗类型（full | alert | confirm | simple | long）
 *
 * @slot - 弹窗的主体内容
 *
 * @event onOk - 点击确定按钮
 * @event onNo - 点击取消按钮
 * @event onHide - 隐藏模态框之后的事件
 * @event onClickShadow - 隐藏模态框之后的事件
 */

import './Modal.scss'
import './Modal.m.scss'

import React, {
  RefForwardingComponent,
  useRef,
  ReactElement,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { xclass, optXclass } from '../../util/comp'

import Pop from '../Pop/Pop'
import Header from './Header'
import Footer from './Footer'

import {
  handleEleDisplay
} from '../../util/dom/prop'

type TProp = React.HTMLProps<HTMLDivElement> & {
  clickBgToHide?: boolean
  className?: string
  commit?: boolean
  deviceRange?: number
  display?: boolean
  footerDisplay?: boolean
  header?: string
  headerDisplay?: boolean
  headerNoBtnDisplay?: boolean
  height?: number
  hideClose?: boolean
  message?: string | number
  noBtn?: string
  noBtnDisplay?: boolean
  okBtn?: string
  okBtnDisplay?: boolean
  onClickShadow?: () => void
  onHide?: () => void
  onNo?: () => void
  onOk?: () => void
  pure?: boolean
  position?: string
  theme?: string
  type?: string
}

type Api = {
  compName: string
  hide(): void
  display: boolean
  show(): void
  no(): void
  ok(): void
}

const compName = 'modal'
const _xclass = (className?: string | Array<string>): string => {
  return xclass(compName, className)
}

const Modal: RefForwardingComponent<Api, TProp> = ({
  className = '',
  children,
  commit = false,
  clickBgToHide = false,
  deviceRange = 0,
  display = false,
  footerDisplay,
  header,
  okBtn = '确定',
  noBtn = '取消',
  message = '',
  height,
  headerDisplay,
  onHide,
  onOk,
  onNo,
  pure = false,
  position = 'center',
  theme = 'primary',
  type = 'simple',
  ...props
}, ref): ReactElement => {
  const [modalDisplay, setModalDisplay] = useState(display)
  const meRef = useRef<HTMLDivElement>(null)
  const popRef = useRef<any>(null)
  const isMousedown = useRef(false)
  const pointStart = useRef({
    x: 0,
    y: 0
  })

  const headerClass = useMemo(() => (optXclass('modal', {
    'no-header': !headerDisplay,
    'no-header-title': !!header
  })), [headerDisplay, header])
  const isFull = useMemo(() => (type === 'full'), [type])
  const isBiggerFull = useMemo(() => (
    (isFull && deviceRange > 575) || !isFull
  ), [isFull, deviceRange])

  const getHeaderDisplay = useMemo((): boolean => {
    if (headerDisplay !== undefined) {
      return headerDisplay
    }

    if (header !== undefined) {
      return !!header
    }

    switch (type) {
      case 'full':
        return true
      case 'simple':
        return false
      default:
        return !!header
    }
  }, [header, headerDisplay, type])

  const getFooterDisplay = useMemo((): boolean => {
    if (footerDisplay !== undefined) {
      return footerDisplay
    }

    switch (type) {
      case 'full':
        return isBiggerFull
      case 'simple':
        return false
      case 'confirm':
        return true
      case 'alert':
        return true
      default:
        return true
    }
  }, [footerDisplay, isBiggerFull, type])

  const getModalHeight = useMemo((): number | string => {
    if (height) {
      return height
    }

    switch (type) {
      case 'full':
        return isBiggerFull ? 300 : '100%'
      case 'simple':
        return 150
      default:
        return 120
    }
  }, [height, isBiggerFull, type])

  const [modalHeaderDisplay, setModalHeaderDisplay] = useState(getHeaderDisplay)
  const [modalFooterDisplay, setModalFooterDisplay] = useState(getFooterDisplay)
  const [modalHeight, setModalHeight] = useState(getModalHeight)

  /**
   * 组件的类名
   */
  function _compClass(): string {
    const compClass = ['', `type-${type}`]

    if (!modalHeaderDisplay) {
      compClass.push('no-header')
    }

    return _xclass(compClass) + ' ' + className
  }

  /**
     * pop 离开之后的回调函数
     */
  function _afterPopLeave(): void {
    meRef.current && (meRef.current.style.display = 'none'
    )
    onHide && onHide()
  }

  /**
   * mousemove 事件的句柄
   * 主要是弹窗的拖曳功能实现
   */
  function mouseMoveHandler(event: MouseEvent): void | boolean {
    event.preventDefault()

    if (!isMousedown.current || !meRef.current) {
      return false
    }

    const $this = meRef.current.querySelector('.' + xclass('pop'))

    if (!$this) {
      return false
    }

    const styleHub = getComputedStyle($this)

    const top = parseFloat(styleHub.top || '0')
    const left = parseFloat(styleHub.left || '0')

    popRef.current.setPosition({
      top: top + event.clientY - pointStart.current.y,
      left: left + event.clientX - pointStart.current.x
    })

    pointStart.current = {
      x: event.clientX,
      y: event.clientY
    }
  }

  /**
   * mouseup 事件的句柄
   */
  function mouseUpHandler(event: MouseEvent): void | boolean {
    event.preventDefault()

    if (!isMousedown) {
      return false
    }

    isMousedown.current = false
  }

  /**
   * mousedown 事件的句柄
   */
  function mouseDownHandler(event: MouseEvent): void {
    isMousedown.current = true

    pointStart.current = {
      x: event.clientX,
      y: event.clientY
    }
  }

  /**
   * 显示 modal
   *
   * @param {Number} - 当前页码
   * @return {Object}
   */
  function show(): void | boolean {
    if (!meRef.current) {
      return false
    }

    meRef.current.style.display = ''
    setModalDisplay(true)

    popRef.current.enter()
  }

  /**
   * 隐藏 modal
   *
   * @return {Object}
   */
  function hide(): void {
    setModalDisplay(false)

    popRef.current.leave()
  }

  /**
     * 弹窗点击确定触发的函数
     *
     * @return {Object}
     */
  function ok(): void {
    onOk ? onOk() : hide()
  }

  /**
     * 弹窗点击取消触发的函数
     *
     * @return {Object}
     */
  function no(): void {
    onNo ? onNo() : hide()
  }

  /**
   * 点击 Full 的导航按钮
   */
  function clickFullNavHandler(): void {
    if (commit) {
      no()
    } else {
      hide()
    }
  }

  useEffect(() => {
    handleEleDisplay({
      element: meRef.current,
      cb: () => {
        popRef.current.computePosition()
      }
    })
  })

  useEffect(() => {
    setModalDisplay(display)
  }, [display])

  useEffect(() => {
    setModalHeaderDisplay(getHeaderDisplay)
    setModalFooterDisplay(getFooterDisplay)
    setModalHeight(getModalHeight)
  }, [getFooterDisplay, getHeaderDisplay, getModalHeight])

  const popEle = []

  if (modalHeaderDisplay) {
    popEle.push(
      <Header
        key='header'
        className={headerClass}
        commit={commit}
        isFull={isFull}
        isBiggerFull={isBiggerFull}
        header={header}
        okBtn={okBtn}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onClickFullNav={clickFullNavHandler}
        type={type}
      />
    )
  }

  popEle.push(
    <article key='article' className={_xclass('pop-article')}>
      {children || <div className={`${_xclass('alert-message')} ${header ? _xclass('gray-message') : ''}`}>{message}</div>
      }
    </article>
  )

  if (modalFooterDisplay) {
    popEle.push(
      <Footer
        key='footer'
        theme={theme}
        isFull={isFull}
        okBtn={okBtn}
        noBtn={noBtn}
        ok={ok}
        no={no}
        type={type}
      />
    )
  }

  useImperativeHandle(ref, () => ({
    hide,
    show,
    ok,
    no,
    display: modalDisplay,
    compName: compName
  }))

  return (
    <div
      className={_compClass()}
      onMouseMove={mouseMoveHandler}
      style={{
        display: modalDisplay ? '' : 'none',
        height: modalHeight
      }}
      ref={meRef}
    >
      <div
        className={_xclass('bg')}
        onClick={(): void => {
          props.onClickShadow && props.onClickShadow()
          clickBgToHide && no()
        }}
      ></div>

      <Pop
        display={display}
        className={`${pure ? _xclass('pop-pure') : ''} ${_xclass('pop')}`}
        afterLeave={_afterPopLeave}
        position={position}
        ref={popRef}
        type='fade'
      >
        {pure ? children : popEle}
      </Pop>
    </div>
  )
}

export default forwardRef(Modal)

export {
  Api
}
