/**
 * page 组件
 *
 * @prop auto -自动计算分页数据（data 选项需要传入数据的长度 length 和每页的数据数目 size）
 * @prop display - 显示分页控件
 * @prop data - 分页数据
 *             length - 一共有几条数据
 *             total - 一共有多少页
 *             size - 每页几条数据
 *             current - 当前的页码
 * @prop onePageDisplay - 分页总页数为 1 时是否显示
 * @prop size - 分页外观尺寸大小（s | m | l）
 * @prop type - 分页类型（加载更多：more | 数字标注（默认）：num）
 * @prop loadMoreText - 加载更多的提示文字
 * @prop jumpControl - 跳转功能
 *
 * @event onSwitch - 换页触发事件
 *
 * @slot SlotLoadMore - 分页类型为加载更多时的，在按钮处的内容分发
 */

import './Page.scss'

import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useCallback,
  MouseEvent
} from 'react'
import { xclass } from '../../util/comp'

import Btn from '../Btn'
import Icon from '../Icon'
import Input from '../Input'
import Row from '../Row'
import Col from '../Col'

type TPage = {
  current?: number
  length: number
  size: number
  total?: number
}

type TProp = {
  auto?: boolean
  className?: string
  jumpControl?: boolean
  data: TPage
  display?: boolean
  loadMoreText?: string
  onePageDisplay?: boolean
  onSwitch?: (num?: number) => void
  size?: 's' | 'M' | 'xs' | 'XS' | 'S' | 'm' | 'l' | 'L' | 'xl' | 'XL'
  SlotLoadMore?: FC
  theme?: string
  type?: 'num' | 'more'
}

const _xclass = (className: string | Array<string>): string => {
  return xclass('page', className)
}

