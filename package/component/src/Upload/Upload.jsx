/**
 * Upload 组件
 *
 * @prop {string} accept - 上传文件类型
 * @prop {string} name - 文件上传的key
 * @prop {string} action - 文件上传的路径
 * @prop {string} className - 样式
 * @prop {string} length - 上传文件数
 * @prop {array} defaultImages - 上传文件长度限制
 * @prop {string} required - 必须上传
 * @prop {string} errorMessage - 错误信息
 * @prop {object} params - 上传文件选项
 *
 * @event onChange - 上传成功或删除时触发
 */
import './Upload.scss'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Loading from 'reactComp/component/Loading/Loading'
import Tip from 'reactComp/component/Message/Tip'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Image from '../Image/Image'

import {
    getCookie
} from '../../util/cookie'
import { post } from '../../util/ajax'
import clipImage from '../../util/clipImage'
const compPrefix = 'c-upload-c'
const _xclass = (className) => {
    return `${compPrefix}-${className}`
}

export default class Upload extends Component {
    constructor(props) {
        super(props)

        const fileList = this.props.defaultImages || []
        this.compName = 'upload'

        this.state = {
            loading: false,
            fileList: [...fileList],
            imageList: [...fileList],
            validate: true,
            imageErrorState: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    async handleChange(ev) {
        const { name, action, onChange, params } = this.props
        const { fileList, imageList } = this.state

        this.setState({
            loading: true
        })

        clipImage(ev.target.files[0], async (data, src) => {
            const formData = new FormData()
            formData.append(name, data)

            if (params) {
                Object.keys(params).forEach((item) => {
                    formData.append(item, params[item])
                })
            }

            formData.append('generate_thumb', 1)
            const token = localStorage.getItem('token')

            try {
                let res = await post(action, formData, {
                    contentType: 'multipart/form-data',
                    gettenData: {
                        access_token: token === null || token === 'null' ? '' : token,
                        user_id: getCookie('userid'),
                        session_id: getCookie('sessionid'),
                        visitorid: localStorage.getItem('visitorId'),
                        version: localStorage.getItem('wankeMallVersion'),
                        source: localStorage.getItem('mallSource')
                    }
                })

                imageList.push(src)
                fileList.push(res.response.data.url)

                onChange && onChange(fileList)

                this.setState({
                    fileList: [...fileList],
                    imageList: [...imageList],
                    validate: true
                })
            } catch (error) {
                error.msg && Tip(error.msg)
            } finally {
                this.setState({
                    loading: false
                })
            }
        })
    }

    handleClearImage(index) {
        const { fileList, imageList } = this.state
        const { onChange } = this.props

        fileList.splice(index, 1)
        imageList.splice(index, 1)

        this.setState({
            fileList: [...fileList],
            imageList: [...imageList]
        })

        onChange && onChange([...fileList])
    }

    verify() {
        const { fileList, required } = this.state

        if (required && fileList.length === 0) {
            this.setState({
                validate: false
            })

            return false
        }

        return true
    }

    val() {
        return this.state.fileList
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: [...nextProps.defaultImages],
            imageList: [...nextProps.defaultImages]
        })
    }

    render() {
        const { className, accept, length, required, errorMessage } = this.props
        const { loading, validate, imageList } = this.state

        return (
            <div className={`${compPrefix} ${className}`}>
                <Row className={`${_xclass('content')}`} justify='start'>
                    {imageList.map((item, index) => {
                        return (
                            <Col
                                key={index}
                                className={_xclass('content-list')}
                                style={{ backgroundImage: `url(${item})` }}
                            >
                                {/* <Image className={_xclass('content-list-image')} src={item} alt=""/> */}
                                <span onClick={this.handleClearImage.bind(this, index)} />
                            </Col>
                        )
                    })}

                    {imageList.length < length &&
                        <Col className={_xclass('content-box')}>
                            {loading
                                ? (
                                    <div className={_xclass('content-box-loading')}>
                                        <Loading size='s' display />
                                    </div>
                                ) : (
                                    <div className={_xclass('content-box-trigger')}>
                                        <div className={_xclass('content-box-trigger-content')}>
                                            <div className={_xclass('content-box-plus')}></div>

                                            <div>上传凭证</div>
                                            <div>(最多 {length} 张)</div>
                                        </div>

                                        <input
                                            accept={accept}
                                            type='file'
                                            className={_xclass('content-box-trigger-input')}
                                            onChange={this.handleChange}
                                            value=''
                                        />
                                    </div>
                                )
                            }
                        </Col>
                    }
                </Row>
                {required && !validate &&
                    <div className={_xclass('error-tip')}>{errorMessage || '请上传图片'}</div>
                }
            </div>
        )
    }
}

Upload.defaultProps = {
    accept: 'image/jpeg,image/jpg,image/png',
    defaultImages: [],
    name: 'upload_file',
    action: '',
    className: '',
    param: '',
    length: 1
}

Upload.propTypes = {
    action: PropTypes.string.isRequired,
    defaultImages: PropTypes.array,
    param: PropTypes.string,
    object: PropTypes.object
}

