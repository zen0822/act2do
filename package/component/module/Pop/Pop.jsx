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

import { optXclass } from '../../util/comp'
import { hasScroller } from '../../util/dom'
import { prop as elementProp } from '../../util/dom/prop'

import SlideTransition from '../../transition/Slide'
import FadeTransition from '../..//transition/Fade'

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

  _compClass() {
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
    const ele = elementProp(this.slideRef.$el)
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
    if (!this.slideRef) {
      return false
    }

    this.setState({
      ...this._initPop()
    })
  }

  /**
   * 进来
   */
  async enter() {
    this.computePosition()

    try {
      await this.slideRef.enter()
    } catch (error) {
      console.warn(error)
    }
  }

  /**
   * 离开
   */
  async leave() {
    try {
      await this.slideRef.leave()
    } catch (error) {
      console.warn(error)
    }
  }

  /**
   * 设置位置
   * @param {*} top
   * @param {*} left
   */
  setPosition(top, left) {
    const { detail } = this.state

    if (top) {
      this.setState({
        detail: {
          ...detail,
          top
        }
      })
    }

    if (left) {
      this.setState({
        detail: {
          ...detail,
          left
        }
      })
    }
  }

  componentDidMount() {
    this.props.display ? this.enter() : this.leave()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      ...this._initData(nextProps)
    }, () => {
      nextProps.display ? this.enter() : this.leave()
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
            ref={(ref) => (this.slideRef = ref)}
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
            ref={(ref) => (this.slideRef = ref)}
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
