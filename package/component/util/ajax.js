/**
 * 编码成 urlencode
 * @param {Object} data - 传输的数据
 */
function formatParam(data) {
  const arr = []

  for (const name in data) {
    arr.push(
      `${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`
    )
  }

  // arr.push(('v=' + Math.random()).replace('.', ''))

  return arr.join('&')
}

/**
 * 转换 responseType 用于 xhr 的 overrideMimeType 方法
 */
function getResponseType(type) {
  switch (type) {
    case 'json':
      return 'application/json charset=utf-8'
    case 'text':
      return 'text/plain charset=utf-8'
    default:
      return 'text/plain charset=utf-8'
  }
}

/**
 * 打开 xhr 之后做的操作
 */
function afterOpenXHR({
  timeout,
  header,
  xhr
}) {
  const headerDataHub = Object.keys(header)

  if (headerDataHub.length > 0) {
    headerDataHub.forEach((item) => {
      xhr.setRequestHeader(item, header[item])
    })
  }

  xhr.timeout = timeout
}

/**
 * 创建 jsonp 的回调函数名字
 */
function generatejsonpCallbackName() {
  return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`
}

/**
 * 清理函数
 * @param {String} functionName
 */
function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName]
  } catch (e) {
    window[functionName] = undefined
  }
}

function removeScript(scriptId) {
  const script = document.getElementById(scriptId)

  if (script) {
    document.getElementsByTagName('head')[0].removeChild(script)
  }
}

/**
 *
 * @param {String} url - 请求地址
 * @param {Object} opt - 选项
 *                  charset
 *                  timeout
 *                  jsonpCallback
 *                  jsonpCallbackName
 */
const jsonp = function jsonp(url, {
  charset = '',
  timeout = 10000,
  data = {},
  jsonpCallback = 'callback',
  jsonpCallbackName = generatejsonpCallbackName()
} = {}) {
  let timeoutId
  const urlGettenParam = formatParam(data)

  return new Promise((resolve, reject) => {
    const scriptId = `${jsonpCallback}_${jsonpCallbackName}`

    window[jsonpCallbackName] = (response) => {
      resolve({
        ok: true,
        // keep consistent with fetch API
        json: () => Promise.resolve(response)
      })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      removeScript(scriptId)
      clearFunction(jsonpCallbackName)
    }

    // Check if the user set their own params, and if not add a ? to start a list of params
    url += (url.indexOf('?') === -1) ? '?' : '&'

    const jsonpScript = document.createElement('script')

    jsonpScript.setAttribute('src', `${url}${jsonpCallback}=${jsonpCallbackName}${urlGettenParam ? '&' + urlGettenParam : ''}`)

    if (charset) {
      jsonpScript.setAttribute('charset', charset)
    }

    jsonpScript.id = scriptId
    document.getElementsByTagName('head')[0].appendChild(jsonpScript)

    timeoutId = setTimeout(() => {
      reject(new Error(`JSONP request to ${url} timed out`))

      clearFunction(jsonpCallbackName)
      removeScript(scriptId)

      window[jsonpCallbackName] = () => {
        clearFunction(jsonpCallbackName)
      }
    }, timeout)

    // Caught if got 404/500
    jsonpScript.onerror = () => {
      reject(new Error(`JSONP request to ${url} failed`))

      clearFunction(jsonpCallbackName)
      removeScript(scriptId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  })
}

/**
 *
 * @param {Object} opt - 选项参数（同 jquery）
 *                     contentType - 可选 false 和 各种浏览器的 contentType 类型
 *                     dataType - 支持 XMLHttpRequest level 2 浏览器的 responseType 属性，不支持则只能选择（json | text）
 *                     gettenData - GET 请求的请求数据
 *                     header - 头部 header 的数据
 */
const ajax = ({
  type = 'GET',
  dataType = '',
  contentType = 'application/x-www-form-urlencoded',
  url = '',
  data = {},
  gettenData = {},
  header = {},
  withCredentials = true,
  cache = false,
  async = true,
  timeout = 10000
} = {}) => {
  if (!url) {
    console.warn('ajax 地址不能为空!')

    return false
  }

  type = type.toUpperCase()

  const xhr = new XMLHttpRequest()
  let param = ''

  const urlGettenParam = formatParam(gettenData)
  const timeStamp = cache ? '' : `t=${new Date().getTime()}${urlGettenParam ? `&${urlGettenParam}` : ''}`

  if (contentType) {
    if (contentType.includes('text/plain') || contentType.includes('application/json')) {
      param = JSON.stringify(data)
    } else if (contentType.includes('multipart/form-data')) {
      param = data
    } else {
      param = formatParam(data)
    }
  } else {
    param = data
  }

  return new Promise((resolve, reject) => {
    xhr.withCredentials = withCredentials

    // IE not support this state
    if (xhr.responseType !== undefined) {
      // IE 10/11 not support 'json', so change to string and JSON.parse
      if ('ActiveXObject' in window && dataType === 'json') {
        dataType = 'text'

        xhr.overrideMimeType && xhr.overrideMimeType(getResponseType(dataType))
      } else {
        try {
          xhr.responseType = dataType
        } catch (error) {
          console.warn(error)
        }
      }
    } else {
      dataType = 'text'

      xhr.overrideMimeType && xhr.overrideMimeType(getResponseType(dataType))
    }

    xhr.onreadystatechange = () => {
      //
    }

    xhr.onload = () => {
      const status = xhr.status

      if ((status >= 200 && status < 300) || xhr.status === 304) {
        let responseData = null

        if (dataType === 'json') {
          responseData = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response
        } else if (dataType === 'text' || dataType === '') {
          responseData = JSON.parse(xhr.responseText)
        } else {
          responseData = xhr.response
        }

        resolve({
          response: responseData,
          status
        })
      } else {
        resolve({
          statusText: xhr.statusText,
          status: xhr.status
        })
      }
    }

    xhr.onabort = () => {
      reject(new Error('abort'))
    }

    xhr.ontimeout = () => {
      reject(new Error('timeout'))
    }

    xhr.onerror = () => {
      reject(new Error('offline'))
    }

    if (type === 'GET') {
      xhr.open('GET', `${url}?${timeStamp}${param ? `&${param}` : ''}`, async)

      afterOpenXHR({
        header,
        timeout,
        xhr
      })

      xhr.send(null)
    } else if (type === 'POST') {
      xhr.open('POST', `${url}?${timeStamp}`, async)

      afterOpenXHR({
        header,
        timeout,
        xhr
      })

      if (contentType && contentType !== 'multipart/form-data') {
        xhr.setRequestHeader('Content-Type', contentType)
      }

      xhr.send(param)
    }
  })
}

/**
 *
 * @param {String} url
 * @param {Object} data
 */
const get = (url, data) => {
  return ajax({
    url,
    data
  })
}

/**
 *
 * @param {String} url
 * @param {Object} data
 */
const post = (url, data, opt) => {
  return ajax({
    url,
    type: 'post',
    data,
    ...opt
  })
}

export default ajax

export {
  ajax,
  get,
  post,
  jsonp
}
