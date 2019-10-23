/**
 * list 组件
 *
 * 重要：当为下拉加载更多功能开启时，不单止 initItem 要赋值，还要调用 update 方法
 *
 * @prop {boolean} auto - 根据传入的列表数据自动生成分页数据
 * @prop {boolean} animate - 是否有列表动画
 * @prop {number} height - 列表高度
 * @prop {string} theme - 主题
 * @prop {string} className
 * @prop {array} initItem - 列表数据
 * @prop {any} keyName - 列表数据作为 key 的参数名字
 * @prop {boolean} waterfall - 瀑布流数据
 *
 * @prop {number} initDataLength - 当 pageType 为 load 时，一开始展示的数据条数
 * @prop {boolean} loadAll - 当 pageType 为 more 时，启用加载更多的功能即一下全部加载，而不是分页式的加载更多
 * @prop {object} noMoreDataTip - 当 pageType 为 load 时，没有更多数据加载的提示文案，为空时不显示
 *
 * @prop {object} page - 分页数据（没传的话，默认将传的列表数据（item）作为分页数据）
 * @prop {boolean} pager - 启动分页
 * @prop {string} pageType - 默认为 num，可选 more
 * @prop {string} pageSize - 将列表数据（item）分为每页多少条数据
 * @prop {string} pageTrigger - 加载更多的触发模式（滚动到底部自动触发（默认）：scroll | 点击：click）
 *
 * @prop {object} slotHeader - 添加在列表头部的组件
 * @prop {number} slotHeight - slotHeader 的高度，作为滚动加载需要排除的高度
 * @prop {boolean} refresh - 页面下拉刷新的开关
 *
 * @event onClick - 点击按钮事件
 * @event onSwitch - 页面跳转事件
 * @event onScroll - 页面滚动事件
 *
 * @slot slot - 列表内容
 * @slot slotPage - 分页的内容分发
 */

import './List.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'
import { prop as eleProps } from '../../util/dom/prop'
import { uid } from '../../util/util'

import ListTransition from './ListTransition'
import Page from '../Page/Page'
import Loading from '../Loading/Loading'
import Row from '../Row/Row'
import Col from '../Col/Col'

import dsBridge from 'dsbridge'

const HEIGHT = 200
const _xclass = (className) => {
  return xclass('list', className)
}

// 存储还没执行过渡动画（没出现到用户视线）的列表数据
const addUIDToListItem = (listItem) => {
  listItem.forEach((item) => {
    if (!item) {
      return false
    }

    item.rcuid = uid()
  })

  return listItem
}

class List extends Component {
  constructor(props) {
    super(props)

    this._isMounted = false
    this.compName = 'list' // 组件名字
    this.$el = null // 组件的 dom
    this.scrolling = false // 是否正在滚动
    this.listHeight = 0 // 列表的高度
    this.listBoxHeight = 0 // 列表内容的高度
    this.componentFirstUpdate = true // 组件第一次更新
    this.noAnimateListItem = [] // 还没执行过渡动画（没出现到用户视线）的列表数据
    this.updated = false // 组件数据更新
    this.hasRefresh = dsBridge.hasNativeMethod('jsRefresh')
    this.targetScrollTop = 0 // 当前滚动条的高度

    this.isTouchStart = false // 正在触发 touchStart 事件
    this.touchStart = { // 触控的开始位置
      x: 0,
      y: 0
    }
    this.touchEnd = { // 触控的结束位置
      x: 0,
      y: 0
    }

    this._switchHandler = this._switchHandler.bind(this)
    this._scrollHandler = this._scrollHandler.bind(this)
    this._loadAllHandler = this._loadAllHandler.bind(this)

    const pageData = this._initPageData(props.page)
    const listItem = this._initListData({
      listItem: props.initItem,
      pageData,
      replace: true
    })
    const listItemEmpty = listItem.length === 0

    this.state = {
      pageData,
      hasData: !listItemEmpty,
      item: listItem,
      loadingDisplay: true,
      pageDisplay: pageData.length !== pageData.current,
      hasLoadAll: false // 是否已经打开全部了
    }
  }

