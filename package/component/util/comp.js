import compConf from '../config.json'
import {
  xclass as xclassUtil,
  optClass as optClassUtil,
  optXclass as optXclassUtil
} from './className'

const compPrefix = compConf.prefix

/**
 * 为组件里面的类名增加组件前缀
 *
 * @param {*} className
 * @param {*} prefix - 加上组件的前缀
 */
const xclass = (compName, className = '', prefix = true) => {
  const compPrefixClass = prefix ? `${compPrefix}-${compName}` : compName

  return xclassUtil(compPrefixClass, className)
}

/**
 * 根据条件生成 class
 *
 * @param {Object} opt - 选项（key => 类名，value => 如果为 true 生成此类名，反则不生成）
 */
const optClass = (opt) => {
  return optClassUtil(opt)
}

/**
 * 根据条件生成 class 并添加组件前缀
 *
 * @param {Object} opt - 选项（key => 类名，value => 如果为 true 生成此类名，反则不生成）
 */
const optXclass = (compName, opt, prefix = true) => {
  return optXclassUtil(`${prefix ? `${compPrefix}-` : ''}${compName}`, opt)
}

export {
  xclass,
  optClass,
  optXclass
}
