import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storeModal, { ModalState } from './modal/reducer'
import storeMessage, { MessageState } from './message/reducer'

interface AppState {
  modal: ModalState
  message: MessageState
}

const persistConfig = {
  key: 'act2do',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['message', 'modal']
}

const reducersCells = combineReducers({
  modal: storeModal,
  message: storeMessage
})

const rootReducer = persistReducer<AppState>(persistConfig, reducersCells)
type State = ReturnType<typeof rootReducer>

const middlewares = [thunkMiddleware]
const middleWareEnhancer = applyMiddleware(...middlewares)

const store = createStore(
  rootReducer,
  composeWithDevTools(middleWareEnhancer)
)
const persistor = persistStore(store)

export {
  store,
  persistor,
  State,
  rootReducer
}
