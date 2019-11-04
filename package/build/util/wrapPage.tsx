import { KeepAlive } from 'react-keep-alive'
import React from 'react'
import { RouteComponentProps } from '@reach/router'

const wrapPage = (Comp: React.FC, name: string): React.FC<RouteComponentProps> => {
  const KeepAliveComp: React.FC = (props): React.ReactElement => (
    <KeepAlive name={name}>
      <Comp {...props} />
    </KeepAlive>
  )

  return KeepAliveComp
}

export default wrapPage
