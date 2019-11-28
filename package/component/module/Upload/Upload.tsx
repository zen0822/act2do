/**
 * Upload 组件
 *
 * @prop {string} action - 文件上传的路径
 * @prop {string} className - 样式
 * @prop {string} hint - 上传提示
 * @prop {array} initItem - 上传文件长度限制
 * @prop {string} max - 最多上传文件数，默认 1
 * @prop {string} param - 文件上传的key
 * @prop {string} errorHint - 错误信息（配置正则时显示的错误提示）
 * @prop {string} required - 必须上传
 * @prop {number} space - 文件大小（M）
 * @prop {string} type - img | doc | zip
 *
 * @event onChange - 生成图片成功或删除时触发
 */
import './Upload.scss'

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  RefForwardingComponent,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react'
import { xclass } from '../../util/comp'
import Loading from '../Loading'
import Row from '../Row'
import Col from '../Col'
import Img from '../Img'
import { tip } from '../Message'
import Icon from '../Icon'
import Omit from '../Omit'

type TProp = React.HTMLProps<HTMLDivElement> & {
  className?: string
  initItem?: Array<any>
  errorHint?: string
  hint?: string
  max?: number
  onChange?: (fileList: Array<any>) => void
  param?: string
  required?: boolean
  regex?: string
  space?: number
  type?: string
}
type Api = {
  compName: string
  param: string
  val(): Array<any>
  verify(): boolean
}

const compName = 'upload'
const _xclass = (className: string | void): string => {
  return xclass(compName, className)
}

