/**
 * Slideshow 组件
 *
 * @prop {string} className
 * @prop {object} style - 样式
 *
 * @prop {array} item - 幻灯片内容（react 组件格式）
 * @prop {string} speed - 速度（slow | normal | fast)
 * @prop {string} stopSpeed - 轮播时的停留速度（slow | normal | fast)
 * @prop {string} type - 动画类型（slide | fade) 默认 slide
 * @prop {number} height - 幻灯片高度
 * @prop {number} width - 幻灯片宽度
 *
 * @prop {boolean} auto - 自动播放，并且是以跑马灯效果无限循环播放
 * @prop {string} page - 分页类型 (num | spot | rail | none),
 *                       默认是 num 数字分页，spot 的点点分页
 *                       rail 横条样式

 * @slot - 滚动内容
 */

import './Slideshow.scss'
import React, {
  useState,
  useEffect,
  useRef,
  TouchEvent,
  useCallback
} from 'react'
import { useInterval } from '../../hook'
import { xclass, optXclass } from '../../util/comp'
import Row from '../Row/Row'
import Col from '../Col/Col'

const compPrefix = 'slideshow'

const _xclass = (className?: string | Array<string>): string => {
  return xclass(compPrefix, className)
}

type TypeSpeed = 'slow' | 'normal' | 'fast'
type TypeSlideshowProp = {
  auto?: boolean
  className?: string
  height?: string | number
  item?: Array<object>
  page?: string
  speed?: TypeSpeed
  stopSpeed?: TypeSpeed
  style?: any
  type?: 'slide' | 'fade'
  width?: string | number
}

