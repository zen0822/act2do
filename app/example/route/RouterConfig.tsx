import React from 'react'
import { Router } from '@reach/router'
import loadable from '@loadable/component'
import LoadingComp from '@act2do/component/src/Loading/Loading'

const Loading = (
  <div style={{
    height: window.innerHeight,
    position: 'relative'
  }}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        height: '30px',
        width: '30px'
      }}
    >
      <LoadingComp display />
    </div>
  </div>
)

const PageHome = loadable(
  () => import('../src/page/PageHome/PageHome'),
  { fallback: Loading }
)

const PageDetail = loadable(
  () => import('../src/page/Detail/Detail'),
  { fallback: Loading }
)

const NotFound = loadable(
  () => import('../src/page/NotFound/NotFound'),
  { fallback: Loading }
)

const RouterConfig: React.FC = (): React.ReactElement => (
  <Router>
    <PageHome path='/' />
    <PageDetail path='detail' />
    <NotFound default />
  </Router>
)

export default RouterConfig
