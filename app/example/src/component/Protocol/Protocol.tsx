/**
 * @prop {String} src - 协议的静态资源超链接地址
 */

import './Protocol.scss'
import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useRef
} from 'react'

type TProp = {
  src: string
}

const compPrefix = 'comp-protocol'

const CompProtocol: FC<TProp> = ({ src = '' }): ReactElement => {
  const [protocolFileHeight, setProtocolFileHeight] = useState(0)
  const refMe = useRef(null)
  useEffect(() => {
    const fileHeight = refMe && refMe.current
      ? (refMe.current as any).contentWindow.document.body.scrollHeight
      : 0
    console.log(fileHeight)
    setProtocolFileHeight(fileHeight)
  }, [])

  return (
    <div className={compPrefix}>
      <iframe
        width='100%'
        height={`${protocolFileHeight}px`}
        frameBorder='0'
        ref={refMe}
        // onLoad={(event: UIEvent): void => {
        //   setProtocolFileHeight(ReactDOM.findDOMNode(event.currentTarget).contentWindow.document.body.scrollHeight)
        // }}
        scrolling='no'
        src={src}
      ></iframe>
    </div>
  )
}

export default CompProtocol
