/**
 * js 宿主里面的相关方法
 */

// 浏览器判断
const jsHost = (type) => {
  const u = navigator.userAgent.toLowerCase()
  const versions = { // 移动终端浏览器版本信息
    trident: u.indexOf('trident') > -1, // IE内核
    presto: u.indexOf('presto') > -1, // opera内核
    webKit: u.indexOf('appleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/appleWebKit.*mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), // ios终端
    android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, // android终端或者uc浏览器
    iPhone: u.indexOf('iphone') > -1 || u.indexOf('mac') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('ipad') > -1, // 是否iPad
    iPod: u.indexOf('ipod') > -1,
    webApp: u.indexOf('safari') === -1, // 是否web应该程序，没有头部与底部
    wx: u.indexOf('micromessenger') > -1,
    nokia: u.indexOf('nokia') > -1,
    pcwx: u.indexOf('windowswechat') > -1,
    pc: !/Android|iPhone|SymbianOS|Windows\s+Phone|iPad|iPod/i.test(u),
    // ie: u.indexOf('msie') > -1,
    ie: (u.indexOf('msie') > -1 || u.indexOf('edge') > -1 || u.indexOf('trident') > -1) && u.indexOf('opera') === -1,
    x5: u.indexOf('mqqbrowser') > -1,
    weibo: u.indexOf('weibo') > -1 || u.indexOf('Weibo') > -1,
    iphoneX: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/) && screen.height >= 812, // ios终端
    iphone5: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/) && screen.height === 568 // ios终端
  }

  return versions[type]
}

/**
 * 修复当在 ios 8~10 时 localStorage 不能使用的问题
 */
// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
const testLocalStorage = () => {
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', 1)
      localStorage.removeItem('localStorage')
    } catch (e) {
      Storage.prototype._setItem = Storage.prototype.setItem
      Storage.prototype.setItem = function () { }
      alert('您的浏览器暂时不支持存储本地数据的功能，如果是 safari ios 8~10 的话，则不要使用无痕模式浏览！')
    }
  }
}

/**
 * 解析 userAgent 值
 *
 * @return Object
 */
const parseUA = () => {
  const userAgent = navigator.userAgent

  userAgent.replace(/ /g, () => { })
}

export {
  jsHost,
  testLocalStorage,
  parseUA
}
