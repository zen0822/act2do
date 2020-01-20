import './Detail.scss'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
// import wrapPage from '../../../util/wrapPage'
// import { hot } from 'react-hot-loader/root'

const compPrefix = 'p-detail-p'

const Detail: React.FC<RouteComponentProps> = (): React.ReactElement => {
  document.title = '详情'
  const [inputVal, setInputVal] = useState(1)

  return (
    <div
      className={compPrefix} key='pageDetail'
      onClick={(): void => setInputVal(inputVal === 1 ? 2 : 1)}
    >
      {inputVal === 1
        ? [
          <div key='a'>A</div>,
          <div key='b'>B</div>
        ] : [
          <div key='b'>B</div>,
          <div key='a'>A</div>
        ]
      }

    </div>
  )
}

// export default hot(wrapPage(Detail, 'detail'))
export default Detail