const Upload: RefForwardingComponent<Api, TProp> = ({
  initItem = [],
  className = '',
  hint = '',
  max = 1,
  onChange,
  param = '',
  required = false,
  regex,
  space,
  type = 'img'
}, ref): ReactElement => {
  const preItemRef = useRef<any[]>([])
  const [loading] = useState(false)
  const [item, setItem] = useState([...initItem]) // 存储上传文件信息
  const [validate, setValidate] = useState(true)
  const [imageErrorState] = useState(false)

  const [accept, setAccept] = useState('')
  const [fileTypeHint, setFileTypeHint] = useState('')
  const [typeRegex, setTypeRegex] = useState<RegExp>()
  const isImg = useMemo(() => (type === 'img'), [type])

  /**
  * 初始化文件类型的正则
  *
  * @return {Object} - this - 组件
  */
  const initRegex = useCallback(() => {
    if (regex) {
      setTypeRegex(new RegExp(regex))

      return
    }

    switch (type) {
      case 'img':
        setTypeRegex(/(.jpe?g|.png|.gif)$/i)
        setFileTypeHint('仅支持 jpg, png, gif 格式图片!')
        setAccept('image/gif,image/jpeg,image/jpg,image/png')

        break
      case 'doc':
        setTypeRegex(/(.pdf|.doc|.txt)$/i)
        setFileTypeHint('仅支持 doc, pdf, txt 格式文档!')
        setAccept('application/pdf, application/msword')

        break
      case 'zip':
        setTypeRegex(/(.zip)$/i)
        setFileTypeHint('仅支持 zip 格式文档!')
        setAccept('application/zip')

        break
      default:
        break
    }
  }, [type, regex])

  /**
   * 解析图片上传
   * @param file
   * @param index
   */
  function parseImg(file: any, index: number): any {
    const itemTmp = [...item]

    if (typeRegex && !typeRegex.test(file.name)) {
      return tip(fileTypeHint)
    }

    if (space && file.size > 1024 * 1024 * space) {
      return tip(`上传图片应小于 ${space} M`)
    }

    const eleImage = new Image()
    const reader = new FileReader()
    const currentIndex = itemTmp.push({
      src: '',
      file,
      index,
      title: file.name,
      imgEle: eleImage
    }) - 1

    setItem(itemTmp)

    eleImage.onload = function (this: any): void {
      const itemTmp2 = [...itemTmp]
      const itemEle = itemTmp2[currentIndex]

      itemTmp2.splice(currentIndex, 1, {
        ...itemEle,
        height: this.height,
        width: this.width
      })

      // self._checkImgSize(this.height, this.width)
      // TODO
      onChange && onChange(itemTmp2)
      setItem(itemTmp2)
    }

    reader.onload = (event: any): void => {
      const itemTmp2 = [...itemTmp]
      const src = event.target.result
      const item = itemTmp2[currentIndex]

      item.src = src
      item.imgEle.src = src

      setItem(itemTmp2)
    }

    reader.readAsDataURL(file)
  }

  /**
   * 解析文件上传
   * @param file
   * @param index
   */
  function parseFile(file: any, index: number): any {
    const itemTmp = [...item]

    if (typeRegex && !typeRegex.test(file.name)) {
      return tip(fileTypeHint)
    }

    if (space && file.size > 1024 * 1024 * space) {
      return tip(`上传文件应小于 ${space} M`)
    }

    itemTmp.push({
      file,
      index
    })

    setItem(itemTmp)
    onChange && onChange(itemTmp)
  }

  /**
   * 上传 input 的输入变化
   * @param event
   */
  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void | boolean> {
    if (!event.target.files) {
      return false
    }

    const targetFile = Array.from(event.target.files)
    targetFile.forEach((fileItem: any, index: number) => {
      if (isImg) {
        parseImg(fileItem, index)
      } else {
        parseFile(fileItem, index)
      }
    })
  }

  function handleClearImage(index: number): void {
    const itemTemp = [...item]
    itemTemp.splice(index, 1)
    setItem(itemTemp)
    onChange && onChange(itemTemp)
  }

  function verify(): boolean {
    if (required && item.length === 0) {
      setValidate(false)

      return false
    }

    return true
  }

  function val(): any[] {
    return item
  }

  function init(): void {
    setItem([...initItem])
  }

  useImperativeHandle(ref, () => ({
    compName,
    param,
    val,
    verify
  }))

  if (preItemRef.current.length !== initItem.length) {
    init()

    preItemRef.current = [...initItem]
  }

  useEffect(() => {
    initRegex()
  }, [initRegex])

  return (
    <div className={`${_xclass()} ${className}`}>
      <Row className={`${_xclass('content')}`} justify='start'>
        {item.map((fileItem, index) => isImg
          ? (
            <Col
              key={index}
              className={_xclass('content-list')}
            >
              <div className={_xclass('content-delete')} onClick={(): void => handleClearImage(index)}>
                <Icon size='S' kind='close-circle-s' />
              </div>
              <Row justify='center' align='center'>
                <Col>
                  <div className={_xclass('content-list-image')}>
                    <Img
                      src={fileItem.src}
                      alt='图片丢失'
                      contain
                      zoom
                    />
                  </div>
                </Col>
              </Row>

            </Col>
          ) : (
            <Col
              key={index}
              className={`${_xclass('content-list')} ${_xclass('content-file')}`}
            >
              <div className={_xclass('content-delete')} onClick={(): void => handleClearImage(index)}>
                <Icon size='S' kind='close-circle-s' />
              </div>
              <Icon size='L' kind='compress' />
              <Omit>{fileItem.file && fileItem.file.name}</Omit>
            </Col>
          )
        )}

        {item.length < max &&
          <Col className={_xclass('content-box')}>
            {loading
              ? (
                <div className={_xclass('content-box-loading')}>
                  <Loading size='s' display />
                </div>
              ) : (
                <Row justify='center' className={_xclass('content-box-trigger')}>
                  <Col className={_xclass('content-box-trigger-content')}>
                    <div className={_xclass('content-box-plus')}></div>
                    <div>{hint || '上传文件'}</div>
                  </Col>

                  <input
                    accept={accept}
                    type='file'
                    className={_xclass('content-box-trigger-input')}
                    onChange={handleChange}
                    value=''
                  />
                </Row>
              )
            }
          </Col>
        }
      </Row>
      {required && !validate &&
        <div className={_xclass('error-hint')}>{imageErrorState || '请上传文件'}</div>
      }
    </div>
  )
}

export default forwardRef(Upload)

export {
  Api
}
