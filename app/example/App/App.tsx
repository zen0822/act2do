/**
 * app component
 */
import '../src/scss/main.scss'
import React from 'react'
import RouterConfig from '../route/RouterConfig'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'

setConfig({
  trackTailUpdates: false
})

const App: React.FC = (): React.ReactElement => (
  <>
    <RouterConfig />
  </>
)

export default hot(App)
