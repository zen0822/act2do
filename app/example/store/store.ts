import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storeCommon from './common/reducer'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}

const reducersCells = combineReducers({
  common: storeCommon
}) as any

export const rootReducer = persistReducer(persistConfig, reducersCells)

export type AppState = ReturnType<typeof rootReducer>

const middlewares = [thunkMiddleware]
const middleWareEnhancer = applyMiddleware(...middlewares)

const store = createStore(
  rootReducer,
  composeWithDevTools(middleWareEnhancer)
)
const persistor = persistStore(store)

export {
  store,
  persistor
}