  _compClass() {
    return _xclass([
      '',
      `type-${this.props.pageType}`
    ])
  }

  async _switchHandler() {
    const { pageData } = this.state

    if (pageData.length === pageData.current || !this.state.pageDisplay) {
      return false
    }

    if (this.props.auto) {
      if (this.props.loadAll) {
        // 加载全部
      }

      this._isMounted && this.setState({
        pageData: {
          ...pageData,
          current: pageData.current + 1
        }
      }, () => {
        const listItem = this._initListData({
          listItem: this.props.initItem
        })

        this._initList(listItem, this.state.pageData)
      })
    }

    this.props.onSwitch && this.props.onSwitch()
  }

  _scrollHandler(event) {
    const currentTarget = event.currentTarget
    const targetScrollTop = currentTarget.scrollTop
    this.targetScrollTop = targetScrollTop

    if (!this.scrolling) {
      window.requestAnimationFrame(() => {
        this.props.animate
          ? this._animateListItem(targetScrollTop)
          : this._getHeight()

        if (this.props.pageTrigger === 'scroll') {
          const flat = this.listBoxHeight - this.listHeight + this.props.slotHeight

          if (targetScrollTop < flat + 3 && targetScrollTop > flat - 3) {
            !this.state.loadingDisplay && this.props.pager && this._switchHandler()
          }
        }

        this.scrolling = false
      })

      this.scrolling = true
    }

    if (this.props.refresh && this.hasRefresh) {
      if (targetScrollTop === 0) {
        dsBridge.call('jsRefresh ', { isEnable: true })
      } else {
        dsBridge.call('jsRefresh ', { isEnable: false })
      }
    }

    this.props.onScroll && this.props.onScroll({
      scrollTop: targetScrollTop
    })
  }

  _loadAllHandler() {
    this.setState({
      hasLoadAll: !this.state.hasLoadAll
    }, () => {
      this.setState({
        item: this._initListData({ replace: true })
      })
    })
  }

  /**
     * 获得列表组件的相关数据
     */
  _getHeight() {
    this.listHeight = this.$el ? this.$el.clientHeight : 0
    this.listBoxHeight = this.refs.box ? this.refs.box.scrollHeight : 0
  }

  /**
     * 初始化列表数据
     *
     * @param {object} props - 组件的 props 值
     */
  _initListData({
    listItem = [],
    pageData = this.state.pageData,
    replace = false
  } = {}) {
    let item = []

    if (this.props.loadAll) {
      if (this.state) {
        item = this.state.hasLoadAll
          ? this.props.initItem.slice(0, this.props.initItem.length)
          : this.props.initItem.slice(0, this.props.initDataLength)
      } else {
        item = this.props.initItem.slice(0, this.props.initDataLength)
      }
    } else {
      if (this.props.auto) {
        let start = 0
        let end = 0

        if (pageData.current === 1) {
          start = 0
          end = this.props.initDataLength
            ? this.props.initDataLength
            : this.props.pageSize
        } else {
          start = this.props.initDataLength
            ? (pageData.current - 2) * this.props.pageSize + this.props.initDataLength
            : (pageData.current - 1) * this.props.pageSize
          end = start + this.props.pageSize
        }

        item = this.props.initItem.slice(start, end)
      } else {
        item = listItem
      }
    }

    item = addUIDToListItem(item)
    this.noAnimateListItem = this.noAnimateListItem.concat(item)

    if (replace) {
      return item
    }

    if (this.props.pageType === 'more') {
      return this.state.item.concat(item)
    } else {
      return item
    }
  }

  /**
     * 初始化分页相关数据
     */
  _initPageData(pageData) {
    if (this.props.auto) {
      const listLength = this.props.initItem.length
      const size = this.props.pageSize

      return {
        length: Math.ceil(listLength / size),
        size,
        total: listLength,
        current: 1
      }
    } else {
      return {
        ...pageData,
        size: pageData.size || this.props.pageSize
      }
    }
  }

