/**
 * modal 模态框组件
 *
 * @prop className
 * @prop commit - 当是 full 类型的时候，
 *                不用确认直接提交的模态框，默认为否
 * @prop clickBgToHide - 点击弹窗的背景可以触发隐藏
 * @prop header - 弹窗头部标题
 * @prop message - 模态框信息
 * @prop display - 显示状态
 *
 * @prop okBtn - 确定按钮名字
 * @prop noBtn - 取消按钮名字
 * @prop okBtnDisplay - 确定按钮是否显示
 * @prop noBtnDisplay - 取消按钮是否显示
 *
 * @prop headerDisplay - 是否显示弹窗头部
 * @prop footerDisplay - 是否显示弹窗底部
 * @prop pure - 如果设置了 true 则弹窗体就只能是 props.children，头部和底部都会被隐藏
 *
 * @prop height - 弹窗内容的高度 (Number | 'auto' | '100%')
 * @prop type - 弹窗类型（full | alert | confirm | simple | long）
 *
 * @slot - 弹窗的主体内容
 *
 * @event onOk - 点击确定按钮
 * @event onNo - 点击取消按钮
 * @event onHide - 隐藏模态框之后的事件
 * @event onClickShadow - 隐藏模态框之后的事件
 */

import './Modal.scss'
import './Modal.m.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { xclass, optXclass } from '../../util/comp'

import Pop from '../Pop/Pop'
import Btn from '../Btn/Btn'
import Header from './Header'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Footer from './Footer'
import FadeTransition from 'reactComp/transition/Fade'

import {
    handleEleDisplay
} from '../../util/dom/prop'

const TYPE_ALERT = 'alert'
const TYPE_CONFIRM = 'confirm'
const TYPE_TIP = 'tip'

const TIP_SHOW_TIME = 1500

class Modal extends Component {
    constructor(props) {
        super(props)

        this.compName = 'modal'
        this.$el = null // 组件的 dom 对象
        this.modalDisplay = false // 组件显示状态
        this.isMousedown = false
        this.pointStart = {
            x: 0,
            y: 0
        }

        this.state = Object.assign(this._computed(props), {
            modalDisplay: props.display
        })

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        this.mouseUpHandler = this.mouseUpHandler.bind(this)
        this.ok = this.ok.bind(this)
        this.no = this.no.bind(this)
        this._afterPopLeave = this._afterPopLeave.bind(this)
    }

    /**
     * 根据 props 计算出 state 的值
     *
     * @param {*} props
     */
    _computed(props) {
        function getHeaderDisplay() {
            if (props.headerDisplay !== undefined) {
                return props.headerDisplay
            }

            switch (props.type) {
                case 'full':
                    return true
                case 'simple':
                    return false
                default:
                    return !!props.header
            }
        }

        function getFooterDisplay() {
            if (props.footerDisplay !== undefined) {
                return props.footerDisplay
            }

            switch (props.type) {
                case 'full':
                    return props.isBiggerFull
                case 'simple':
                    return false
                case 'confirm':
                    return true
                case 'alert':
                    return true
                default:
                    return true
            }
        }

        function getModalHeight() {
            if (props.height) {
                return props.height
            }

            switch (props.type) {
                case 'full':
                    return props.isBiggerFull ? 300 : '100%'
                case 'simple':
                    return 150
                default:
                    return 120
            }
        }

        return {
            headerClass: optXclass('modal', {
                'no-header': !props.headerDisplay,
                'no-header-title': !props.modalHeader
            }),
            isFull: props.type === 'full',
            isSimple: props.type === 'simple',
            isBiggerFull: (props.isFull && props.deviceRange > 575) || !props.isFull,
            modalHeaderDisplay: getHeaderDisplay(),
            modalFooterDisplay: getFooterDisplay(),
            modalHeight: getModalHeight()
        }
    }

    _xclass(className) {
        return xclass('modal', className)
    }

    /**
     * 组件的类名
     */
    _compClass() {
        let compClass = ['', `type-${this.props.type}`]

        if (!this.state.modalHeaderDisplay) {
            compClass.push('no-header')
        }

        return xclass('modal', compClass) + ' ' + this.props.className
    }

    /**
     * pop 离开之后的回调函数
     */
    _afterPopLeave() {
        this.refs.me.style.display = 'none'

        this.props.onHide && this.props.onHide()
    }

    /**
     * mousemove 事件的句柄
     */
    mouseMoveHandler(event) {
        event.preventDefault()

        if (!this.isMousedown) {
            return false
        }

        let $this = this.$el.querySelector('.' + this.xclass('pop'))
        let styleHub = getComputedStyle($this)
        let top = parseFloat(styleHub.top, 10)
        let left = parseFloat(styleHub.left, 10)

        this.refs.pop.position({
            top: top + event.clientY - this.pointStart.y,
            left: left + event.clientX - this.pointStart.x
        })

        this.pointStart = {
            x: event.clientX,
            y: event.clientY
        }
    }

