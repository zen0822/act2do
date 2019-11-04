/**
 * list 组件(当前只支持移动端)
 *
 * 重要：当为下拉加载更多功能开启时，不单止 initItem 要赋值，还要调用 update 方法
 *
 * @prop {array} item - 列表数据
 * @prop {any} keyName - 列表数据作为 key 的参数名字
 * @prop {number} initDataLength - 当 pageType 为 load 时，一开始展示的数据条数
 * @prop {object} noMoreDataTip - 当 pageType 为 load 时，没有更多数据加载的提示文案，为空时不显示
 *
 * @prop {boolean} auto - 根据传入的列表数据自动生成分页数据
 * @prop {boolean} loadAll - 当 pageType 为 more 时，启用加载更多的功能即一下全部加载，而不是分页式的加载更多
 * @prop {object} page - 分页数据（没传的话，默认将传的列表数据（item）作为分页数据）
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
 * @slot slotHeader - 添加在列表头部的组件
 * @slot slot - 列表内容
 * @slot slotPage - 分页的内容分发
 */

import './List.scss'

import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  TouchEvent,
  UIEvent
} from 'react'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'
import { prop as eleProps } from '../../util/dom/prop'
import { uid } from '../../util/util'
import { useIsMounted } from '../../hook/hook'

import ListTransition from './ListTransition'
import Page from '../Page/Page'
import Loading from '../Loading/Loading'
import Row from '../Row/Row'
import Col from '../Col/Col'

type TypePage = {
  current: number
  length: number
  size: number
  total: number
}

type TypeItem = Array<Record<string, any>>

const _xclass = (className: string | Array<string>): string => {
  return xclass('list', className)
}

// 存储还没执行过渡动画（没出现到用户视线）的列表数据
const addUIDToListItem = (listItem: TypeItem): TypeItem => {
  const listItemTemp = [...listItem]

  listItemTemp.forEach((item) => {
    if (!item) {
      return false
    }

    item.rcuid = uid()
  })

  return listItemTemp
}

type TypeItemProps = {
  auto: boolean
  animate: boolean
  className: string
  emptyHint: string
  item: TypeItem
  initDataLength: number
  keyName: string,
  loadAll: boolean
  noMoreDataTip: string
  onChange: (list: TypeItem, page: TypePage) => void
  onScroll: (scrollTop: number) => void
  onSwitch: Function
  page: TypePage
  pager: boolean
  pageSize: number
  pageType: string
  pageTrigger: string
  refresh: boolean
  slot: React.FC
  slotHeader: React.FC
  slotHeight: number
  slotPage: string
  style: { [key: string]: any }
  theme: string
  waterfall: boolean
}

