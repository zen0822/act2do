/**
 * app component
 */
import '../src/scss/main.scss'
import React from 'react'
import RouterConfig from '../route/RouterConfig'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { IntlProvider } from 'react-intl'

setConfig({
  trackTailUpdates: false
})

const App: React.FC = (): React.ReactElement => (
  <IntlProvider locale='en'>
    <RouterConfig />
  </IntlProvider>
)

export default hot(App)
