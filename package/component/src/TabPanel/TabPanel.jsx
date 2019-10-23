/**
 * tabPanel 组件
 *
 * @prop {string} className
 * @prop {string} theme - 主题
 * @prop {string} initItem - tabPanel 数据
 *                              component - 面板组件
 *                              value - 选项卡的值
 *                              text - 选项卡的文字表示
 * @prop {string} initVal - 初始化 value
 *
 * @event onClick - 点击选项卡事件
 */

import './TabPanel.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Tab from '../Tab/Tab'
import { xclass } from '../../util/comp'
import { search as urlSearch } from '../../util/url'

const _xclass = (className) => {
  return xclass('tab-panel', className)
}

class TabPanel extends Component {
  constructor(props) {
    super(props)

    this.clickTabHandler = this.clickTabHandler.bind(this)

    this.compName = 'TabPanel'

    let initVal = props.initItem[0].value
    const searchUrlTabPanel = this._switchTabByUrlSearch()

    this.state = {
      item: props.initItem
    }

    if (props.initVal !== undefined) {
      initVal = props.initVal
    } else if (searchUrlTabPanel !== undefined) {
      const defaultPageCompIndex = this._getIndexByValue(searchUrlTabPanel)

      if (defaultPageCompIndex !== false) {
        initVal = searchUrlTabPanel
      }
    }

    this.state = Object.assign(this.state, {
      value: initVal
    })
  }

  _tabPanelEleClass(value) {
    const className = ['']

    if (value === this.state.value) {
      className.push('selected')
    }

    return xclass('tabPanel-ele', className) + ' ' + this.props.className
  }

  /**
     * 根据 url 地址上的 search 的 tabPanel 值切换选项卡
     */
  _switchTabByUrlSearch() {
    return urlSearch(window.location.search).tabPanel
  }

  /**
     * 根据 value 值返回 item 数组对应的 index 值
     * @param {*} value
     */
  _getIndexByValue(value) {
    let itemIndex = false
    const itemArray = this.state.item

    if (!Array.isArray(itemArray) || itemArray.length === 0) {
      return false
    }

    itemArray.every((item, index) => {
      if (item.value === value) {
        itemIndex = index

        return false
      }

      return true
    })

    return itemIndex
  }

  /**
     * 点击选项卡
     *
     * @param {*} event
     * @param {*} value
     */
  clickTabHandler({ value }) {
    this.setState({
      value
    })
  }

  componentWillMount() {
    this._switchTabByUrlSearch()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.initVal,
      item: nextProps.initItem.slice()
    })
  }

  render() {
    return (
      <div className={_xclass()}>
        <Tab
          initItem={this.state.item}
          initVal={this.state.value}
          onClick={this.clickTabHandler}
        />

        <div className={_xclass('panel-stage')}>
          {this.state.item[this._getIndexByValue(this.state.value)].component}
        </div>
      </div>
    )
  }
}

TabPanel.defaultProps = {
  className: '',
  theme: ''
}

TabPanel.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  initItem: PropTypes.array.isRequired
}

export default TabPanel