const List: React.FC<TypeItemProps> = ({
  auto = false,
  animate = false,
  className = '',
  item = [],
  initDataLength,
  keyName,
  loadAll = false,
  noMoreDataTip = '已经到底啦 ~',
  onChange,
  onScroll,
  onSwitch,
  page = {},
  pager = false,
  pageType = 'num',
  pageTrigger = 'scroll',
  pageSize = 20,
  emptyHint = '暂无数据',
  style = {},
  slot,
  slotHeight,
  slotPage,
  waterfall = false,
  ...props
}): React.ReactElement => {
  const refIsMounted = useIsMounted()

  const refMe = useRef(null) // 组件的 dom
  const refBox = useRef(null) // 组件的 dom
  const refScrolling = useRef(false) // 是否正在滚动
  const refNoAnimateListItem = useRef<TypeItem>([]) // 还没执行过渡动画（没出现到用户视线）的列表数据
  const refTargetScrollTop = useRef(0) // 当前滚动条的高度

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

  const [loadingDisplay, setLoadingDisplay] = useState(true)
  const [hasLoadAll, setHasLoadAll] = useState(true)

  function compClass(): string {
    return _xclass([
      '',
      `type-${pageType}`
    ])
  }

  /**
     * 初始化分页相关数据
     */
  function initPageData(pageData: TypePage): TypePage {
    if (auto) {
      const listLength = item.length
      const size = pageSize

      return {
        length: Math.ceil(listLength / size),
        size,
        total: listLength,
        current: 1
      }
    } else {
      return {
        ...pageData,
        size: pageData.size || pageSize
      }
    }
  }

  const [statePage, setStatePage] = useState(initPageData(page as TypePage))
  const [pageDisplay, setPageDisplay] = useState(statePage.length !== statePage.current)

  /**
     * 初始化列表数据
     *
     * @param {object} props - 组件的 props 值
     */
  function initListData({
    listItem,
    pageData,
    replace = false
  }: {
    listItem: TypeItem
    pageData: TypePage
    replace?: boolean
  }): TypeItem {
    let itemTemp = []

    if (loadAll) {
      itemTemp = hasLoadAll
        ? item.slice(0, item.length)
        : item.slice(0, initDataLength)
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

        itemTemp = item.slice(start, end)
      } else {
        itemTemp = [...listItem]
      }
    }

    itemTemp = addUIDToListItem(item)
    refNoAnimateListItem.current = [...refNoAnimateListItem.current, ...item]

    if (replace) {
      return itemTemp
    }

    if (pageType === 'more') {
      return itemTemp.concat(item)
    } else {
      return item
    }
  }
  const [stateItem, setStateItem] = useState(initListData({
    listItem: item,
    pageData: statePage,
    replace: true
  }))
  const stateItemEmpty = stateItem.length === 0

  /**
     * 获得列表组件的相关数据
     */
  function getHeight(): void {
    refListHeight.current = (refMe && refMe.current) ? refMe.current.clientHeight : 0
    refListBoxHeight.current = (refBox && refBox.current) ? refBox.current.scrollHeight : 0
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
   * 初始化列表
   *
   * @param {object} props - 组件的 props 值
   */
  function initList(listItem: TypeItem, pageData: TypePage): void {
    // 如果是下拉加载时，第一页的数据小于分页长度时，不显示分页
    let pageDisplay = true

    if (pageType === 'more' && pageData.current === 1 && listItem.length < pageData.size) {
      pageDisplay = false
    }

    setStatePage(pageData)
    setStateItem(listItem)
    setPageDisplay(pageData.length !== pageData.current && pageDisplay)
    setLoadingDisplay(false)

    animate
      ? animateListItem((refMe.current as any).scrollTop)
      : getHeight()
  }

  function onSwitchHandler(): void | boolean {
    if (statePage.length === statePage.current || !pageDisplay) {
      return false
    }

    if (auto) {
      if (loadAll) {
        // 加载全部
      }

      const pageData = {
        ...statePage,
        current: statePage.current + 1
      }

      setStatePage(pageData)

      const listItem = initListData({
        listItem: item,
        pageData
      })

      initList(listItem, statePage)
    }

    onSwitch && onSwitch(statePage)
  }

  function onScrollHandler(event: UIEvent): void {
    const currentTarget = event.currentTarget
    const targetScrollTop = currentTarget.scrollTop
    refTargetScrollTop.current = targetScrollTop

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

  /**
   * 改变itemList内具体内容
   */
  function changeItemHandler(index: number, data?: any): void {
    const itemTemp = [...stateItem]
    itemTemp.splice(index, 1, data)

    setStateItem(itemTemp)
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

  useEffect(() => {
    // _initList(item, statePage)
  })

  const contentEle = waterfall
    ? (
      <Row>
        {stateItem.map((item, index) => {
          if (!item) {
            return null
          }

          return (
            <Col key={keyName ? item[keyName] : item.rcuid}>
              {slot
                ? <slot
                  more={pageDisplay}
                  index={index + 1}
                  lastIndex={stateItem.length}
                  changeItem={(): void => changeItemHandler(index)}
                  item={item}
                />
                : item.text
              }
            </Col>
          )
        })}
      </Row>
    ) : (
      <div className={_xclass('content')}>
        {animate
          ? (
            stateItem.map((item, index) =>
              <ListTransition
                className={_xclass('content-ele')}
                origin='50% 0'
                ref={`listEle${item.rcuid}`}
                key={index.toString()}
              >
                <Row>
                  <Col span={12}>
                    {slot
                      ? <slot
                        more={pageDisplay}
                        index={index + 1}
                        lastIndex={stateItem.length}
                        changeItem={(): void => changeItemHandler(index)}
                        item={item}
                      />
                      : item.text
                    }
                  </Col>
                </Row>
              </ListTransition>
            )
          ) : (
            stateItem.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <Row
                  className={_xclass('content-ele')}
                  key={keyName ? item[keyName] : item.rcuid}
                // ref={`listEle${item.rcuid}`}
                >
                  <Col span={12}>
                    {slot
                      ? <slot
                        more={pageDisplay}
                        index={index + 1}
                        lastIndex={stateItem.length}
                        changeItem={(): void => changeItemHandler(index)}
                        item={item} />
                      : item.text
                    }
                  </Col>
                </Row>
              )
            })
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
          pager && pageDisplay && <Page
            className={_xclass('page')}
            data={statePage}
            onSwitch={onSwitchHandler}
            type='more'
            slotLoadMore={(): ReactElement => {
              if (slotPage) {
                return <slotPage display={pageDisplay} />
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
      }
    </div>
  )

  const loadAllEle = item.length > initDataLength && (
    <div className={_xclass('operation')} onClick={_loadAllHandler}>
      {slotPage
        ? <slotPage loadAll={hasLoadAll} />
        : hasLoadAll ? '收起全部' : '展开更多'
      }
    </div>
  )

  return (
    <div
      className={`${compClass()} ${className}`}
      onScroll={onScrollHandler}
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      ref={refMe}
      style={style}
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
        && noMoreDataTip
        && statePage.current === statePage.length
        && statePage.length > 1
        && (
          <div className={_xclass('box-nomoredata')}>
            {noMoreDataTip}
          </div>
        )
      }
    </div>
  )
}

export default List
