import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { authReducer } from './Customer/Authentication/Reducer'
import { thunk } from 'redux-thunk'
import restaurantReducer from './Customer/Restaurant/Reducer'
import { orderReducer } from './Customer/Orders/Reducer'
import { ingredientReducer } from './Customer/Ingredients/Reducer'
import restaurantsOrderReducer from './Admin/Orders/Reducer'
import cartReducer from './Customer/Cart/Reducer'
import menuItemReducer from './Customer/Menu/Reducer'
import { addressReducer } from './Customer/Addresses/Reducer'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from 'redux-persist/lib/storage'
import reviewReducer from './Customer/Reviews/Reducer'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'addresses']
}

const rooteReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  cart: cartReducer,
  order: orderReducer,
  ingredient: ingredientReducer,
  restaurantOrder: restaurantsOrderReducer,
  addresses: addressReducer,
  review: reviewReducer
})

const persistedReducer = persistReducer(persistConfig, rooteReducer);

export const store = legacy_createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);