/*
 * action 创建函数
 */
import { Dispatch } from 'redux'
export const ADD_OFFLINE_IMG = 'ADD_OFFLINE_IMG'

export const addOfflineImg = (img: string) => async (dispatch: Dispatch): Promise<any> => {
  try {
    dispatch({
      type: ADD_OFFLINE_IMG,
      offlineImg: img
    })
  } catch (error) {
    console.log(error)
  }
}
