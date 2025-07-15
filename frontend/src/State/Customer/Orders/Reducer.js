
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_USERS_NOTIFICATION_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
} from "./ActionType";

const initialState = {
  loading: false,
  orders: [],
  error: null,
  notifications: [],
  currentOrder: null,
  paymentResponse: null,
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
        currentOrder: null,
        paymentResponse: null
      };

    case CREATE_ORDER_SUCCESS: {
      const isPaymentResponse = payload.payment_url || payload.payment_link_url || payload.paymentUrl;
      return {
        ...state,
        error: null,
        loading: false,
        currentOrder: isPaymentResponse ? null : payload, 
        paymentResponse: isPaymentResponse ? payload : null
      };
    }
    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        currentOrder: null,
        paymentResponse: null
      };
    case GET_USERS_ORDERS_REQUEST:
      return { ...state, error: null, loading: true };
    case GET_USERS_ORDERS_SUCCESS:
      return { ...state, error: null, loading: false, orders: payload };
    case GET_USERS_NOTIFICATION_SUCCESS:
      return { ...state, notifications: payload, error: null, loading: false };

    case GET_USERS_ORDERS_FAILURE:
      return { ...state, error: payload, loading: false };


    default:
      return state;
  }
};