const Page: FC<TProp> = ({
  auto = false,
  className = '',
  jumpControl = false,
  data,
  display = true,
  loadMoreText = '点击加载更多',
  onePageDisplay = false,
  size = 'xs',
  SlotLoadMore,
  theme = 'primary',
  type = 'num',
  ...props
}): ReactElement => {
  const [pageData, setPageData] = useState<TPage>({
    current: 0,
    length: 0,
    total: 0,
    size: 0
  })
  const [pageItem, setPageItem] = useState<Array<number>>([])
  const [inputNum, setInputNum] = useState<string | number>('')

  /**
   * 组件的类名
   */
  function _compClass(): string {
    return _xclass([
      '',
      `theme-${theme}`,
      `type-${type}`
    ])
  }

  /**
   * 初始化分页
   */
  const initPage = useCallback((): void => {
    const pageData = data

    if (auto) {
      Object.assign(pageData, {
        total: Math.ceil(pageData.length / pageData.size),
        current: 1
      })
    }

    const pageCurrent = pageData.current ? pageData.current : 0
    const pageTotal = pageData.total ? pageData.total : 0
    const pageItem = []

    let pageStart = 1
    let pageEnd = pageTotal

    if (pageTotal >= 11) {
      if (pageCurrent > 5 && pageCurrent < pageTotal - 4) {
        pageStart = pageCurrent - 5
        pageEnd = pageCurrent + 4
      } else {
        if (pageCurrent <= 5) {
          pageStart = 1
          pageEnd = 10
        } else {
          pageEnd = pageTotal
          pageStart = pageTotal - 9
        }
      }
    }

    while (pageStart <= pageEnd) {
      pageItem.push(pageStart)
      pageStart++
    }

    setPageData(pageData)
    setPageItem(pageItem)
  }, [auto, data])

  /**
   * 切换页码
   */
  function shift(pageNum: number): boolean | void {
    if (isNaN(pageNum)) {
      return false
    }

    pageData.current = pageNum
    props.onSwitch && props.onSwitch(pageNum)
  }

  /**
   * @param {Number} - 当前页码
   * @return {Function}
   */
  function click(event: MouseEvent, currentPage: number): void | boolean {
    event.stopPropagation && event.stopPropagation()

    if (currentPage === pageData.current) {
      return false
    }

    return shift(currentPage)
  }

  /**
   * 下一页
   */
  function next(event?: MouseEvent): boolean | void {
    event && (event.stopPropagation && event.stopPropagation())

    if (pageData.current === pageData.total) {
      return false
    }

    const pageCurrent = pageData.current ? pageData.current : 0
    const pageTotal = pageData.total ? pageData.total : 0

    if (pageCurrent + 1 > pageTotal) {
      return false
    }

    return shift(pageCurrent + 1)
  }

  /**
   * 上一页
   */
  function pre(event: MouseEvent): boolean | void {
    event.stopPropagation && event.stopPropagation()

    if (pageData.current === 1) {
      return false
    }

    const pageCurrent = pageData.current ? pageData.current : 0

    if (pageCurrent - 1 === 0) {
      return false
    }

    return shift(pageCurrent - 1)
  }

  /**
   * 最后一页
   */
  function end(event: MouseEvent): boolean | void {
    event.stopPropagation && event.stopPropagation()

    if (pageData.current === pageData.total) {
      return false
    }

    const pageTotal = pageData.total ? pageData.total : 0

    return shift(pageTotal)
  }

  /**
   * 第一页
   */
  function start(event: MouseEvent): boolean | void {
    event.stopPropagation && event.stopPropagation()

    if (pageData.current === 1) {
      return false
    }

    return shift(1)
  }

  /**
   * 跳转到指定页数
   */
  function jump(event: MouseEvent): boolean | void {
    event.stopPropagation && event.stopPropagation()

    return shift(typeof inputNum === 'number' ? inputNum : Number(inputNum))
  }

  /**
   * 加载更多
   */
  function more(event: MouseEvent): boolean | void {
    event.stopPropagation && event.stopPropagation()

    return next()
  }

  useEffect(() => {
    initPage()
  }, [initPage])

  return (
    <div
      className={`${_compClass()} ${className}`}
      style={{
        display: display && (onePageDisplay || pageData.length > 0) ? '' : 'none'
      }}
    >
      {type === 'more'
        ? (
          <div
            className={_xclass('more')}
            onClick={more}
          >
            <div className={_xclass('load')}>
              {SlotLoadMore
                ? <SlotLoadMore />
                : loadMoreText
              }
            </div>
          </div>
        ) : (
          <div className={_xclass('num')}>
            <Row justify='center'>
              <Col>
                <div className={_xclass('length')}>{`共 ${pageData.length} 条`}</div>
              </Col>
              <Col>
                <Row className='z-css-m-r-double'>
                  <Col>
                    <div
                      className={_xclass('ele')}
                      onClick={start}
                    >
                      <Icon
                        color={pageData.current === 1 ? '#ccc' : undefined}
                        size={size}
                        kind='arrow-west-fast'
                      />
                    </div>
                  </Col>
                  <Col>
                    <div
                      className={_xclass('ele')}
                      onClick={pre}
                    >
                      <Icon
                        color={pageData.current === 1 ? '#ccc' : undefined}
                        size={size}
                        kind='arrow-west'
                      />
                    </div>
                  </Col>
                  <Col>
                    <Row className={_xclass('ul')}>
                      {pageItem.map((pageNum, index) => (
                        <Col
                          className={_xclass(['li', 'ele']) + ` ${pageNum === pageData.current ? _xclass('li-active') : ''}`}
                          key={index.toString()}
                        >
                          <div onClick={(event: MouseEvent): void | boolean => click(event, pageNum)}>
                            {pageNum}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col>
                    <div
                      className={_xclass('ele')}
                      onClick={next}
                    >
                      <Icon
                        size={size}
                        color={pageData.current === pageData.total ? '#ccc' : undefined}
                        kind='arrow-east' />
                    </div>
                  </Col>
                  <Col>
                    <div
                      className={_xclass('ele')}
                      onClick={end}
                    >
                      <Icon
                        size={size}
                        color={pageData.current === pageData.total ? '#ccc' : undefined}
                        kind='arrow-east-fast'
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row className={_xclass('search')}>
                  <Col>
                    <span className={_xclass('total')}>
                      {`共 ${pageData.total} 页 `}
                    </span>
                  </Col>
                  {jumpControl && [
                    <Col key='jump0'><span>第&nbsp;</span></Col>,
                    <Col key='jump1'>
                      <Input
                        className={_xclass('jump-box')}
                        value={inputNum}
                        onChange={(value): void => setInputNum(value)}
                      />
                    </Col>,
                    <Col key='jump2'>
                      <span className='z-css-m-r'>&nbsp;页</span>
                    </Col>,
                    <Col key='jump3'>
                      <Btn
                        className={_xclass('jump-btn')}
                        value='GO'
                        size='s'
                        onClick={jump}
                      />
                    </Col>
                  ]}
                </Row>
              </Col>
            </Row>
          </div>
        )
      }
    </div>
  )
}

export default Page
