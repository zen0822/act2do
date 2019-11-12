import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

const compPrefix = 'p-not-found-p'

const NotFound: React.FC<RouteComponentProps> = (): React.ReactElement => {
  document.title = '404'

  return (
    <div className={compPrefix}>
      <h1>404</h1>
    </div>
  )
}

export default NotFound
