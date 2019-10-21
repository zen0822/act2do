/**
 * Slideshow 组件
 *
 * @prop {string} className
 * @prop {object} style - 样式
 * @prop {array} item - 幻灯片内容（react 组件格式）
 * @prop {string} speed - 速度（slow | normal | fast)
 * @prop {string} stopSpeed - 轮播时的停留速度（slow | normal | fast)
 * @prop {boolean} carousel - 幻灯片跑马灯效果播放
 * @prop {boolean} auto - 自动播放，要配合 carousel 为 true 才会生效
 * @prop {number} width - 幻灯片宽度
 * @prop {number} height - 幻灯片高度
 * @prop {string} page - 分页类型 (num | spot | rail | none),
 *                       默认是 num 数字分页，spot 的点点分页
 *                       rail 横条样式

 * @slot - 滚动内容
 */

import './Slideshow.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { xclass, optXclass } from '../../util/comp'
import Row from '../Row/Row'
import Col from '../Col/Col'

const compPrefix = 'slideshow'

const _xclass = (className) => {
    return xclass.call(this, compPrefix, className)
}

class Slideshow extends Component {
    constructor(props) {
        super(props)

        this.compName = 'slideshow' // 组件名字
        this.intervalCarousel = null // 轮播定时器
        this.switchTime = this.getSwitchTime(this.props.speed)
        this.stopTime = this.getStopTime(this.props.stopSpeed)
        this._isMounted = false // 组件是否在安装状态

        this.isTouchStart = false // 正在触发 touchStart 事件
        this.touchStart = { // 触控的开始位置
            x: 0,
            y: 0
        }
        this.touchEnd = { // 触控的结束位置
            x: 0,
            y: 0
        }

        this.state = {
            item: [], // 幻灯片元素的属性
            currentIndex: 1, // 当前播放的页数
            totalIndex: this.props.item.length
        }
    }

    _initComp(total = this.state.totalIndex, addActiveClass = true) {
        let itemHub = []

        for (let i = 0, len = total; i < len; i++) {
            if (i === this.state.currentIndex - 1) {
                let classNameOpt = {}

                if (addActiveClass) {
                    classNameOpt = {
                        active: true
                    }
                }

                itemHub.push({
                    className: this._setEleClass({
                        active: true
                    })
                })
            } else {
                itemHub.push({
                    className: this._setEleClass()
                })
            }
        }

        this.setState({
            item: itemHub
        })
    }

    _setEleClass({
        ele = true,
        active = false,
        left = false,
        right = false,
        pre = false,
        next = false
    } = {}) {
        return optXclass(compPrefix, {
            'ele': ele,
            'ele-active': active,
            'ele-left': left,
            'ele-right': right,
            'ele-pre': pre,
            'ele-next': next
        })
    }

    _handlerTouchStart(event) {
        this.isTouchStart = true

        this.touchStart = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
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

        let xDistance = this.touchEnd.x - this.touchStart.x

        // 滚动区域正方向移动
        if (xDistance < 0) {
            this.next()
        } else {
            this.pre()
        }
    }

    getSwitchTime(speed) {
        switch (speed) {
            case 'fast':
                return 500
            case 'normal':
                return 1000
            case 'slow':
                return 1500
            default:
                return 500
        }
    }

    getStopTime(stopSpeed) {
        switch (stopSpeed) {
            case 'slow':
                return 10000
            case 'normal':
                return 7000
            case 'fast':
                return 4000
            default:
                return 7000
        }
    }

    /**
     * 处理幻灯片的播放
     *
     * @param {Number} index - 切换到指定的页面
     */
    play(index) {
        if (index === undefined) {
            this.next()
        } else if (index - this.state.currentIndex > 0) {
            this.next(index)
        } else {
            this.pre(index)
        }
    }

    /**
     * 开始自动轮播
     */
    start() {
        if (this.intervalCarousel) {
            return false
        }

        if (!this.props.auto || !this.props.carousel || this.props.item.length <= 1) {
            return false
        }

        this.stop()

        this.intervalCarousel = setInterval(() => {
            this._isMounted && this.play()
        }, this.stopTime)
    }

    /**
     * 停止轮播
     */
    stop() {
        if (!this.intervalCarousel) {
            return false
        }

        if (!this.props.auto || !this.props.carousel || this.props.item.length <= 1) {
            return false
        }

        clearInterval(this.intervalCarousel)

        this.intervalCarousel = null
    }

    /**
     * 上一页幻灯片
     *
     * @param {Number} index - 退后到指定的页面
     */
    pre(index) {
        if (this.props.item.length <= 1 || (!this.props.carousel && this.state.currentIndex === 1)) {
            return false
        }

        if (this.playing) {
            return false
        }

        this.playing = true

        setTimeout(() => {
            this.playing = false
        }, this.switchTime)

        let currentItemIndex = this.state.currentIndex
        let preItemIndex = index === undefined
            ? currentItemIndex === 1 ? this.state.totalIndex : currentItemIndex - 1
            : index
        let item = this.state.item

        item[currentItemIndex - 1].className = this._setEleClass({
            active: true
        })

        item[preItemIndex - 1].className = this._setEleClass({
            pre: true
        })

        this._isMounted && this.setState({
            item: item
        }, () => {
            // HACK: reflow
            let height = this.refs.me.offsetHeight

            item[currentItemIndex - 1].className = this._setEleClass({
                right: true,
                active: true
            })

            item[preItemIndex - 1].className = this._setEleClass({
                right: true,
                pre: true
            })

            this._isMounted && this.setState({
                item: item
            }, () => {
                setTimeout(() => {
                    // HACK: reflow
                    let height = this.refs.me.offsetHeight
                    item[currentItemIndex - 1].className = this._setEleClass()

                    item[preItemIndex - 1].className = this._setEleClass({
                        active: true
                    })

                    this.setState({
                        item: item,
                        currentIndex: preItemIndex
                    })
                }, this.switchTime)
            })
        })
    }

