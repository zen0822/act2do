/**
 * [description] 添cookie
 *
 * @param  {[type]} name         cookie名称
 * @param  {[type]} value        cookie值
 * @param  {[type]} expiresHours 有效时间小时
 * @return {[type]}              [description]
 */
const addCookie = (name, value, expiresHours, domain) => {
  let cookieString = name + '=' + escape(value) + ';domain' + '=' + domain

  if (expiresHours > 0) {
    const date = new Date()

    date.setTime(date.getTime() + expiresHours * 3600 * 1000)
    cookieString = cookieString + '; expires=' + date.toGMTString()
  }

  document.cookie = cookieString
}

/**
 * [description] 获取设置cookie
 *
 * @param  {[type]} name [description] cookie名称
 * @return {[type]}      [description] cookie值
 *
 */
const getCookie = (name, cookies = document.cookie) => {
  return decodeURIComponent(cookies.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
}

/**
 * [description] 删除cookie
 *
 * @param  {[type]} name [description] cookie名称
 * @return {[type]}      [description]
 */
const delCookie = (name) => {
  const date = new Date()

  date.setTime(date.getTime() - 10000)
  document.cookie = name + '=v; expires=' + date.toGMTString()
}

const setCookie = function (name, value, expireMin, domain) {
  if (!domain) {
    domain = location.hostname
  }
  if (arguments.length > 2) {
    const expireTime = new Date(new Date().getTime() + parseInt(expireMin * 60 * 1000))
    document.cookie = name + '=' + escape(value) + '; path=/; domain=' + domain + '; expires=' + expireTime.toGMTString()
  } else {
    document.cookie = name + '=' + escape(value) + '; path=/; domain=' + domain
  }
}
module.exports = {
  addCookie,
  getCookie,
  delCookie,
  setCookie
}
