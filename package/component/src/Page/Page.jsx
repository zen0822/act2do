/**
 * page 组件
 *
 * @prop auto -自动计算分页数据（data 选项需要传入数据的长度 length 和每页的数据数目 size）
 * @prop display - 显示分页控件
 * @prop data - 分页数据
 *             length - 一共有几条数据
 *             total - 一共有多少页
 *             size - 每页几条数据
 *             current - 当前的页码
 * @prop onePageDisplay - 分页总页数为 1 时是否显示
 * @prop size - 分页外观尺寸大小（s | m | l）
 * @prop type - 分页类型（加载更多：more | 数字标注（默认）：num）
 * @prop loadMoreText - 加载更多的提示文字
 *
 * @event onSwitch - 换页触发事件
 *
 * @slot slotLoadMore - 分页类型为加载更多时的，在按钮处的内容分发
 */

import './Page.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import { optXclass, xclass } from '../../util/comp'

import Btn from '../Btn/Btn'
import Icon from '../Icon/Icon'
import Input from '../Input/Input'
import Row from '../Row/Row'
import Col from '../Col/Col'

const _xclass = (className) => {
    return xclass('page', className)
}

class Page extends Component {
    constructor(props) {
        super(props)

        this.compName = 'page' // 组件名字

        this.click = this.click.bind(this)
        this.more = this.more.bind(this)
        this.pre = this.pre.bind(this)
        this.next = this.next.bind(this)
        this.jump = this.jump.bind(this)

        this.state = {
            pageData: props.data, // 分页数据
            pageItem: [] // 分页的数字按钮
        }
    }

    /**
     * 组件的类名
     */
    _compClass() {
        return _xclass([
            '',
            `theme-${this.props.theme}`,
            `type-${this.props.type}`
        ])
    }

    /**
     * 初始化分页
     */
    _initPage(pageData) {
        if (this.auto) {
            Object.assign(pageData, {
                total: Math.ceil(pageData.length / pageData.size),
                current: 1
            })
        }

        let pageStart = 1
        let pageEnd = pageData.total
        let pageItem = []

        if (pageData.total >= 11) {
            if (pageData.current > 5 && pageData.current < pageData.total - 4) {
                pageStart = pageData.current - 5
                pageEnd = pageData.current + 4
            } else {
                if (pageData.current <= 5) {
                    pageStart = 1
                    pageEnd = 10
                } else {
                    pageEnd = pageData.total
                    pageStart = pageData.total - 9
                }
            }
        }

        while (pageStart <= pageEnd) {
            pageItem.push(pageStart)
            pageStart++
        }

        this.setState({
            pageData: {
                ...pageData,
                item: pageItem
            }
        })
    }

    /**
     * 加载更多
     */
    more(event = {}) {
        event.stopPropagation && event.stopPropagation()

        return this.next()
    }

    /**
     * @param {Number} - 当前页码
     * @return {Function}
     */
    click(event = {}, currentPage) {
        event.stopPropagation && event.stopPropagation()

        if (currentPage === this.state.pageData.current) {
            return false
        }

        return this.switch(currentPage)
    }

    /**
     * 下一页
     */
    next(event = {}) {
        event.stopPropagation && event.stopPropagation()

        if (this.state.pageData.current + 1 > this.state.pageData.total) {
            return false
        }

        return this.switch(this.state.pageData.current + 1)
    }

    /**
     * 上一页
     */
    pre(event = {}) {
        event.stopPropagation && event.stopPropagation()

        if (this.state.pageData.current - 1 === 0) {
            return false
        }

        return this.switch(this.state.pageData.current - 1)
    }

    /**
     * 最后一页
     */
    end(event = {}) {
        event.stopPropagation && event.stopPropagation()

        return this.switch(this.state.pageData.total)
    }

    /**
     * 第一页
     */
    start(event = {}) {
        event.stopPropagation && event.stopPropagation()

        return this.switch(1)
    }

    /**
     * 跳转到指定页数
     */
    jump(event = {}) {
        event.stopPropagation && event.stopPropagation()

        return this.switch(this.refs.jumpInputRef.val())
    }

