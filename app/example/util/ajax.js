/**
 * returnUrl 登录成功返回的地址
 * tip 请求失败弹框提示
 */

import Tip from '@act2do/component/src/Message/tip'
import {
  ajax as ajaxUtil
} from '@act2do/component/util/ajax'
import {
  getCookie
} from '@act2do/component/util/cookie'

/**
 * xhr 请求
 *
 * @param {*} opt
 */
const ajax = async (opt = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId = ''
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let sessionId = ''
  let ajaxResponse = null
  const jsHost = localStorage.getItem('jsHost')

  if (jsHost === 'OnethingCloud') {
    userId = getCookie('userid')
    sessionId = getCookie('sessionid')
  } else {
    userId = localStorage.getItem('userId')
    sessionId = localStorage.getItem('sessionId')
  }

  try {
    const ajaxRtn = await ajaxUtil({
      ...opt,
      gettenData: {
        visitorid: localStorage.getItem('visitorId'),
        version: localStorage.getItem('wankeMallVersion'),
        source: localStorage.getItem('mallSource'),
        ...opt.gettenData
      },
      dataType: 'json'
    })

    ajaxResponse = ajaxRtn.response
  } catch (error) {
    switch (error.message) {
      case 'timeout':
        opt.tip && Tip('网络连接超时\n请检查网络后重试')
        break
      case 'abort':
      case 'offline':
      default:
        // window.location.reload()
        opt.tip && Tip('网络未连接\n请检查网络后重试')
        break
    }

    // replaceErrorPage()
  }

  return new Promise((resolve, reject) => {
    if (ajaxResponse.iRet === 0 || ajaxResponse.code === 0) {
      resolve(ajaxResponse)
    } else if (ajaxResponse.iRet === 403 || ajaxResponse.code === 403) {
      // 登录态失效
      if (jsHost === 'OnethingCloud') {
        Tip('登录态失效！')
      }
    } else {
      reject(ajaxResponse)
    }
  })
}

const get = (url, data, {
  tip = true,
  contentType,
  returnUrl,
  header
} = {}) => {
  return ajax({
    type: 'get',
    contentType,
    url,
    data,
    tip,
    header,
    returnUrl
  })
}

const post = (url, data, {
  tip = true,
  contentType,
  returnUrl,
  header
} = {}) => {
  return ajax({
    type: 'post',
    url,
    contentType,
    data: {
      ...data
    },
    header,
    tip,
    returnUrl
  })
}

/**
 * 用户系统专用请求工具
 */
const userSystemPost = (url, data, {
  tip = true,
  contentType,
  returnUrl
} = {}) => {
  return ajax({
    type: 'post',
    url,
    contentType,
    data: {
      ...data
    },
    tip,
    returnUrl
  })
}

export default ajax

export {
  ajax,
  post,
  get,
  userSystemPost
}
