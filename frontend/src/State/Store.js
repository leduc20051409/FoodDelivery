import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { authReducer } from './Customer/Authentication/Reducer'
import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import restaurantReducer from './Customer/Restaurant/Reducer'

import { orderReducer } from './Customer/Orders/Reducer'
import { ingredientReducer } from './Customer/Ingredients/Reducer'
import restaurantsOrderReducer from './Admin/Orders/Reducer'
import cartReducer from './Customer/Cart/Reducer'
import menuItemReducer from './Customer/Menu/Reducer'

const rooteReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  cart: cartReducer,
  order: orderReducer,
  ingredient: ingredientReducer,
  restaurantOrder: restaurantsOrderReducer,
})

export const store = legacy_createStore(rooteReducer, applyMiddleware(thunk));