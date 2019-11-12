/**
 * list 组件(当前只支持移动端)
 *
 * 重要：当 auto = false 时，initItem 必须初始化传并且 initPage 必须由父组件传入
 *
 * @prop {array} initItem - 初始化列表数据
 * @prop {any} keyName - 列表数据作为 key 的参数名字
 * @prop {number} initDataLength - 当 pageType 为 load 时，一开始展示的数据条数
 * @prop {object} noMoreDataHint - 当 pageType 为 load 时，没有更多数据加载的提示文案，为空时不显示
 *
 * @prop {boolean} auto - 根据传入的列表数据自动生成分页数据
 * @prop {boolean} loadAll - 当 pageType 为 more 时，启用加载更多的功能即一下全部加载，而不是分页式的加载更多
 * @prop {object} initPage - 分页数据（没传的话，默认将传的列表数据（item）作为分页数据）
 * @prop {boolean} pager - 启动分页
 * @prop {string} pageType - 默认为 num，可选 more
 * @prop {string} pageSize - 将列表数据（item）分为每页多少条数据
 * @prop {string} pageTrigger - 加载更多的触发模式（滚动到底部自动触发（默认）：scroll | 点击：click）

 * @prop {boolean} refresh - 页面下拉刷新的开关
 * @prop {number} slotHeaderHeight - slotHeader 的高度，作为滚动加载需要排除的高度
 *
 * @prop {string} className
 * @prop {boolean} animate - 是否有列表动画
 * @prop {number} height - 列表高度
 * @prop {string} theme - 主题
 * @prop {boolean} waterfall - 瀑布流数据
 *
 * @event onChange - 列表数据改变（分页和列表）
 * @event onScroll - 页面滚动事件
 *
 * @Slot slotHeader - 添加在列表头部的组件
 * @Slot Slot - 列表内容
 * @Slot SlotPage - 分页的内容分发
 */

import './List.scss'

import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useRef,
  TouchEvent,
  UIEvent
} from 'react'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'
// import { prop as eleProps } from '../../util/dom/prop'
import { uid } from '../../util/util'

import ListTransition from './ListTransition'
import Page from '../Page'
import Loading from '../Loading'
import Row from '../Row'
import Col from '../Col'

type TPage = {
  current: number
  length: number
  size: number
  total: number
}

type TInitPage = {
  current: number
  length: number
  size?: number
  total?: number
}

type TPageEle = 'current' | 'length' | 'size' | 'total'
type TItem = Array<Record<string, any>>

type TypeItemProps = {
  auto?: boolean
  animate?: boolean
  className?: string
  emptyHint?: string
  height?: string | number
  initDataLength?: number
  initItem: TItem
  initPage?: TInitPage
  keyName?: string
  loadAll?: boolean
  noMoreDataHint?: string
  onItemChange?: (list: TItem) => void
  onPageChange?: (page: TPage) => void
  onScroll?: (scrollTop: number) => any
  onSwitch?: (page: TPage) => Promise<[TItem, TPage?]>
  pager?: boolean
  pageSize?: number
  pageType?: 'num' | 'more'
  pageTrigger?: string
  refresh?: boolean
  Slot?: FC<{
    more: boolean
    index: number
    lastIndex: number
    item: Record<string, any>
  }>
  slotHeader?: ReactElement
  slotHeight?: number
  SlotPage?: FC<{
    display?: boolean
    loadAll?: boolean
  }>
  style?: { [key: string]: any }
  theme?: string
  waterfall?: boolean
}

const _xclass = (className: string | Array<string>): string => {
  return xclass('list', className)
}

// 存储还没执行过渡动画（没出现到用户视线）的列表数据
const addUIDToListItem = (listItem: TItem): TItem => {
  const listItemTemp = [...listItem]

  listItemTemp.forEach((item) => {
    if (!item) {
      return false
    }

    item.rcuid = uid()
  })

  return listItemTemp
}

