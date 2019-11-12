import {
  isObject
} from './data/object'

/**
 * 为组件里面的类名增加组件前缀
 *
 * @param {*} prefx
 * @param {*} className - 类名
 */
const xclass = (prefix: string, className: string | Array<{ [key: string]: string }>): string => {
  const prefixClass = prefix

  if (Array.isArray(className)) {
    const classArr: Array<string> = []

    className.forEach((item) => {
      if (isObject(item)) {
        const classEle = Object.keys(item)

        classEle.forEach((classEleItem: string) => {
          if (item[classEleItem]) {
            classArr.push(`${prefixClass}-${classEleItem}`)
          }
        })
      } else {
        classArr.push(item ? `${prefixClass}-${item}` : prefixClass)
      }
    })

    return classArr.join(' ')
  } else {
    return className ? `${prefixClass}-${className}` : prefixClass
  }
}

/**
 * 根据条件生成 class
 *
 * @param {Object} opt - 选项（key => 类名，value => 如果为 true 生成此类名，反则不生成）
 */
const optClass = (opt: { [key: string]: string }): string => {
  const className: Array<string> = []
  const classKey = Object.keys(opt)

  classKey.forEach((item) => {
    if (opt[item]) {
      className.push(item)
    }
  })

  return className.join(' ')
}

/**
 * 根据条件生成 class 并添加组件前缀
 *
 * @param {Object} opt - 选项（key => 类名，value => 如果为 true 生成此类名，反则不生成）
 */
const optXclass = (prefix: string, opt: { [key: string]: string }): string => {
  const className: Array<string> = []
  const classKey = Object.keys(opt)

  classKey.forEach((item) => {
    if (opt[item]) {
      className.push(xclass(prefix, item))
    }
  })

  return className.join(' ')
}

export {
  xclass,
  optClass,
  optXclass
}
