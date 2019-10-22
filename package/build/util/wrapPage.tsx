import { KeepAlive } from 'react-keep-alive'
import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { hot } from 'react-hot-loader/root'

const a = 4

const wrapPage = (Comp: React.FC, name: string): React.FC<RouteComponentProps> => {
  const KeepAliveComp: React.FC<RouteComponentProps> = (props): React.ReactElement => (
    <KeepAlive name={name}>
      <Comp {...props} />
    </KeepAlive>
  )

  return hot(KeepAliveComp)
}

export default wrapPage
