// actions.js
import axios from "axios";
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
import { api } from "../../../components/config/Api.js";


export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

      const response = await api.put(
        `/api/admin/orders/order/${orderId}/${orderStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      );

      const updatedOrder = response.data;

      console.log("udpdated order ", updatedOrder);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: updatedOrder,
      });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, error });
    }
  };
};

export const fetchRestaurantsOrder = ({ restaurantId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_RESTAURANTS_ORDER_REQUEST });

      const { data } = await api.get(
        `/api/admin/orders/restaurant/${restaurantId}`, {
        params: { orderStatus: orderStatus },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      );

      const orders = data;
      console.log("restaurants order ------ ", orders);
      dispatch({
        type: GET_RESTAURANTS_ORDER_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_ORDER_FAILURE, error });
    }
  };
};

export const searchOrders = ({ search, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_ORDERS_REQUEST });

      const { data } = await api.get(
        `/api/admin/orders/search`, {
        params: { search: search },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      );
      const orders = data;
      console.log("searched orders ------ ", orders);
      dispatch({
        type: SEARCH_ORDERS_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      dispatch({ type: SEARCH_ORDERS_FAILURE, error });
    }
  };
}