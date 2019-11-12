/*
 * action 创建函数
 */
import { AnyAction } from 'redux'

export const ADD_ADDRESS_ID = 'ADD_ADDRESS_ID'

export const addAddressId = (addressId: number): AnyAction => {
  return {
    type: ADD_ADDRESS_ID,
    addressId
  }
}
