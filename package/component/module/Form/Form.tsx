/**
 * Form 组件
 *
 * @prop {string} className - 添加类
 * @prop {array} initHub - 添加表单控件
 */

import './Form.scss'

import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  ReactElement,
  RefForwardingComponent
} from 'react'
import { xclass } from '../../util/comp'

type TProp = React.HTMLProps<HTMLDivElement> & {
  className?: string
  verify?: boolean
  initHub?: Array<any>
}
type Api = {
  val(): any
  mapControl(): { value: any, verified: boolean }
}

// 组件名字
const compName = 'form'
// 表单控件的组件名字
const controlName = ['input', 'menu', 'check', 'areaPicker', 'upload']

const _xclass = (className: string | void): string => {
  return xclass(compName, className)
}

const Form: RefForwardingComponent<Api, TProp> = ({
  className = '',
  initHub = [],
  children
}, ref): ReactElement => {
  const valueRef = useRef({}) // 表单控件的值
  const controlRef = useRef<Array<any>>([])
  const preInitHubRef = useRef<Array<any>>([]) // 上一个 hub 值

  /**
   * 初始化表单组件
   */
  function initForm(): void {
    const controlHub: Array<any> = []

    initHub.forEach((item) => {
      controlName.forEach((controlName) => {
        if (controlName === item.current.compName) {
          controlHub.push(item)
        }
      })
    })

    controlRef.current = controlHub
  }

  /**
   * 遍历传进来的表单控件的值和表单是否全部验证正确
   *
   * @return {object} -
   *                   verified: 表单是否全部验证正确
   *                   value: 表单值
   */
  function mapControl(): { value: any, verified: boolean } {
    let verified = true

    controlRef.current.every((item) => {
      const ref = item.current

      if (!controlName.includes(ref.compName)) {
        return false
      }

      if (ref.param) {
        switch (ref.compName) {
          case 'check':
            valueRef.current = {
              ...valueRef.current,
              [ref.param]: ref.val()
            }

            return true
          case 'areaPicker':
          case 'menu':
          default:
            if (ref.verify()) {
              valueRef.current = {
                ...valueRef.current,
                [ref.param]: ref.val()
              }

              return true
            }

            verified = false

            return false
        }
      }

      return true
    })

    return {
      value: valueRef.current,
      verified
    }
  }

  /**
   * 获取表单的值
   */
  function val(): any {
    return mapControl().value
  }

  useImperativeHandle(ref, () => ({
    val,
    mapControl
  }))

  if (initHub.length !== preInitHubRef.current.length) {
    preInitHubRef.current = [...initHub]
    initForm()
  }

  return (
    <div className={`${_xclass()} ${className}`}>
      <form>
        {children}
      </form>
    </div>
  )
}

export default forwardRef(Form)

export {
  Api
}
