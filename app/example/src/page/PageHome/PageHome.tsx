import './PageHome.scss'
import React, { useState } from 'react'
import { Link } from '@reach/router'
import { useKeepAliveEffect } from 'react-keep-alive'
import api from '../../../api'
import wrapPage from '@act2do/build/util/wrapPage'
import Input from '@act2do/component/src/Input/Input'
import { hot } from 'react-hot-loader/root'

const compPrefix = 'p-home-p'

const PageHome: React.FC = (): React.ReactElement => {
  document.title = '用户协议'
  const ad = {
    zen: 'handsome'
  }

  const ad2 = {
    ...ad,
    tuergou: 'beauty'
  }

  const [inputVal, setInputVal] = useState('')

  useKeepAliveEffect(() => {
    console.log('mounted')

    return (): void => {
      console.log('unmounted')
    }
  })

  return (
    <div className={compPrefix}>
      <Input
        value={inputVal}
        onChange={(value: React.SetStateAction<string>): void => setInputVal(value)}
      />
      <h1>列表g</h1>
      <p>{ad2.tuergou}</p>
      {Array.from({ length: 20 }).map((_item, index) => (
        <p key={index}>
          <Link to='detail'>{api.common}</Link>
        </p>
      ))}
    </div>
  )
}

export default hot(wrapPage(PageHome, 'home'))
