
import { api } from "../../../components/config/Api";
import { PaymentService } from "../../../services/PaymentService";
import { CANCEL_ORDER_FAILURE, CANCEL_ORDER_REQUEST, CANCEL_ORDER_SUCCESS, CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_NOTIFICATION_REQUEST, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionType";
import { GET_USERS_NOTIFICATION_FAILURE, GET_USERS_NOTIFICATION_SUCCESS } from "./ActionType";


export const createOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST });
        try {
            const { data } = await api.post('/api/orders/order', reqData.order, {
                headers: {
                    Authorization: `Bearer ${reqData.token}`,
                },
            });
            const paymentMethod = reqData.order.paymentMethod;
            if (paymentMethod === 'CASH_ON_DELIVERY') {
                dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
                if (reqData.navigate) {
                    reqData.navigate('/my-profile/orders', { state: { order: data } });
                }
            } else {
                const paymentUrl = data.payment_url || data.payment_link_url || data.paymentUrl;

                if (paymentUrl) {
                    PaymentService.redirectToPayment(paymentUrl);
                } else {
                    console.error('Payment URL not found in response');
                    throw new Error('Payment URL not found in response');
                }
                console.log("created order data", data)
                dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
            }
        } catch (error) {
            console.log("error ", error)
            dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
        }
    };
};

export const cancelOrder = (orderId, jwt) => {
    return async (dispatch) => {
        dispatch({ type: CANCEL_ORDER_REQUEST });
        try {
            const { data } = await api.put(`/api/orders/order/cancel/${orderId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("cancelled order data", data);
            dispatch({ type: CANCEL_ORDER_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: CANCEL_ORDER_FAILURE, payload: error });
        }
    };
};


export const getUsersOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_ORDERS_REQUEST });
        try {
            const { data } = await api.get(`/api/orders/order/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("users order ", data)
            dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: error });
        }
    };
};


export const getUsersNotificationAction = () => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_NOTIFICATION_REQUEST });
        try {
            const { data } = await api.get('/api/notifications');

            console.log("all notifications ", data)
            dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error)
            dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
        }
    };
};