const List: FC<TypeItemProps> = ({
  auto = false,
  animate = false,
  className = '',
  initDataLength = 0,
  initItem = [],
  initPage = {
    current: 0,
    length: 0
  },
  keyName,
  loadAll = false,
  noMoreDataHint = '已经到底啦 ~',
  onItemChange,
  onPageChange,
  onScroll,
  onSwitch,
  pager = false,
  pageType = 'num',
  pageTrigger = 'scroll',
  pageSize = 20,
  emptyHint = '暂无数据',
  style = {},
  Slot,
  slotHeight = 0,
  SlotPage,
  waterfall = false,
  ...props
}): ReactElement => {
  const refMe = useRef<HTMLDivElement>(null) // 组件的 dom
  const refBox = useRef<HTMLDivElement>(null) // 组件的 dom
  const refScrolling = useRef(false) // 是否正在滚动
  const refNoAnimateListItem = useRef<TItem>([]) // 还没执行过渡动画（没出现到用户视线）的列表数据
  const preInitItemRef = useRef<TItem>([])
  const preInitPageRef = useRef<{
    current?: number
    length?: number
    size?: number
    total?: number
  }>({})

  const refListHeight = useRef(0) // 列表的高度
  const refListBoxHeight = useRef(0) // 列表内容的高度

  const refIsTouchStart = useRef(false) // 正在触发 touchStart 事件
  const refTouchStart = useRef({ // 触控的开始位置
    x: 0,
    y: 0
  })
  const refTouchEnd = useRef({ // 触控的结束位置
    x: 0,
    y: 0
  })

  const [loadingDisplay, setLoadingDisplay] = useState(false)
  const [hasLoadAll, setHasLoadAll] = useState(true)

  const [stateItem, setStateItem] = useState<TItem>([])
  const [statePage, setStatePage] = useState<TPage>({
    current: 0,
    length: 0,
    total: 0,
    size: 0
  })
  const [pageDisplay, setPageDisplay] = useState(false)

  const stateItemEmpty = stateItem.length === 0

  function compClass(): string {
    return _xclass([
      '',
      `type-${pageType}`
    ])
  }

  /**
   * 初始化分页相关数据
   */
  function getPageData(pageData: TInitPage): TPage {
    if (auto) {
      const listLength = initItem.length
      const size = pageSize

      return {
        length: Math.ceil(listLength / size),
        size,
        total: listLength,
        current: pageData.current + 1
      }
    } else {
      const pageSizeTmp = pageData.size || pageSize
      const pageTotal = pageData.total === undefined
        ? pageData.length * pageSize
        : pageData.total

      return {
        ...pageData,
        total: pageTotal,
        size: pageSizeTmp
      }
    }
  }

  /**
   * 初始化列表数据
   *
   * @param {object} props - 组件的 props 值
   */
  function getListData({
    listItem = initItem,
    pageData,
    replace = false
  }: {
    listItem?: TItem
    pageData: TPage
    replace?: boolean
  }): TItem {
    let itemTemp = []

    if (loadAll) {
      itemTemp = hasLoadAll
        ? listItem.slice(0, listItem.length)
        : listItem.slice(0, initDataLength)
    } else {
      if (auto) {
        let start = 0
        let end = 0

        if (pageData.current === 1) {
          start = 0
          end = initDataLength || pageSize
        } else {
          start = initDataLength
            ? (pageData.current - 2) * pageSize + initDataLength
            : (pageData.current - 1) * pageSize
          end = start + pageSize
        }

        itemTemp = listItem.slice(start, end)
      } else {
        itemTemp = addUIDToListItem(listItem)
      }
    }

    // refNoAnimateListItem.current = [...refNoAnimateListItem.current, ...itemTemp]

    if (replace) {
      return itemTemp
    }

    if (pageType === 'more') {
      return [...stateItem, ...itemTemp]
    } else {
      return itemTemp
    }
  }

  /**
   * 获得列表组件的相关数据
   */
  function getHeight(): void {
    refListHeight.current = refMe.current ? refMe.current.clientHeight : 0
    refListBoxHeight.current = refBox.current ? refBox.current.scrollHeight : 0
  }

  /**
   * 执行列表的动画效果
   *
   * @param {number} scrollTop - 列表内容的滚动高度
   */
  function animateListItem(scrollTop = 0): boolean | number {
    const noAnimateListItem = [...refNoAnimateListItem.current]
    const length = noAnimateListItem.length

    if (length === 0) {
      return false
    }

    return scrollTop

    // const $ref = refs[`listEle${noAnimateListItem[0].rcuid}`]

    // if (offsetTop > listHeight + scrollTop) {
    //   return false
    // }

    // const afterAnimate = async (index) => {
    //   if (index === length) {
    //     return false
    //   }

    //   const $ref = refs[`listEle${noAnimateListItem[index].rcuid}`]
    //   const props = eleProps($ref.$el)

    //   if (offsetTop < listHeight + scrollTop) {
    //     noAnimateListItem.shift()
    //     refs[`listEle${noAnimateListItem[index].rcuid}`].enter().then(() => {
    //       getHeight()
    //     })
    //     return afterAnimate(index + 1)
    //   }
    // }

    // return afterAnimate(0)
  }

  /**
   * 切换分页时
   */
  async function onSwitchHandler(): Promise<void | boolean> {
    if (statePage.length === statePage.current || !pageDisplay) {
      return false
    }

    if (auto) {
      if (loadAll) {
        // 加载全部
      }
    } else {
      if (onSwitch) {
        setLoadingDisplay(true)

        try {
          const [listItem, page] = await onSwitch(statePage)

          let pageData = null

          if (page) {
            pageData = getPageData({
              ...page
            })
          } else {
            pageData = getPageData({
              ...statePage,
              current: statePage.current + 1
            })
          }

          const listData = getListData({
            listItem,
            pageData
          })

          onPageChange && onPageChange(pageData)
          onItemChange && onItemChange(listData)

          setStateItem(listData)
          setStatePage(pageData)
          setLoadingDisplay(false)
        } catch (error) { console.warn() }
      }
    }
  }

  function onScrollHandler(event: UIEvent): void {
    const currentTarget = event.currentTarget
    const targetScrollTop = currentTarget.scrollTop

    if (!refScrolling.current) {
      window.requestAnimationFrame(() => {
        animate
          ? animateListItem(targetScrollTop)
          : getHeight()

        if (pageTrigger === 'scroll') {
          const flat = refListBoxHeight.current - refListHeight.current + slotHeight

          if (targetScrollTop < flat + 3 && targetScrollTop > flat - 3) {
            !loadingDisplay && pager && onSwitchHandler()
          }
        }

        refScrolling.current = false
      })

      refScrolling.current = true
    }

    onScroll && onScroll(targetScrollTop)
  }

  function _loadAllHandler(): void {
    setHasLoadAll(!hasLoadAll)
  }

  function onTouchStartHandler(event: TouchEvent): void {
    refIsTouchStart.current = true

    refTouchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  function onTouchMoveHandler(event: TouchEvent): void | boolean {
    if (!refIsTouchStart.current) {
      return false
    }

    refTouchEnd.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  function onTouchEndHandler(): void {
    refIsTouchStart.current = false
  }

  function initListItem(): void {
    const pageData = getPageData(initPage as TPage)
    const listItem = getListData({
      listItem: initItem,
      pageData: pageData
    })

    setStatePage(pageData)
    setStateItem(listItem)
    setPageDisplay(pageData.length !== pageData.current)

    onPageChange && onPageChange(pageData)
    onItemChange && onItemChange(listItem)
  }

  const SlotEle = ({ item, index, listItem }: { item: any, index: number, listItem: TItem }): ReactElement => {
    return Slot
      ? <Slot
        more={pageDisplay}
        index={index + 1}
        lastIndex={listItem.length}
        item={item}
      />
      : item.text
  }

  const contentEle = waterfall
    ? (
      <Row>
        {stateItem.map((item, index) => (
          <Col key={keyName ? item[keyName] : item.rcuid}>
            <SlotEle
              item={item}
              index={index}
              listItem={stateItem}
            />
          </Col>
        ))}
      </Row>
    ) : (
      <div className={_xclass('content')}>
        {animate
          ? (
            stateItem.map((item, index) => (
              <ListTransition
                className={_xclass('content-ele')}
                origin='50% 0'
                ref={`listEle${item.rcuid}`}
                key={index.toString()}
              >
                <Row>
                  <Col span={12}>
                    <SlotEle
                      item={item}
                      index={index}
                      listItem={stateItem}
                    />
                  </Col>
                </Row>
              </ListTransition>
            ))
          ) : (
            stateItem.map((item, index) => (
              <Row
                className={_xclass('content-ele')}
                key={keyName ? item[keyName] : item.rcuid}
              // ref={`listEle${item.rcuid}`}
              >
                <Col span={12}>
                  <SlotEle
                    item={item}
                    index={index}
                    listItem={stateItem}
                  />
                </Col>
              </Row>
            ))
          )
        }
      </div>
    )

  const operaterEle = (loadingDisplay || pageDisplay) && (
    <div className={_xclass('operation')}>
      {loadingDisplay
        ? (
          <Row justify='justify'>
            <Col width='50%' className={_xclass('operation-loading')}>
              <Loading
                size='S'
                className={_xclass('loading')}
                display={loadingDisplay}
              />
            </Col>
            <Col width='50%'>
              <span>加载中</span>
            </Col>
          </Row>
        ) : (
          pager && pageDisplay && (
            <Page
              className={_xclass('page')}
              data={statePage}
              onSwitch={onSwitchHandler}
              type={pageType}
              SlotLoadMore={(): ReactElement => {
                if (SlotPage) {
                  return <SlotPage display={pageDisplay} />
                } else {
                  return (
                    <div className={_xclass('page-load-more')}>
                      {pageTrigger === 'scroll'
                        ? '上拉加载'
                        : '点击加载'
                      }
                    </div>
                  )
                }
              }}
            />
          )
        )
      }
    </div>
  )

  const loadAllEle = initItem.length > initDataLength && (
    <div className={_xclass('operation')} onClick={_loadAllHandler}>
      {SlotPage
        ? <SlotPage loadAll={hasLoadAll} />
        : hasLoadAll ? '收起全部' : '展开更多'
      }
    </div>
  )

  if (initItem.length !== preInitItemRef.current.length) {
    preInitItemRef.current = [...initItem]

    initListItem()
  }

  if (auto) {
    setStatePage(getPageData(initPage))
  } else {
    const preInitPage = preInitPageRef.current

    Object.keys(initPage).every((key) => {
      if (initPage[key as TPageEle] !== preInitPage[key as TPageEle]) {
        preInitPageRef.current = { ...initPage }
        const pageData = getPageData(initPage)
        setPageDisplay(pageData.current !== pageData.length)
        setStatePage(pageData)

        return false
      }

      return true
    })
  }

  useEffect(() => {
    // animate
    //   ? animateListItem((refMe.current as any).scrollTop)
    //   : getHeight()
  })

  useEffect(() => {
    getHeight()
  }, [stateItem])

  return (
    <div
      className={`${compClass()} ${className}`}
      onScroll={onScrollHandler}
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      ref={refMe}
      style={{
        ...style,
        height: props.height
      }}
    >
      {props.slotHeader}
      {stateItemEmpty
        ? (
          <p className={`${compConf.prefix}-css-text-center`}>{emptyHint}</p>
        ) : (
          <div className={_xclass('box')} ref={refBox}>
            {contentEle}
            {loadAll ? loadAllEle : operaterEle}
          </div>
        )
      }
      {pager
        && noMoreDataHint
        && statePage.current === statePage.length
        && statePage.length > 1
        && (
          <div className={_xclass('box-nomoredata')}>
            {noMoreDataHint}
          </div>
        )
      }
    </div>
  )
}

export default List
