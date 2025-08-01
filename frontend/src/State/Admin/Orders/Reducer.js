// reducers.js
import {
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  GET_RESTAURANTS_ORDER_REQUEST,
  GET_RESTAURANTS_ORDER_SUCCESS,
  GET_RESTAURANTS_ORDER_FAILURE,
  SEARCH_ORDERS_REQUEST,
  SEARCH_ORDERS_SUCCESS,
  SEARCH_ORDERS_FAILURE,
} from "./ActionType.js";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  searchResults: [],
  isSearching: false
};

const restaurantsOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANTS_ORDER_REQUEST:
    case UPDATE_ORDER_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case SEARCH_ORDERS_REQUEST:
      return { ...state, isSearching: true, error: null };

    case GET_RESTAURANTS_ORDER_SUCCESS:
      return { ...state, loading: false, orders: action.payload };

    case UPDATE_ORDER_STATUS_SUCCESS: {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      return { ...state, loading: false, orders: updatedOrders };
    }

    case SEARCH_ORDERS_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload
      };

    case GET_RESTAURANTS_ORDER_FAILURE:
    case UPDATE_ORDER_STATUS_FAILURE:
      return { ...state, loading: false, error: action.error };
     case SEARCH_ORDERS_FAILURE:
      return { ...state, isSearching: false, error: action.error };
      
    default:
      return state;
  }
};

export default restaurantsOrderReducer;