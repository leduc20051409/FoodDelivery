import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { authReducer } from '../../State/Customer/Authentication/Reducer'
import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import restaurantReducer from '../../State/Customer/Restaurant/Reducer'

import { orderReducer } from '../../State/Customer/Orders/Reducer'
import { ingredientReducer } from '../../State/Ingredients/Reducer'
import restaurantsOrderReducer from '../../State/Admin/Orders/Reducer'
import cartReducer from '../../State/Customer/Cart/Reducer'
import menuItemReducer from '../../State/Menu/Reducer'

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