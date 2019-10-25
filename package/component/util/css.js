/**
 * 判断支持 css4
 */

const css4 = window.CSS && window.CSS.supports && window.CSS.supports('--a', 0)

export {
  css4
}
