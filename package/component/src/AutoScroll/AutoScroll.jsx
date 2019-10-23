/**
 * AutoScroll 组件
 *
 * @prop {string} className
 * @prop {array} item - 初始化滚动数组 [{text: 'example'}]
 * @prop {array} speed - 速度（slow | normal | fast)
 * @prop {object} style - 样式
 * @prop {string} theme - 主题

 * @slot - 滚动内容
 */

import './AutoScroll.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { xclass } from '../../util/comp'
import Row from '../Row/Row'
import Col from '../Col/Col'

const _xclass = (className) => {
  return xclass.call(this, 'auto-scroll', className)
}

class AutoScroll extends Component {
  constructor(props) {
    super(props)

    this.compName = 'autoScroll' // 组件名字
    this.compHeight = 0 // 组件高度
    this.listTop = 0 // 滚动列表的高度
    this.appendListTop = 0 // 过渡滚动列表的高度
    this.intervalTime = this.switchSpeed(props.speed)

    this.state = {
      item: props.item,
      nextItem: []
    }
  }

  switchSpeed(speed) {
    switch (speed) {
      case 'slow':
        return 300
      case 'normal':
        return 150
      case 'fast':
        return 100
      default:
        return 150
    }
  }

  _initComp() {
    this.compHeight = this.refs.me.offsetHeight
    this.listHeight = this.refs.list.$el.offsetHeight
    this.listEleHeight = this.refs.list.$el.firstChild.offsetHeight
    this.appendListTop = this.listHeight
    this.showListEleNum = Math.ceil(this.compHeight / this.listEleHeight)
    this.appendListHeight = this.showListEleNum * this.listEleHeight

    this.setState({
      nextItem: this.state.item.slice(0, this.showListEleNum)
    })

    this.start()
  }

  start() {
    this.interval = setInterval(() => {
      if (this.listTop <= -this.listHeight) {
        this.listTop = this.appendListHeight
      }

      if (this.appendListTop <= -this.appendListHeight) {
        this.appendListTop = this.listHeight
      }

      this.refs.list.$el.style.top = `${--this.listTop}px`
      this.refs.appendList.$el.style.top = `${--this.appendListTop}px`
    }, this.intervalTime)
  }

  stop() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    if (this.props.item.length !== 0) {
      this._initComp()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      item: nextProps.item
    })
  }

  componentDidUpdate() {
    if (this.props.item.length !== 0 && this.listHeight !== this.refs.list.$el.offsetHeight) {
      this._initComp()
    }
  }

  render() {
    return (
      <div
        ref='me'
        className={`${_xclass()} ${this.props.className}`}
        style={this.props.style}
      >
        <Row ref='list' className={_xclass('list')}>
          {this.state.item.map((item, index) => {
            return (
              <Col span={12} key={index.toString()}>
                {this.props.slot
                  ? <this.props.slot item={item} />
                  : item.text
                }
              </Col>
            )
          })}
        </Row>
        <Row ref='appendList' className={_xclass('list')}>
          {this.state.nextItem.map((item, index) => {
            return (
              <Col span={12} key={index.toString()}>
                {this.props.slot
                  ? <this.props.slot item={item} />
                  : item.text
                }
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}

AutoScroll.defaultProps = {
  className: '',
  item: [],
  style: {},
  theme: ''
}

AutoScroll.propTypes = {
  className: PropTypes.string,
  item: PropTypes.array,
  style: PropTypes.object,
  theme: PropTypes.string
}

export default AutoScroll
