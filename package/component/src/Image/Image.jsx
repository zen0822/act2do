/**
 * Image 组件
 *
 * @prop src - 图片地址
 * @prop contain - 图片全展示并且垂直水平居中
 * @prop preSrc - 图片下载完之前的占位图片的地址（传 base64 字符串）
 * @prop alt - 图片描述
 * @prop title - 图片标题
 * @prop width - 图片宽度
 * @prop height - 图片高度
 * @prop className - 图片样式
 * @prop zoom - 图片放大
 * @prop zoomEle - 需要放大的图片元素
 *
 */

import './Image.scss'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Row from '../Row/Row'
import Col from '../Col/Col'

const errorImage = require('./pic_img_error.png')
const preImage = require('./pic_ load.png')

const compPrefix = 'c-image-c'
const _xclass = (className) => {
    return `${compPrefix}-${className}`
}

class Image extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false
        const { width, height } = props

        this.state = {
            imgState: 1, // 1：图片加载前，2：图片加载成功，3：图片加载失败
            preImage: props.preSrc || preImage,
            displayZoom: false, // 放大图的显示状态
            _width: width === ''
                ? ''
                : Number.isNaN(Number(width)) ? width : `${width}px`,
            _height: height === ''
                ? ''
                : Number.isNaN(Number(height)) ? height : `${height}px`
        }
    }

    imageLoadSuccess(event) {
        const image = event.currentTarget

        if (this.props.contain) {
            const widthHeightRate = image.width / image.height

            if (widthHeightRate > 1) {
                this.setState({
                    _width: '100%',
                    _height: 'auto'
                })
            }

            if (widthHeightRate < 1) {
                this.setState({
                    _width: 'auto',
                    _height: '100%'
                })
            }
        }

        this.setState({
            imgState: 2
        })
    }

    imageLoadError() {
        this.setState({
            imgState: 3
        })
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillMount() {
        this._isMounted = false
    }

    render() {
        const { imgState, preImage, _width, _height, displayZoom } = this.state
        const {
            className,
            src,
            zoomSrc,
            zoom,
            zoomEle,
            alt,
            title
        } = this.props

        const imgProps = {
            className: _xclass('img'),
            width: _width,
            height: _height,
            alt,
            title
        }

        const imageBoxStyle = {
            width: _width,
            height: _height
        }

        return (
            <div
                style={imageBoxStyle}
                className={`${compPrefix} ${className}`}
                ref={(ref) => this.imageBox = ref}
                onClick={() => this.setState({ displayZoom: true })}
            >
                {zoom && displayZoom && (
                    <div className={_xclass('zoom')}>
                        <div
                            className={_xclass('zoom-layover')}
                            onClick={(event) => {
                                event.stopPropagation()
                                this.setState({ displayZoom: false })
                            }}
                        ></div>
                        <Row align='middle' style={{ height: '100vh' }}>
                            <Col>
                                <div className={_xclass('zoom-img')}>
                                    {zoomEle || (
                                        <img width={_width} height={_height} className={_xclass('zoom-img-ele')} src={zoomSrc} />
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

                {imgState === 1 && (
                    <img
                        {...imgProps}
                        src={preImage}
                    />
                )}

                <img
                    {...imgProps}
                    src={src}
                    onLoad={(event) => this.imageLoadSuccess(event)}
                    onError={() => this.imageLoadError()}
                    style={{
                        display: imgState === 2 ? '' : 'none',
                        ...imageBoxStyle
                    }}
                />

                {imgState === 3 && (
                    <img
                        {...imgProps}
                        src={errorImage}
                    />
                )}
            </div>
        )
    }
}

Image.defaultProps = {
    preSrc: '',
    className: '',
    src: '',
    alt: '',
    title: '',
    contain: false,
    zoom: false,
    width: '',
    height: ''
}

Image.propTypes = {
    contain: PropTypes.bool,
    zoom: PropTypes.bool,
    preSrc: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string
}

export default Image
