/**
 * col 组件
 *
 * @prop className
 * @prop style
 * @prop gap（已废弃） - 定义间隔的宽度（px），覆盖行设置的间隔 (5, 10, 20, 30, 40, 50)
 * @prop pull - 定义了列在 x 反方向偏移的栅格数
 * @prop push - 定义了列在 x 正方向偏移的栅格数
 * @prop offset - 定义了列离开头的栅格数
 * @prop span - 定义了列在行上的水平跨度（采用 12 栏栅格）
 * @prop xs - 加小设备的水平跨度栅格数
 * @prop s - 小设备的水平跨度栅格数
 * @prop m - 中设备的水平跨度栅格数
 * @prop l - 大型设备的水平跨度栅格数
 * @prop xl - 超大型设备的水平跨度栅格数
 * @prop grid - 集合所有设备水平跨度的栅格数
 * @prop height - 高度
 * @prop width - 宽度
 *
 */

import './Col.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'

class Col extends Component {
    constructor(props) {
        super(props)

        this.comp = 'col'
        this.$el = null // 组件的 dom 对象
    }

    compClass() {
        let classOpt = []
        let deviceType = ['xs', 's', 'm', 'l', 'xl', 'span']
        let compPrefixClass = `${compConf.prefix}-col`

        if (this.props.gap > 0) {
            classOpt.push(`${compPrefixClass}-gap-${this.props.gap}`)
        }

        if (this.props.pull > 0) {
            classOpt.push(`${compPrefixClass}-pull-${this.props.pull}`)
        }

        if (this.props.push > 0) {
            classOpt.push(`${compPrefixClass}-push-${this.props.push}`)
        }

        if (this.props.offset > 0) {
            classOpt.push(`${compPrefixClass}-offset-${this.props.offset}`)
        }

        if (!this.props.grid) {
            deviceType.forEach((item) => {
                if (this.props[item] > 0) {
                    classOpt.push(`${compPrefixClass}-${item}-${this.props[item]}`)
                }
            })
        } else {
            deviceType.forEach((item) => {
                if (this.props[item] > 0) {
                    classOpt.push(`${compPrefixClass}-${item}-${this.props[item]}`)
                } else if (this.props.grid[item] > 0) {
                    classOpt.push(`${compPrefixClass}-${item}-${this.props.grid[item]}`)
                }
            })
        }

        classOpt.push(compPrefixClass, this.props.className)

        return classOpt.join(' ')
    }

    componentDidMount() {
        this.$el = this.refs.me
    }

    render() {
        return (
            <div
                ref='me'
                className={this.compClass()}
                style={{
                    height: this.props.height,
                    width: this.props.width,
                    ...this.props.style
                }}
            >
                {this.props.children}
            </div>
        )
    }
}

Col.defaultProps = {
    gap: 0,
    pull: 0,
    push: 0,
    offset: 0,
    span: 0,
    xs: 0,
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
    height: '',
    width: ''
}

Col.propTypes = {
    gap: PropTypes.number,
    pull: PropTypes.number,
    push: PropTypes.number,
    offset: PropTypes.number,
    span: PropTypes.number,
    xs: PropTypes.number,
    s: PropTypes.number,
    m: PropTypes.number,
    l: PropTypes.number,
    xl: PropTypes.number,
    grid: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string
}

export default Col