    /**
     * 切换页码
     */
    switch(pageNum) {
        if (isNaN(pageNum)) {
            return false
        }

        this.state.pageData.current = pageNum

        this.props.onSwitch && this.props.onSwitch({
            currentPage: pageNum,
            emitter: this
        })
    }

    /**
     * 分页显示状态
     */
    pageDisplay() {
        return this.props.display && (this.props.onePageDisplay || this.state.pageData.length > 0)
    }

    componentWillReceiveProps(nextProps) {
        this._initPage({ ...nextProps.data })
    }

    componentDidMount() {
        this._initPage({ ...this.props.data })
    }

    render() {
        return (
            <div
                className={`${this._compClass()} ${this.props.className}`}
                style={{
                    display: this.pageDisplay() ? '' : 'none'
                }}
                ref='me'
            >
                {this.props.type === 'more'
                    ? (
                        <div
                            className={_xclass('more')}
                            onClick={this.more}
                        >
                            <div className={_xclass('load')}>
                                {this.props.slotLoadMore
                                    ? <this.props.slotLoadMore />
                                    : this.props.loadMoreText
                                }
                            </div>
                        </div>
                    ) : (
                        <div className={_xclass('num')}>
                            <Row gap={10}>
                                <Col xs={12} s={12} l={1} xl={1}>
                                    <div className={_xclass('length')}>
                                        `共 ${this.state.pageData.length} 条`
                                    </div>
                                </Col>
                                <Col xs={12} s={12} l={6} xl={6}>
                                    <Row>
                                        <Col>
                                            <div
                                                className={_xclass('ele')}
                                                onClick={this.start}
                                                style={{
                                                    display: this.state.pageData.current !== 1 ? '' : 'none'
                                                }}
                                            >
                                                <Icon size='m' kind='backward-start' />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div
                                                className={_xclass('ele')}
                                                onClick={this.pre}
                                                style={{
                                                    visibility: this.pageData.current === 1 ? '' : 'hidden'
                                                }}
                                            >
                                                <Icon size='m' kind='backward' />
                                            </div>
                                        </Col>
                                        <Col>
                                            <Row className={_xclass('ul')}>
                                                {this.state.pageData.item.map((item, index) => {
                                                    let pageNum = index + 1

                                                    return (
                                                        <Col
                                                            className={_xclass(['li', 'ele']) + ` ${pageNum === this.state.pageData.current ? _xclass('li-active') : ''}`}
                                                            key={index.toString()}
                                                            onClick={(event) => this.click(event, pageNum)}
                                                        >{pageNum}</Col>
                                                    )
                                                })}
                                            </Row>
                                        </Col>
                                        <Col>
                                            <div
                                                className={_xclass('ele')}
                                                onClick={this.next}
                                                style={{
                                                    visibility: this.pageData.current === this.pageData.total ? '' : 'hidden'
                                                }}
                                            >
                                                <Icon size='m' kind='forward' />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div
                                                className={_xclass('ele')}
                                                onClick={this.end}
                                                style={{
                                                    display: this.state.pageData.current !== this.state.pageData.length ? '' : 'none',
                                                    visibility: this.pageData.current === this.pageData.total ? 'hidden' : ''
                                                }}
                                            >
                                                <Icon size='m' kind='forward-end' />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} s={12} l={5} xl={5}>
                                    <div className={_xclass('search')}>
                                        <span className={_xclass('total')}>
                                            {`共 ${this.pageData.total} 页 `}
                                        </span>
                                        <span>第</span>
                                        <Input className={_xclass('jump-box')} ref='jumpInput' />
                                        <span>页</span>
                                        <Btn
                                            className={_xclass('jump-btn')}
                                            initVal='GO'
                                            onClick={this.jump}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            </div>
        )
    }
}

Page.defaultProps = {
    auto: false,
    className: '',
    data: PropTypes.required,
    display: true,
    loadMoreText: '点击加载更多',
    onePageDisplay: false,
    size: 'M',
    theme: 'primary',
    type: 'num'
}

Page.propTypes = {
    auto: PropTypes.bool,
    className: PropTypes.string,
    data: PropTypes.object,
    display: PropTypes.bool,
    loadMoreText: PropTypes.string,
    onePageDisplay: PropTypes.bool,
    size: PropTypes.string,
    theme: PropTypes.string,
    type: PropTypes.string
}

export default Page
