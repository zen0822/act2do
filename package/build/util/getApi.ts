import { deepReplaceVal } from '@act2do/component/util/data/object'

const apiPath = function getApiPath(apiData, apiPrefix): any {
  return deepReplaceVal({
    obj: apiData,
    cb(apiUrl) {
      if (/^(http|https|\/\/)/.test(apiUrl)) {
        return apiUrl
      }

      return `${apiPrefix}${apiUrl}`
    }
  })
}

export default apiPath

export {
  apiPath as api
}