  /**
     * 初始化列表
     *
     * @param {object} props - 组件的 props 值
     */
  _initList(listItem = [], pageData = {}) {
    // 如果是下拉加载时，第一页的数据小于分页长度时，不显示分页
    let pageDisplay = true
    if (this.props.pageType === 'more' && pageData.current === 1 && listItem.length < pageData.size) {
      pageDisplay = false
    }

    this._getHeight()

    this._isMounted && this.setState({
      item: listItem,
      hasData: listItem.length > 0,
      pageData,
      pageDisplay: pageData.length !== pageData.current && pageDisplay,
      loadingDisplay: false
    }, () => {
      this.props.animate
        ? this._animateListItem(this.refs.me.scrollTop)
        : this._getHeight()
    })
  }

  /**
     * 执行列表的动画效果
     *
     * @param {number} scrollTop - 列表内容的滚动高度
     */
  _animateListItem(scrollTop = 0) {
    const noAnimateListItem = this.noAnimateListItem.slice()
    const length = noAnimateListItem.length

    if (length === 0) {
      return false
    }

    const $ref = this.refs[`listEle${noAnimateListItem[0].rcuid}`]
    const props = eleProps($ref.$el)

    if (props.offsetTop > this.listHeight + scrollTop) {
      return false
    }

    const afterAnimate = async (index) => {
      if (index === length) {
        return false
      }

      const $ref = this.refs[`listEle${noAnimateListItem[index].rcuid}`]
      const props = eleProps($ref.$el)

      if (props.offsetTop < this.listHeight + scrollTop) {
        this.noAnimateListItem.shift()
        this.refs[`listEle${noAnimateListItem[index].rcuid}`].enter().then(() => {
          this._getHeight()
        })
        return afterAnimate(index + 1)
      }
    }

    return afterAnimate(0)
  }

  /**
     * 更新列表数据
     *
     * @param {promise, function} dataHandler - 通过 Promise 返回的列表数据, list 和 page
     */
  async update(dataHandler) {
    return new Promise((resolve, reject) => {
      this.setState({
        loadingDisplay: true
      }, async () => {
        try {
          const response = typeof dataHandler === 'function'
            ? await dataHandler()
            : dataHandler
          const listItem = this._initListData({
            listItem: response.list
          })

          const pageData = this._initPageData(response.page)

          resolve({
            list: listItem,
            page: pageData
          })
          this._initList(listItem, pageData)
          this.updated = true
        } catch (error) {
          console.warn(error)
        }
      })
    })
  }

  /**
     * 初始化列表组件(分页变成 第一页，列表数据还原)
     */
  init() {
    const pageData = {
      current: 1
    }

    this.updated = false
    const initPageData = this._initPageData(pageData)
    const listData = this._initListData({
      listItem: this.props.initItem,
      pageData: initPageData,
      replace: true
    })

    this.refs.me.scrollTo && this.refs.me.scrollTo(0, 0)

    return this._initList(listData, initPageData)
  }

  /*
    * 改变itemList内具体内容
    * */
  _handleChangeItem(index, data) {
    const { item } = this.state
    item.splice(index, 1, data)

    this.setState({
      item: [...item]
    })
  }

  _handlerTouchStart(event) {
    this.isTouchStart = true

    this.touchStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }

    if (this.hasRefresh && this.props.refresh && this.targetScrollTop === 0) {
      dsBridge.call('jsRefresh ', { isEnable: true })
    }
  }

  _handlerTouchMove(event) {
    if (!this.isTouchStart) {
      return false
    }

    this.touchEnd = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  _handlerTouchEnd() {
    this.isTouchStart = false
  }

  componentDidMount() {
    this._isMounted = true
    this._initList(this.state.item, this.state.pageData)
    this.$el = this.refs.me

    if (this.props.refresh && this.hasRefresh) {
      dsBridge.call('jsRefresh ', { isEnable: true })
    }
  }

  componentWillUnmount() {
    this._isMounted = false

    this.hasRefresh && dsBridge.call('jsRefresh ', { isEnable: false })
  }

  render() {
    const {
      loadingDisplay,
      pageDisplay,
      item: stateItem
    } = this.state

    const {
      pager,
      keyName,
      waterfall
    } = this.props

    const contentEle = waterfall
      ? (
        <Row wrap='wrap' justify='justify'>
          {stateItem.map((item, index) => {
            if (!item) {
              return null
            }

            return (
              <Col key={keyName ? item[keyName] : item.rcuid}>
                {this.props.slot
                  ? <this.props.slot
                    more={pageDisplay}
                    index={index + 1}
                    lastIndex={stateItem.length}
                    changeItem={this._handleChangeItem.bind(this, index)}
                    item={item} />
                  : item.text
                }
              </Col>
            )
          })}
        </Row>
      ) : (
        <div className={_xclass('content')}>
          {this.props.animate
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
                      {this.props.slot
                        ? <this.props.slot
                          more={pageDisplay}
                          index={index + 1}
                          lastIndex={stateItem.length}
                          changeItem={this._handleChangeItem.bind(this, index)}
                          item={item} />
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
                    ref={`listEle${item.rcuid}`}
                  >
                    <Col span={12}>
                      {this.props.slot
                        ? <this.props.slot
                          more={pageDisplay}
                          index={index + 1}
                          lastIndex={stateItem.length}
                          changeItem={this._handleChangeItem.bind(this, index)}
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
      <div ref='operation' className={_xclass('operation')}>
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
              data={this.state.pageData}
              onSwitch={this._switchHandler}
              type='more'
              ref='pager'
              slotLoadMore={() => {
                if (this.props.slotPage) {
                  return <this.props.slotPage display={pageDisplay} />
                } else {
                  return (
                    <div className={_xclass('page-load-more')}>
                      {this.props.pageTrigger === 'scroll'
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

    const loadAllEle = this.props.initItem.length > this.props.initDataLength && (
      <div className={_xclass('operation')} onClick={this._loadAllHandler}>
        {this.props.slotPage
          ? <this.props.slotPage loadAll={this.state.hasLoadAll} />
          : this.state.hasLoadAll ? '收起全部' : '展开更多'
        }
      </div>
    )

    return (
      <div
        className={`${this._compClass()} ${this.props.className}`}
        onScroll={this._scrollHandler}
        onTouchStart={(event) => this._handlerTouchStart(event)}
        onTouchMove={(event) => this._handlerTouchMove(event)}
        onTouchEnd={(event) => this._handlerTouchEnd(event)}
        ref='me'
        style={this.props.style}
      >
        {this.props.slotHeader}
        {this.state.hasData
          ? (
            <div className={_xclass('box')} ref='box'>
              {contentEle}
              {this.props.loadAll ? loadAllEle : operaterEle}
            </div>
          ) : (
            <p className={`${compConf.prefix}-css-text-center`}>{this.props.emptyHint}</p>
          )
        }
        {pager
                    && this.props.noMoreDataTip
                    && this.state.pageData.current === this.state.pageData.length
                    && this.state.pageData.length > 1
                    && (
                      <div className={_xclass('box-nomoredata')}>
                        {this.props.noMoreDataTip}
                      </div>
                    )
        }
      </div>
    )
  }
}

List.defaultProps = {
  auto: false,
  animate: false,
  className: '',
  initItem: [],
  loadAll: false,
  noMoreDataTip: '已经到底啦 ~',
  page: {},
  pager: false,
  pageType: 'num',
  pageTrigger: 'scroll',
  pageSize: 20,
  style: {},
  emptyHint: '暂无数据',
  slotHeight: 0,
  theme: 'primary',
  refresh: false
}

List.propTypes = {
  auto: PropTypes.bool,
  refresh: PropTypes.bool,
  animate: PropTypes.bool,
  className: PropTypes.string,
  loadAll: PropTypes.bool,
  initItem: PropTypes.array,
  initDataLength: PropTypes.number,
  slotHeight: PropTypes.number,
  noMoreDataTip: PropTypes.string,
  page: PropTypes.object,
  pager: PropTypes.bool,
  pageSize: PropTypes.number,
  pageType: PropTypes.string,
  pageTrigger: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.string,
  emptyHint: PropTypes.string
}

export default List
