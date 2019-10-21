/**
 * 组装模块并暴露出来
 */

import {
    combineReducers
} from 'redux'

import commonReducer from './module/common/reducer'

const commonStore = combineReducers({
    common: commonReducer
})

export default commonStore

export {
    commonStore as common
}
