import Modal, { Api } from './Modal'
import { Api as AlertApi } from './AlertComp'
import { Api as ConfirmApi } from './ConfirmComp'
import alert from './alert'
import confirm from './confirm'

export type Api = Api
export type AlertApi = AlertApi
export type ConfirmApi = ConfirmApi
export type ModalApi = Api

export default Modal
export {
  Modal,
  alert,
  confirm
}
