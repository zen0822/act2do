import './Detail.scss'
import React from 'react'
import { RouteComponentProps } from '@reach/router'
import wrapPage from '@act2do/build/util/wrapPage'

const compPrefix = 'p-detail-p'

const Detail: React.FC<RouteComponentProps> = (): React.ReactElement => {
  document.title = '详情'

  return (
    <div className={compPrefix}>
      <h1>列表详情</h1>
    </div>
  )
}

export default wrapPage(Detail, 'detail')