    /**
     * mouseup 事件的句柄
     */
    mouseUpHandler(event) {
        event.preventDefault()

        if (!this.isMousedown) {
            return false
        }

        this.isMousedown = false
    }

    /**
     * mousedown 事件的句柄
     */
    mouseDownHandler(event) {
        this.isMousedown = true

        this.pointStart = {
            x: event.clientX,
            y: event.clientY
        }

        return this
    }

    /**
     * 弹窗点击确定触发的函数
     *
     * @return {Object}
     */
    ok() {
        this.props.onOk ? this.props.onOk() : this.hide()
    }

    /**
     * 弹窗点击取消触发的函数
     *
     * @return {Object}
     */
    no() {
        this.props.onNo ? this.props.onNo() : this.hide()
    }

    /**
     * 点击 Full 的导航按钮
     */
    clickFullNavHandler() {
        if (this.props.commit) {
            this.no()
        } else {
            this.hide()
        }
    }

    /**
     * 显示 modal
     *
     * @param {Number} - 当前页码
     * @return {Object}
     */
    show() {
        this.refs.me.style.display = ''
        this.modalDisplay = true

        this.refs.pop.enter()
    }

    /**
     * 隐藏 modal
     *
     * @return {Object}
     */
    hide() {
        this.modalDisplay = false

        this.refs.pop.leave()
    }

    componentDidMount() {
        handleEleDisplay({
            element: this.refs.me,
            cb: () => {
                this.refs.pop.computePosition()
            }
        })
    }

    componentDidUpdate() {
        handleEleDisplay({
            element: this.refs.me,
            cb: () => {
                this.refs.pop.computePosition()
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._computed(nextProps))
    }

    render() {
        const {
            pure,
            onClickShadow
        } = this.props

        const popEle = []

        if (this.state.modalHeaderDisplay) {
            popEle.push(
                <Header
                    key='header'
                    commit={this.props.commit}
                    isFull={this.state.isFull}
                    isBiggerFull={this.state.isBiggerFull}
                    header={this.props.header}
                    okBtn={this.props.okBtn}
                    onMouseDown={this.mouseDownHandler}
                    onMouseUp={this.mouseUpHandler}
                    onClickFullNav={this.clickFullNavHandler}
                    type={this.props.type}
                />
            )
        }

        popEle.push(
            <article key='article' className={this._xclass('pop-article')}>
                {this.props.children
                    ? this.props.children
                    : <div className={`${this._xclass('alert-message')} ${this.props.header ? this._xclass('gray-message') : ''}`}>{this.props.message}</div>
                }
            </article>
        )

        if (this.state.modalFooterDisplay) {
            popEle.push(
                <Footer
                    key='footer'
                    theme={this.props.theme}
                    isFull={this.state.isFull}
                    okBtn={this.props.okBtn}
                    noBtn={this.props.noBtn}
                    ok={this.ok}
                    no={this.no}
                    type={this.props.type}
                />
            )
        }

        return (
            <div
                className={this._compClass()}
                onMouseMove={this.mouseMoveHandler}
                style={{
                    display: this.modalDisplay ? '' : 'none'
                }}
                ref='me'
            >
                <div
                    className={this._xclass('bg')}
                    onClick={() => {
                        onClickShadow && onClickShadow()
                        this.props.clickBgToHide && this.no()
                    }}
                ></div>

                <Pop
                    className={`${pure ? this._xclass('pop-pure') : ''} ${this._xclass('pop')}`}
                    afterLeave={this._afterPopLeave}
                    position={this.props.position}
                    ref='pop'
                    type='fade'
                >
                    {pure ? this.props.children : popEle}
                </Pop>
            </div>
        )
    }
}

Modal.defaultProps = {
    className: '',
    commit: false,
    clickBgToHide: false,
    display: false,
    type: 'simple',
    header: '',
    okBtn: '确定',
    noBtn: '取消',
    message: '',
    headerNoBtnDisplay: true,
    noBtnDisplay: true,
    pure: false,
    position: 'center'
}

Modal.propTypes = {
    commit: PropTypes.bool,
    clickBgToHide: PropTypes.bool,
    pure: PropTypes.bool,
    display: PropTypes.bool,
    type: PropTypes.string,
    header: PropTypes.string,
    okBtn: PropTypes.string,
    noBtn: PropTypes.string,
    message: PropTypes.string,
    headerDisplay: PropTypes.bool,
    headerNoBtnDisplay: PropTypes.bool,
    noBtnDisplay: PropTypes.bool,
    footerDisplay: PropTypes.bool,
    position: PropTypes.string
}

export default Modal
