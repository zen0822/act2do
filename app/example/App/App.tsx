/**
 * app component
 */
import '../src/scss/main.scss'
import '@act2do/component/scss/util.scss'

import React from 'react'
import RouterConfig from '../route/RouterConfig'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { Provider as KeepAliveProvider } from 'react-keep-alive'

import { store } from '../store/store'
import { Provider as ReduxProvider } from 'react-redux'

import {
  createIntl,
  RawIntlProvider
} from 'react-intl'
import {
  parse,
  MessageFormatElement
} from 'intl-messageformat-parser'
import rcZhCN from '@act2do/component/language/zh-CN'

setConfig({
  trackTailUpdates: false
})

const messageAst = Object.keys(rcZhCN).reduce(
  (all: Record<string, MessageFormatElement[]>, k) => {
    all[k] = parse(rcZhCN[k])
    return all
  },
  {}
)

const intl = createIntl({ locale: 'zh-CN', messages: messageAst })

const App: React.FC = (): React.ReactElement => (
  <ReduxProvider store={store}>
    <RawIntlProvider value={intl}>
      <KeepAliveProvider>
        <RouterConfig />
      </KeepAliveProvider>
    </RawIntlProvider>
  </ReduxProvider>
)

export default hot(App)
