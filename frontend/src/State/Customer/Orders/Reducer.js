
import {
  CANCEL_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CLEAR_ORDER_STATE,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_USERS_NOTIFICATION_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  UPDATE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  VERIFY_PAYMENT_FAILURE,
  VERIFY_PAYMENT_REQUEST,
  VERIFY_PAYMENT_SUCCESS,
} from "./ActionType";

const initialState = {
  loading: false,
  orders: [],
  error: null,
  notifications: [],
  currentOrder: null,
  paymentResponse: null,
  paymentVerification: {
    loading: false,
    verified: false,
    error: null,
  },
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_ORDER_REQUEST:
    case UPDATE_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
        currentOrder: null,
        paymentResponse: null
      };

    case VERIFY_PAYMENT_REQUEST:
      return {
        ...state,
        paymentVerification: {
          ...state.paymentVerification,
          loading: true,
          error: null
        }
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

    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        orders: state.orders.map(order =>
          order.id === payload.id ? { ...order, status: 'CANCELLED' } : order
        ),
        currentOrder: null,
        paymentResponse: null
      };

    case VERIFY_PAYMENT_SUCCESS:
      return {
        ...state,
        paymentVerification: {
          loading: false,
          verified: true,
          error: null
        },
        currentOrder: payload.order || null
      };
    case CREATE_ORDER_FAILURE:
    case UPDATE_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        currentOrder: null,
        paymentResponse: null
      };
    case VERIFY_PAYMENT_FAILURE:
      return {
        ...state,
        paymentVerification: {
          loading: false,
          verified: false,
          error: payload
        }
      };
    case GET_USERS_ORDERS_REQUEST:
      return { ...state, error: null, loading: true };
    case GET_USERS_ORDERS_SUCCESS:
      return { ...state, error: null, loading: false, orders: payload };
    case GET_USERS_NOTIFICATION_SUCCESS:
      return { ...state, notifications: payload, error: null, loading: false };

    case GET_USERS_ORDERS_FAILURE:
      return { ...state, error: payload, loading: false };

    case CLEAR_ORDER_STATE:
      return {
        ...state,
        currentOrder: null,
        paymentResponse: null,
        error: null,
        paymentVerification: {
          loading: false,
          verified: false,
          error: null
        }
      };

    default:
      return state;
  }
};