const Slideshow: React.FC<TypeSlideshowProp> = ({
  auto = false,
  className = '',
  height,
  item = [],
  speed = 'normal',
  stopSpeed = 'normal',
  style = {},
  width,
  ...props
}): React.ReactElement => {
  type TypeSlideshowItem = Array<{ className: string, switchTime: number }>

  const [slideshowItem, setSlideshowItem] = useState<TypeSlideshowItem>([]) // 轮播的组
  const [currentIndex, setCurrentIndex] = useState(1) // 当前播放的页数
  const [runInterval, setRunInterval] = useState(false) // 运行 interval

  const refFirst = useRef(true)
  const refMe = useRef(null)
  const refPlaying = useRef(false) // 正在执行动画
  const refIsMounted = useRef(false) // 组件是否在安装状态
  const refIsTouchStart = useRef(false) // 正在触发 touchStart 事件

  // 触控的开始位置
  const refTouchStart = useRef({
    x: 0,
    y: 0
  })

  // 触控的结束位置
  const refTouchEnd = useRef({
    x: 0,
    y: 0
  })

  function getSwitchTime(speed: TypeSpeed): number {
    switch (speed) {
      case 'fast':
        return 300
      case 'normal':
        return 800
      case 'slow':
        return 1300
      default:
        return 300
    }
  }

  function getStopTime(stopSpeed: TypeSpeed): number {
    switch (stopSpeed) {
      case 'slow':
        return 10000
      case 'normal':
        return 7000
      case 'fast':
        return 4000
      default:
        return 7000
    }
  }

  const switchTime = getSwitchTime(speed)
  const stopTime = getStopTime(stopSpeed)
  const totalIndex = item.length

  function _setEleClass({
    ele = true,
    active = false,
    left = false,
    right = false,
    pre = false,
    next = false
  } = {}): string {
    return optXclass(compPrefix, {
      'ele': ele,
      'ele-active': active,
      'ele-left': left,
      'ele-right': right,
      'ele-pre': pre,
      'ele-next': next
    })
  }
  const initSlideshowItem = useCallback((time = switchTime): TypeSlideshowItem => {
    const itemHub = []

    for (let i = 0, len = totalIndex; i < len; i++) {
      if (i === currentIndex - 1) {
        itemHub.push({
          className: _setEleClass({
            active: true
          }),
          switchTime: time
        })
      } else {
        itemHub.push({
          className: _setEleClass(),
          switchTime: time
        })
      }
    }

    setSlideshowItem(itemHub)

    return itemHub
  }, [currentIndex, switchTime, totalIndex])

  /**
   * 上一页幻灯片
   *
   * @param {Number} index - 退后到指定的页面
   */
  const pre = (
    preIndex = currentIndex === 1 ? totalIndex : currentIndex - 1,
    time = switchTime
  ): void | boolean => {
    if (totalIndex <= 1 || (!auto && currentIndex === 1)) {
      return false
    }

    if (refPlaying.current) {
      return false
    }

    const slideshowItem = initSlideshowItem(time)
    refPlaying.current = true
    const item = [...slideshowItem]

    item[currentIndex - 1].className = _setEleClass({
      active: true
    })
    item[preIndex - 1].className = _setEleClass({
      pre: true
    })

    setSlideshowItem(item)

    window.setTimeout(() => {
      if (!refIsMounted.current) {
        return false
      }

      const item2 = [...item]

      item2[currentIndex - 1].className = _setEleClass({
        right: true,
        active: true
      })
      item2[preIndex - 1].className = _setEleClass({
        right: true,
        pre: true
      })

      setSlideshowItem(item2)

      window.setTimeout(() => {
        if (!refIsMounted.current) {
          return false
        }

        const item3 = [...item2]

        item3[currentIndex - 1].className = _setEleClass()
        item3[preIndex - 1].className = _setEleClass({
          active: true
        })

        setSlideshowItem(item3)
        setCurrentIndex(preIndex)
        refPlaying.current = false
      }, time)
    }, 100)
  }

  /**
   * 下一页幻灯片
   *
   * @param index
   * @param time 切换的时间
   */
  const next = (
    nextIndex = currentIndex === totalIndex ? 1 : currentIndex + 1,
    time = switchTime
  ): void | boolean => {
    if (totalIndex <= 1 || (!auto && currentIndex === totalIndex)) {
      return false
    }

    if (refPlaying.current) {
      return false
    }

    const slideshowItem = initSlideshowItem(time)
    refPlaying.current = true

    const item = [...slideshowItem]

    item[currentIndex - 1].className = _setEleClass({
      active: true
    })
    item[nextIndex - 1].className = _setEleClass({
      next: true
    })

    setSlideshowItem(item)

    window.setTimeout(() => {
      if (!refIsMounted.current) {
        return false
      }

      const item2 = [...item]

      item2[currentIndex - 1].className = _setEleClass({
        left: true,
        active: true
      })
      item2[nextIndex - 1].className = _setEleClass({
        left: true,
        next: true
      })

      setSlideshowItem(item2)

      window.setTimeout(() => {
        if (!refIsMounted.current) {
          return false
        }

        const item3 = [...item2]

        item3[currentIndex - 1].className = _setEleClass()
        item3[nextIndex - 1].className = _setEleClass({
          active: true
        })

        setSlideshowItem(item3)
        setCurrentIndex(nextIndex)
        refPlaying.current = false
      }, time)
    }, 100)
  }

  /**
   * 停止轮播
   */
  const stop = (): void | boolean => {
    setRunInterval(false)
  }

  /**
   * 处理幻灯片的播放
   *
   * @param {Number} index - 切换到指定的页面
   */
  const play = (index?: number): void => {
    if (index === undefined) {
      next()
    } else if (index - currentIndex > 0) {
      next(index)
    } else {
      pre(index)
    }
  }

  /**
   * 开始自动轮播
   */
  const start = (): void | boolean => {
    setRunInterval(true)
  }

  function _handlerTouchStart(event: TouchEvent): void {
    refIsTouchStart.current = true

    refTouchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  function _handlerTouchMove(event: TouchEvent): void | boolean {
    if (!refIsTouchStart.current) {
      return false
    }

    refTouchEnd.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  function _handlerTouchEnd(): void {
    const xDistance = refTouchEnd.current.x - refTouchStart.current.x
    refIsTouchStart.current = false

    // 滚动区域正方向移动
    if (xDistance < 0) {
      next(undefined, 300)
    } else {
      pre(undefined, 300)
    }
  }

  let paginationEle = null
  const { page: pageType } = props

  if (pageType !== 'none') {
    switch (pageType) {
      case 'num':
        paginationEle = (
          <div className={_xclass('pagination-num')}>
            {currentIndex} / {totalIndex}
          </div>
        )
        break
      case 'spot':
        paginationEle = (
          <Row
            className={_xclass('pagination-spot')}
            noWrap
          >
            {item.map((_item, index) => (
              <Col
                className={`${_xclass('pagination-spot-ele')} ${index + 1 === currentIndex ? _xclass('pagination-spot-ele-current') : ''}`}
                key={index.toString()}
              ></Col>
            ))}
          </Row>
        )
        break
      default:
        paginationEle = (
          <Row
            className={_xclass('pagination-rail')}
            noWrap
          >
            {item.map((_item, index) => (
              <Col
                className={`${_xclass('pagination-rail-ele')} ${index + 1 === currentIndex ? _xclass('pagination-rail-ele-current') : ''}`}
                key={index.toString()}
              ></Col>
            ))}
          </Row>
        )
    }
  }

  useEffect((): any => {
    refIsMounted.current = true

    return (): void => {
      refIsMounted.current = false
    }
  }, [])

  useEffect((): any => {
    if (refFirst.current) {
      initSlideshowItem()
    }

    refFirst.current = false
  }, [initSlideshowItem])

  useEffect((): any => {
    if (auto && auto) {
      stop()
      start()
    }

    return (): any => {
      stop()
    }
  }, [auto])

  useInterval(function () {
    if (refIsMounted.current) {
      play()
    }
  }, runInterval ? stopTime : null)

  return (
    <div
      ref={refMe}
      className={`${_xclass()} ${className}`}
      style={{
        ...style
      }}
      onTouchStart={_handlerTouchStart}
      onTouchMove={_handlerTouchMove}
      onTouchEnd={_handlerTouchEnd}
    >
      <Row className={_xclass('container')}>
        {slideshowItem.map((slideshowEle, slideshowEleIndex) => (
          <Col
            className={slideshowEle.className}
            key={slideshowEleIndex}
            style={{
              transitionDuration: `${slideshowEle.switchTime}ms`,
              height: `${height}px`,
              width: Number.isNaN(Number(width))
                ? width
                : `${width}px`
            }}
          >
            {item[slideshowEleIndex]}
          </Col>
        ))}
      </Row>

      {totalIndex > 1 && (
        <div className={_xclass('pagination')}>
          {paginationEle}
        </div>
      )}
    </div>
  )
}

export default Slideshow
