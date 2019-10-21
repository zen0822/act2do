import compConf from '../config.json'
import {
  isObject
} from './data/object'

const compPrefix = compConf.prefix

/**
 * 为组件里面的类名增加组件前缀
 *
 * @param {*} className
 * @param {*} comp - 不加上组件的前缀
 */
const xclass = (compName, className, comp = false) => {
  const compPrefixClass = comp ? compName : `${compPrefix}-${compName}`

  if (Array.isArray(className)) {
    const classArr = []

    className.forEach((item) => {
      if (isObject(item)) {
        const classEle = Object.keys(item)

        classEle.forEach((classEleItem) => {
          if (item[classEleItem]) {
            classArr.push(`${compPrefixClass}-${classEleItem}`)
          }
        })
      } else {
        classArr.push(item ? `${compPrefixClass}-${item}` : compPrefixClass)
      }
    })

    return classArr.join(' ')
  } else {
    return className ? `${compPrefixClass}-${className}` : compPrefixClass
  }
}

/**
 * 根据条件生成 class
 *
 * @param {Object} opt - 选项（key => 类名，value => 如果为 true 生成此类名，反则不生成）
 */
const optClass = (opt) => {
  const className = []
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
const optXclass = (prefix, opt) => {
  const className = []
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
