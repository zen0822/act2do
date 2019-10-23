/**
 * pop 弹出层组件
 *
 * @prop {string} className
 * @prop {string} theme - 主题
 * @prop {string} direction - 弹出方向 (west | south | north | east)
 * @prop {string} display - 组件显示状态
 * @prop {string} position - 信息停留的位置 (center | top | bottom | left | right)
 * @prop {boolean} part - 在一个父类元素弹出，默认为否即在当前文档弹窗
 * @prop {string} speed - 弹出速度
 * @prop {string} kind - (slide | fade)（默认是 slide），后续加上其他动画效果例如：bounce
 *
 * @event afterEnter - 显示之后的钩子函数
 * @event afterLeave - 隐藏之后的钩子函数
 */

import './Pop.scss'
import './Pop.m.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'

import { xclass, optXclass } from '../../util/comp'
import { hasScroller } from '../../util/dom'
import { prop as elementProp } from '../../util/dom/prop'

import compConf from '../../config.json'
import SlideTransition from 'reactComp/transition/Slide'
import FadeTransition from 'reactComp/transition/Fade'

const scrollBarWidth = 20

class Pop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      detail: {
        top: 0,
        left: 0
      },
      ...this._initData(props)
    }
  }

  _initData(props) {
    let popDirection = props.direction

    if (props.position !== 'center') {
      switch (props.position) {
        case 'bottom':
          popDirection = 'north'
          break
        case 'top':
          popDirection = 'south'
          break
        case 'right':
          popDirection = 'west'
          break
        case 'left':
          popDirection = 'east'
          break
        default:
          popDirection = 'south'
          break
      }
    }

    return {
      direction: popDirection
    }
  }

  _compClass(className) {
    return optXclass('pop', {
      '': true,
      [`position-${this.props.position}`]: true,
      [`speed-${this.props.speed}`]: true,
      'part': this.props.part
    }) + ' ' + this.props.className
  }

  /**
     * 初始化弹出层
     */
  _initPop() {
    const ele = elementProp(this.refs.slide.$el)
    const parentWidth = window.innerWidth
    const parentHeight = window.innerHeight
    const height = ele.offsetHeight
    const width = ele.offsetWidth
    let slideOffset = 0
    let popStyle = {}

    if (this.props.position !== 'center') {
      switch (this.props.position) {
        case 'bottom':
          popStyle = {
            top: hasScroller(undefined, 'horizontal') ?
              parentHeight - height - scrollBarWidth :
              parentHeight - height,
            left: (parentWidth - width) / 2
          }

          break
        case 'top':
          popStyle = {
            top: 0,
            left: (parentWidth - width) / 2
          }

          break
        case 'right':
          popStyle = {
            top: (parentHeight - height) / 2,
            left: parentWidth - width
          }

          break
        case 'left':
          popStyle = {
            top: (parentHeight - height) / 2,
            left: 0
          }

          break
        default:
          popStyle = {
            top: 0,
            left: (parentWidth - width) / 2
          }
      }

      slideOffset = 0
    } else {
      const top = (parentHeight - height) / 2
      const left = (parentWidth - width) / 2

      switch (this.state.direction) {
        case 'north':
        case 'south':
          slideOffset = top

          break
        case 'west':
        case 'east':
          slideOffset = left

          break
        default:
          slideOffset = top
      }

      popStyle = {
        top,
        left
      }
    }

    return {
      slideOffset,
      detail: popStyle
    }
  }

  /**
    * 计算弹出层的位置
    */
  computePosition() {
    if (!this.refs.slide) {
      return false
    }

    this.setState({
      ...this._initPop()
    })
  }

  /**
     * 进来
     */
  enter() {
    this.computePosition()

    return new Promise(async (resolve, reject) => {
      try {
        await this.refs.slide.enter()

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
     * 离开
     */
  leave() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.refs.slide.leave()

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this._initData(nextProps)
    })
  }

  render() {
    return (
      this.props.kind === 'slide'
        ? (
          <SlideTransition
            className={this._compClass()}
            offset={this.state.slideOffset}
            direction={this.state.direction}
            speed='slow'
            style={{
              top: this.state.detail.top + 'px',
              left: this.state.detail.left + 'px'
            }}
            afterEnter={this.props.afterEnter}
            afterLeave={this.props.afterLeave}
            ref='slide'
          >
            {this.props.children}
          </SlideTransition>
        ) : (
          <FadeTransition
            className={this._compClass()}
            offset={this.state.slideOffset}
            direction={this.state.direction}
            speed='slow'
            style={{
              top: this.state.detail.top + 'px',
              left: this.state.detail.left + 'px'
            }}
            afterEnter={this.props.afterEnter}
            afterLeave={this.props.afterLeave}
            ref='slide'
          >
            {this.props.children}
          </FadeTransition>
        )
    )
  }
}

Pop.defaultProps = {
  className: '',
  speed: 'normal',
  direction: 'south',
  position: 'top',
  display: false,
  kind: 'fade'
}

Pop.propTypes = {
  direction: PropTypes.string,
  speed: PropTypes.string,
  theme: PropTypes.string,
  className: PropTypes.string,
  position: PropTypes.string,
  part: PropTypes.bool,
  kind: PropTypes.string
}

export default Pop