    /**
     * 下一页幻灯片
     *
     * @param {Number} index - 前进到指定的页面
     */
    next(index) {
        if (this.props.item.length <= 1 || (!this.props.carousel && this.state.currentIndex === this.state.totalIndex)) {
            return false
        }

        if (this.playing) {
            return false
        }

        this.playing = true

        setTimeout(() => {
            this.playing = false
        }, this.switchTime)

        let currentItemIndex = this.state.currentIndex
        let nextItemIndex = index === undefined
            ? currentItemIndex === this.state.totalIndex ? 1 : currentItemIndex + 1
            : index
        let item = this.state.item

        item[currentItemIndex - 1].className = this._setEleClass({
            active: true
        })

        item[nextItemIndex - 1].className = this._setEleClass({
            next: true
        })

        this._isMounted && this.setState({
            item: item
        }, () => {
            // HACK: reflow
            let height = this.refs.me.offsetHeight

            item[currentItemIndex - 1].className = this._setEleClass({
                left: true,
                active: true
            })

            item[nextItemIndex - 1].className = this._setEleClass({
                left: true,
                next: true
            })

            this._isMounted && this.setState({
                item: item
            }, () => {
                setTimeout(() => {
                    if (!this._isMounted) {
                        return false
                    }

                    // HACK: reflow
                    let height = this.refs.me.offsetHeight
                    item[currentItemIndex - 1].className = this._setEleClass()

                    item[nextItemIndex - 1].className = this._setEleClass({
                        active: true
                    })

                    this.setState({
                        item: item,
                        currentIndex: nextItemIndex
                    })
                }, this.switchTime)
            })
        })
    }

    componentWillMount() {
        this._isMounted = true

        if (this.state.totalIndex > 0) {
            this._initComp()
        }

        this.start()
    }

    componentWillReceiveProps(nextProps) {
        this.switchTime = this.getSwitchTime(nextProps.speed)
        this.stopTime = this.getStopTime(nextProps.stopSpeed)


        if (nextProps.item.length !== this.state.item.length) {
            this.setState({
                totalIndex: nextProps.item.length
            })

            if (nextProps.item.length > 0) {
                this._initComp(nextProps.item.length, false)
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false

        this.stop()
    }

    componentDidUpdate(prevProps) {
        // TODO: 待优化成对比里面的图片地址
        if (prevProps.item.length !== this.state.item.length) {
            this.start()
        }
    }

    render() {
        let carouselHeadEle = null
        let paginationEle = null
        const { page: pageType } = this.props

        if (pageType !== 'none') {
            switch (pageType) {
                case 'num':
                    paginationEle = (
                        <div className={_xclass('pagination-num')}>
                            {this.state.currentIndex} / {this.state.totalIndex}
                        </div>
                    )
                    break
                case 'spot':
                    paginationEle = (
                        <Row
                            wrap='nowrap'
                            className={_xclass('pagination-spot')}
                        >
                            {this.props.item.map((item, index) => (
                                <Col
                                    className={`${_xclass('pagination-spot-ele')} ${index + 1 === this.state.currentIndex ? _xclass('pagination-spot-ele-current') : ''}`}
                                    key={index.toString()}
                                ></Col>
                            ))}
                        </Row>
                    )
                    break
                default:
                    paginationEle = (
                        <Row
                            wrap='nowrap'
                            className={_xclass('pagination-rail')}
                        >
                            {this.props.item.map((item, index) => (
                                <Col
                                    className={`${_xclass('pagination-rail-ele')} ${index + 1 === this.state.currentIndex ? _xclass('pagination-rail-ele-current') : ''}`}
                                    key={index.toString()}
                                ></Col>
                            ))}
                        </Row>
                    )
            }
        }

        return (
            <div
                ref='me'
                className={`${_xclass()} ${this.props.className}`}
                style={{
                    ...this.props.style,
                    ...this.state.style
                }}
                onTouchStart={(event) => this._handlerTouchStart(event)}
                onTouchMove={(event) => this._handlerTouchMove(event)}
                onTouchEnd={(event) => this._handlerTouchEnd(event)}
            >
                <Row className={_xclass('container')}>
                    {this.props.item.map((item, index) => {
                        return (
                            <Col
                                className={this.state.item[index].className}
                                key={index.toString()}
                                style={{
                                    transitionDuration: `${this.switchTime}ms`,
                                    height: `${this.props.height}px`,
                                    width: Number.isNaN(Number(this.props.width))
                                        ? this.props.width
                                        : `${this.props.width}px`
                                }}
                            >
                                {item}
                            </Col>
                        )
                    })}
                </Row>

                {this.state.totalIndex > 1 && (
                    <div className={_xclass('pagination')}>
                        {paginationEle}
                    </div>
                )}
            </div>
        )
    }
}

Slideshow.defaultProps = {
    auto: false,
    className: '',
    item: [],
    style: {},
    stopSpeed: 'normal',
    speed: 'normal',
    page: 'num',
    carousel: false
}

Slideshow.propTypes = {
    auto: PropTypes.bool,
    className: PropTypes.string,
    stopSpeed: PropTypes.string,
    speed: PropTypes.string,
    page: PropTypes.string,
    item: PropTypes.array,
    style: PropTypes.object,
    carousel: PropTypes.bool
}

export default Slideshow
