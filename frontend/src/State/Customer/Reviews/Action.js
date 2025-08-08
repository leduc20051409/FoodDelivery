import { api } from "../../../components/config/Api";
import { CREATE_REVIEW_FAILURE, CREATE_REVIEW_REQUEST, CREATE_REVIEW_SUCCESS, DELETE_REVIEW_FAILURE, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, GET_REVIEW_BY_ORDER_ID_FAILURE, GET_REVIEW_BY_ORDER_ID_REQUEST, GET_REVIEW_BY_ORDER_ID_SUCCESS, GET_REVIEWS_BY_RESTAURANT_FAILURE, GET_REVIEWS_BY_RESTAURANT_REQUEST, GET_REVIEWS_BY_RESTAURANT_SUCCESS, GET_REVIEWS_BY_USER_FAILURE, GET_REVIEWS_BY_USER_REQUEST, GET_REVIEWS_BY_USER_SUCCESS, UPDATE_REVIEW_FAILURE, UPDATE_REVIEW_REQUEST, UPDATE_REVIEW_SUCCESS } from "./ActionType";

export const createReview = (orderId, reviewData, jwt) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_REVIEW_REQUEST });
        try {
            const { data } = await api.post(`/api/reviews/create?orderId=${orderId}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("created review data", data);
            dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: CREATE_REVIEW_FAILURE, payload: error });
        }
    };
}

export const getReviewsByRestaurant = (restaurantId) => {
    return async (dispatch) => {
        dispatch({ type: GET_REVIEWS_BY_RESTAURANT_REQUEST });
        try {
            const { data } = await api.get(`/restaurant/${restaurantId}/reviews`);
            console.log("reviews by restaurant data", data);
            dispatch({ type: GET_REVIEWS_BY_RESTAURANT_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: GET_REVIEWS_BY_RESTAURANT_FAILURE, payload: error });
        }
    };
}

export const getReviewsByUser = (userId, jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_REVIEWS_BY_USER_REQUEST });
        try {
            const { data } = await api.get(`/user/${userId}/reviews`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("reviews by user data", data);
            dispatch({ type: GET_REVIEWS_BY_USER_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: GET_REVIEWS_BY_USER_FAILURE, payload: error });
        }
    };
}

export const updateReview = (reviewId, reviewData, jwt) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_REVIEW_REQUEST });
        try {
            const { data } = await api.put(`/api/reviews/edit?reviewId=${reviewId}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("updated review data", data);
            dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: UPDATE_REVIEW_FAILURE, payload: error });
        }
    };
}

export const getReviewByOrderId = (orderId, jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_REVIEW_BY_ORDER_ID_REQUEST });
        try {
            const { data } = await api.get(`/api/reviews/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("review by order id", data);
            dispatch({ type: GET_REVIEW_BY_ORDER_ID_SUCCESS, payload: data });
            return data; // Return data for immediate use in the component
        } catch (error) {
            console.log("error fetching review by order id", error);
            dispatch({ type: GET_REVIEW_BY_ORDER_ID_FAILURE, payload: error });
            throw error; // Throw error to be caught in the component
        }
    };
};

export const deleteReview = (reviewId, jwt) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        try {
            const { data } = await api.delete(`/api/reviews/delete/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("deleted review data", data);
            dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: DELETE_REVIEW_FAILURE, payload: error });
        }
    };
}

