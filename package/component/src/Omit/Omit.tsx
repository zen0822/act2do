/**
 * omit 省略组件
 *
 * @prop line - 多行省略规定的行数，默认是 1 行
 * @prop width - 段落行宽
 *
 */

import './Omit.scss'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { xclass, optXclass } from '../../util/comp'

const compPrefix = 'omit'
const _xclass = (className: string | Array<any>): string => {
  return xclass(compPrefix, className)
}

type TypeOmitProp = {
  className?: string,
  line?: number,
  width?: number
}

const Omit: React.FC<TypeOmitProp> = ({
  className = '',
  line = 1,
  width,
  ...props
}): React.ReactElement => {
  const [stateLine, setStateLine] = useState<Array<string>>([])
  const preStateLine = useRef<Array<string>>()

  const refFont = useRef<HTMLElement>(null)
  const refMe = useRef<HTMLDivElement>(null)
  const fontWidthHub = useRef<{ [key: string]: number }>({}) // 文字宽度集合

  const refPreBoxWidth = useRef<number>()
  const refBoxWidth = useRef(0)

  const lineLength = stateLine.length

  // 匹配汉字
  function isDoubleByte(text: string): boolean {
    const regex = /[^\u4e00-\u9fa5]/

    if (regex.test(text)) {
      return true
    }

    return false
  }

  const textWidth = useCallback((text: string): number => {
    if (text === ' ') {
      return 4
    }

    if (fontWidthHub.current[text] !== undefined) {
      return fontWidthHub.current[text]
    }

    const span = refFont.current

    if (!span) {
      return 0
    }

    let width = 0

    if (typeof span.textContent !== 'undefined') {
      span.textContent = text
    } else {
      span.innerText = text
    }

    width = span.offsetWidth

    if (isDoubleByte(text)) {
      fontWidthHub.current = {
        ...fontWidthHub.current,
        doubleByte: width
      }
    } else {
      fontWidthHub.current = {
        ...fontWidthHub.current,
        [text]: width
      }
    }

    return width
  }, [])

  const splite = useCallback((content = props.children): void | boolean => {
    if (typeof content !== 'string') {
      return false
    }

    const contentArray = content.split('')
    const contentArrayLength = contentArray.length
    const boxWidth = refBoxWidth.current

    let index = 0
    const lineFont = []

    for (let i = 0, lineLength = line; i < lineLength; i++) {
      if (contentArray[index] === undefined) {
        break
      }

      let lineWidth = 0 // 这一行的宽度
      let j = index
      let char = ''
      let lastFontWidthOver = false

      for (; j < contentArrayLength; j++) {
        const fontWidth = textWidth(contentArray[j])

        if (contentArray[j] === undefined || (fontWidth + lineWidth) >= boxWidth) {
          // 最后一行并且文字总宽度大于容器宽度时
          lastFontWidthOver = i === lineLength - 1 && (fontWidth + lineWidth) >= boxWidth

          break
        }

        lineWidth = lineWidth + fontWidth
        char = char + contentArray[j]
      }

      lineFont.push((lastFontWidthOver && i === lineLength - 1) ? (char + '...') : char)

      index = j
    }

    preStateLine.current = stateLine
    setStateLine(lineFont)
  }, [line, props.children, stateLine, textWidth])

  useEffect(() => {
    let boxWidth = 0

    if (width === undefined) {
      if (refMe.current) {
        boxWidth = refMe.current.offsetWidth - 1
      } else {
        boxWidth = 0
      }
    } else {
      boxWidth = width
    }

    refPreBoxWidth.current = refBoxWidth.current
    refBoxWidth.current = boxWidth

    if (refBoxWidth.current !== refPreBoxWidth.current) {
      splite()
    }
  }, [splite, stateLine.length, width])

  return (
    <div
      ref={refMe}
      style={{ width: `${width}px` || undefined }}
      className={`${_xclass('')} ${className}`}
    >
      <span className={_xclass('font-width')} ref={refFont}></span>
      {stateLine.map((item, index) => {
        return item !== undefined && item !== ''
          ? (
            <div
              className={optXclass(compPrefix, {
                'line': true,
                'line-last': index + 1 === lineLength
              })}
              key={index.toString()}
            >
              {item}
            </div>
          ) : null
      })}
    </div>
  )
}

export default Omit
