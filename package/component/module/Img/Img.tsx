/**
 * Image 组件
 *
 * @prop src - 图片地址
 * @prop contain - 图片全展示并且垂直水平居中
 * @prop preSrc - 图片下载完之前的占位图片的地址（传 base64 字符串）
 * @prop alt - 图片描述
 * @prop title - 图片标题
 * @prop width - 图片宽度
 * @prop height - 图片高度
 * @prop className - 图片样式
 * @prop zoom - 图片放大
 * @prop zoomSrc - 需要放大的图片元素
 *
 */

import './Img.scss'

import React, {
  MouseEvent,
  UIEvent,
  FC,
  ReactElement,
  useState,
  useRef
} from 'react'
import Row from '../Row/Row'
import Col from '../Col/Col'

import { xclass } from '../../util/comp'
import errorImage from './pic_img_error.png'
import previewImage from './pic_load.png'
import Icon from '../Icon'

type TProp = React.HTMLProps<HTMLDivElement> & {
  contain?: boolean
  zoom?: boolean
  zoomSrc?: string
  preSrc?: string
  className?: string
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}

const compName = 'img'
const _xclass = (className: string | void): string => {
  return xclass(compName, className)
}

const Img: FC<TProp> = ({
  preSrc = '',
  className = '',
  src = '',
  alt = '',
  title = '',
  contain = false,
  zoom = false,
  zoomSrc,
  width = '',
  height = ''
}): ReactElement => {
  const meRef = useRef(null)
  const widthHeightRate = useRef(1)
  const [imgState, setImgState] = useState(1) // 1：图片加载前，2：图片加载成功，3：图片加载失败
  const [preImage] = useState(preSrc || previewImage)
  const [displayZoom, setDisplayZoom] = useState(false) // 放大图的显示状态
  const [displayZoomHint, setDisplayZoomHint] = useState(false) // 放大图的提示蒙层

  const imgSuccess = imgState === 2

  const [widthState, setWidthState] = useState(width === ''
    ? ''
    : Number.isNaN(Number(width)) ? width : `${width}px`
  )
  const [heightState, setHeightState] = useState(height === ''
    ? ''
    : Number.isNaN(Number(height)) ? height : `${height}px`
  )

  function imageLoadSuccess(event: UIEvent<HTMLImageElement>): void {
    const image = event.currentTarget

    if (contain) {
      widthHeightRate.current = image.width / image.height

      if (widthHeightRate.current > 1) {
        setWidthState('100%')
        setHeightState('auto')
      }

      if (widthHeightRate.current < 1) {
        setWidthState('auto')
        setHeightState('100%')
      }
    }

    setImgState(2)
  }

  function imageLoadError(): void {
    setImgState(3)
  }

  const imgProps = {
    className: _xclass('img'),
    width: widthState,
    height: heightState,
    alt,
    title
  }

  const imageBoxStyle = {
    width: widthState,
    height: heightState
  }

  return (
    <div
      style={{
        ...imageBoxStyle,
        cursor: imgSuccess && zoom ? 'pointer' : undefined
      }}
      className={`${_xclass()} ${className}`}
      ref={meRef}
      onClick={(): void => setDisplayZoom(true)}
      onMouseEnter={(): void => {
        !displayZoomHint && setDisplayZoomHint(true)
      }}
      onMouseLeave={(): void => {
        displayZoomHint && setDisplayZoomHint(false)
      }}
    >
      {imgSuccess && zoom && (
        <div
          className={_xclass('hintover')}
          style={{
            display: displayZoomHint ? '' : 'none'
          }}
        >
          <Icon
            className={_xclass('hintover-icon')}
            size='XL'
            kind='reading-glass'
            theme='light'
          />
        </div>
      )}

      {imgSuccess && zoom && displayZoom && (
        <div
          className={_xclass('zoom')}
          onMouseEnter={(): void => {
            setDisplayZoomHint(false)
          }}
        >
          <div
            className={_xclass('zoom-layover')}
            onClick={(event: MouseEvent): void => {
              event.stopPropagation()
              setDisplayZoom(false)
            }}
          />
          <Row align='center' justify='center' style={{ height: '100vh' }}>
            <Col>
              <div className={_xclass('zoom-img')}>
                <img
                  style={{
                    width: widthHeightRate.current > 1 ? '400px' : 'auto',
                    height: widthHeightRate.current > 1 ? 'auto' : '600px'
                  }}
                  className={_xclass('zoom-img-ele')}
                  src={zoomSrc || src}
                />
              </div>
            </Col>
          </Row>
        </div>
      )}

      {imgState === 1 && (
        <img
          {...imgProps}
          src={preImage}
        />
      )}

      <img
        {...imgProps}
        src={src}
        onLoad={imageLoadSuccess}
        onError={imageLoadError}
        style={{
          display: imgSuccess ? '' : 'none',
          ...imageBoxStyle
        }}
      />

      {imgState === 3 && (
        <img
          {...imgProps}
          src={errorImage}
        />
      )}
    </div>
  )
}

export default Img
