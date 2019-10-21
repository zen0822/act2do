import appConfig from './project.config'
import apiData from './api.json'
import getApi from '@act2do/build/util/getApi'

// release环境的uri
const prodUri = appConfig.apiUrl

const apiPath = getApi(apiData, prodUri)

export default apiPath

export {
  apiPath as api
}
