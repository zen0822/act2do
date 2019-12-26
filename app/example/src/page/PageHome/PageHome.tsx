import './PageHome.scss'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useKeepAliveEffect } from 'react-keep-alive'
import api from '../../../api'
import wrapPage from '../../../util/wrapPage'
import Input from '@act2do/component/module/Input'
import { hot } from 'react-hot-loader/root'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressId } from '../../../store/common/action'
import { State } from '../../../store/store'

const compPrefix = 'p-home-p'

const PageHome: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [inputVal, setInputVal] = useState<number | string>('')
  const addressId = useSelector((state: State) => state.common.addressId)

  document.title = '用户协议'
  const ad = {
    zen: 'handsome'
  }

  const ad2 = {
    ...ad,
    tuergou: 'beauty'
  }

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
      <p>{ad2.tuergou}</p>
      <h1>列表</h1>
      <div
        onClick={(): void => {
          dispatch(addAddressId(addressId + 1))
        }}
      >点击 + 1，addressId: {addressId}</div>
      {Array.from({ length: 20 }).map((_item, index) => (
        <p key={index}>
          <Link to='detail'>{api.common}</Link>
        </p>
      ))}
    </div>
  )
}

export default hot(wrapPage(PageHome, 'home'))
