/**
 * omit 省略组件
 *
 * @prop line - 多行省略规定的行数，默认是 1 行
 * @prop width - 段落行宽
 *
 */

import './Omit.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { render } from 'react-dom'
import compConf from '../../config.json'
import { xclass } from '../../util/comp'

const compPrefix = 'omit'

const _xclass = (className) => {
    return xclass(compPrefix, className)
}

class Omit extends Component {
    constructor(props) {
        super(props)

        this.compName = compPrefix // 组件名字
        this.boxWidth = 0 // 文字宽度
        this.fontWidthHub = {}

        this.state = {
            line: []
        }
    }

    textWidth(text, fontSize) {
        if (text === ' ') {
            return 4
        }

        if (this.fontWidthHub[text] !== undefined) {
            return this.fontWidthHub[text]
        }

        const span = this.refs.font
        let width = 0

        if (typeof span.textContent !== 'undefined') {
            span.textContent = text
        } else {
            span.innerText = text
        }

        width = span.offsetWidth

        if (this.isDoubleByte(text)) {
            this.fontWidthHub = {
                ...this.fontWidthHub,
                doubleByte: width
            }
        } else {
            this.fontWidthHub = {
                ...this.fontWidthHub,
                [text]: width
            }
        }

        return width
    }

    // 匹配汉字
    isDoubleByte(text) {
        const regex = /[^\u4e00-\u9fa5]/

        if (regex.test(text)) {
            return true
        }

        return false
    }

    splite(content = this.props.children) {
        if (content === undefined) {
            return false
        }

        const contentArray = content.split('')
        const contentArrayLength = contentArray.length

        let index = 0
        let lineFont = []

        for (let i = 0, lineLength = this.props.line; i < lineLength; i++) {
            if (contentArray[index] === undefined) {
                break
            }

            let lineWidth = 0 // 这一行的宽度
            let j = index
            let char = ''
            let lastFontWidthOver = false

            for (; j < contentArrayLength; j++) {
                let fontWidth = this.textWidth(contentArray[j])

                if (contentArray[j] === undefined || (fontWidth + lineWidth) >= this.boxWidth) {
                    // 最后一行并且文字总宽度大于容器宽度时
                    lastFontWidthOver = i === lineLength - 1 && (fontWidth + lineWidth) >= this.boxWidth

                    break
                }

                lineWidth = lineWidth + fontWidth
                char = char + contentArray[j]
            }

            lineFont.push((lastFontWidthOver && i === lineLength - 1) ? (char + '...') : char)

            index = j
        }

        this.setState({
            line: lineFont
        })
    }

    componentDidMount() {
        this.boxWidth = this.props.width || this.refs.me.offsetWidth - 1

        this.splite()
    }

    componentWillReceiveProps(nextProps) {
        this.boxWidth = this.props.width || this.refs.me.offsetWidth - 1

        this.splite(nextProps.children)
    }

    render() {
        const lineLength = this.state.line.length
        const { width } = this.props

        return (
            <div
                ref='me'
                style={{ width: width || undefined }}
                className={`${_xclass('')} ${this.props.className}`}
            >
                <span className={_xclass('font-width')} ref='font'></span>
                {this.state.line.map((item, index) => {
                    return item !== undefined && item !== ''
                        ? (
                            <div
                                className={`
                                    ${index + 1 === lineLength ? _xclass('line-last') : ''}
                                    ${_xclass('line')}
                                `}
                                key={index.toString()}
                            >
                                {item}
                            </div>
                        ) : null
                })}
            </div>
        )
    }
}

Omit.defaultProps = {
    className: '',
    line: 1,
    width: ''
}

Omit.propTypes = {
    className: PropTypes.string,
    line: PropTypes.number
}

export default Omit
