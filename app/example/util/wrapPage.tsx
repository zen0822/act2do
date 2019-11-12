import { KeepAlive } from 'react-keep-alive'
import React from 'react'

const wrapPage = (Comp: React.FC<any>, name: string): React.FC<any> => {
  const KeepAliveComp: React.FC<any> = (props): React.ReactElement => (
    <KeepAlive name={name}>
      <Comp {...props} />
    </KeepAlive>
  )

  return KeepAliveComp
}

export default wrapPage
