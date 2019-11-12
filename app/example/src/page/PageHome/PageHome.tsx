import './PageHome.scss'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useKeepAliveEffect } from 'react-keep-alive'
import api from '../../../api'
import wrapPage from '../../../util/wrapPage'
import Input, { Value } from '@act2do/component/src/Input/Input'
import { hot } from 'react-hot-loader/root'
import { useDispatch } from 'react-redux'
import { addAddressId } from '../../../store/common/action'

const compPrefix = 'p-home-p'

const PageHome: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [inputVal, setInputVal] = useState<Value>('')

  document.title = '用户协议'
  const ad = {
    zen: 'handsome'
  }

  const ad2 = {
    ...ad,
    tuergou: 'beauty'
  }

  dispatch(addAddressId(1))

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
        onChange={(value): void => setInputVal(value)}
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
