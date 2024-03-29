import React, {
  ReactElement,
  FC
} from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import loadable from '@loadable/component'
import LoadingComp from '@act2do/component/module/Loading/Loading'

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

class ErrorBoundary extends React.PureComponent {
  constructor(props: object) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): any {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any): void {
    console.error('zen:', error, errorInfo)
  }

  render(): any {
    if ((this.state as any).hasError) {
      return (
        <div>网络错误！！！</div>
      )
    }

    return this.props.children
  }
}

const loadableWrap = (Comp: any): FC => {
  const WrapComp: FC = (props: object): ReactElement => (
    <Comp fallback={Loading} {...props} />
  )

  return WrapComp
}

const PageHome = loadable(() => import(/* webpackChunkName: 'page-home' */ '../src/page/PageHome/PageHome'))
const PageDetail = loadable(() => import(/* webpackChunkName: 'page-detail' */ '../src/page/Detail/Detail'))
const NotFound = loadable(() => import(/* webpackChunkName: 'page-not-found' */ '../src/page/NotFound/NotFound'))

const RouterConfig: React.FC = (): React.ReactElement => (
  <ErrorBoundary>
    <Switch>
      <Route component={loadableWrap(PageHome)} exact path='/' />
      <Route component={loadableWrap(PageDetail)} exact path='/detail' />
      <Route component={loadableWrap(NotFound)} path='*' />
    </Switch>
  </ErrorBoundary>
)

export default RouterConfig
