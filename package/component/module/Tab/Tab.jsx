/**
 * tab 组件
 *
 * @prop {string} className
 * @prop {string} theme - 主题
 * @prop {string} initItem - tab 数据
 * @prop {string} initVal - 初始化 value
 *
 * @event onClick - 点击选项卡事件
 */

import './Tab.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import Row from '../Row/Row'
import Col from '../Col/Col'
import { xclass } from '../../util/comp'

class Tab extends Component {
  constructor(props) {
    super(props)

    this.clickHandler = this.clickHandler.bind(this)

    this.state = {
      item: props.initItem,
      value: props.initVal ? props.initVal : props.initItem[0].value
    }
  }

  _tabEleClass(value) {
    const className = ['']

    if (value === this.state.value) {
      className.push('selected')
    }

    return xclass('tab-ele', className) + ' ' + this.props.className
  }

  /**
     * 点击选项卡
     *
     * @param {*} event
     * @param {*} value
     */
  clickHandler(event, value) {
    this.setState({
      value
    })

    this.props.onClick && this.props.onClick({
      value
    })
  }

  render() {
    const listItems = this.state.item.map((item, index) =>
      <Col key={index.toString()}>
        <div
          onClick={(event) => this.clickHandler(event, item.value)}
          className={this._tabEleClass(item.value)}
        >
          {item.component ? item.component : item.text}
        </div>
      </Col>
    )

    return (
      <div className={`${compConf.prefix}-tab`}>
        <Row justify={'justify'}>
          {listItems}
        </Row>
      </div>
    )
  }
}

Tab.defaultProps = {
  className: '',
  theme: ''
}

Tab.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  initItem: PropTypes.array.isRequired
}

export default Tab
