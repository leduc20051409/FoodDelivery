import axios from "axios";

import { LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_REQUEST, REGISTER_SUCCESS, GET_USER_REQUEST, ADD_TO_FAVOURITE_REQUEST, LOGOUT, REGISTER_FAILURE, LOGIN_FAILURE, GET_USER_FAILURE, ADD_TO_FAVOURITE_FAILURE, GET_USER_SUCCESS, ADD_TO_FAVOURITE_SUCCESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE, LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE } from "./ActionType";
import { api, API_URL } from "../../../components/config/Api";
export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        } else {
            reqData.navigate("/");
        }
        dispatch({ type: REGISTER_SUCCESS, payload: data.token });
        console.log("register success", data);
    } catch (error) {
        dispatch({type: REGISTER_FAILURE, payload: error});
        console.log("error", error);

    }
}

export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
        if (data.token) {
            localStorage.setItem("token", data.token);
            //dispatch(getUser(data.token));
        }
        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        } else {
            reqData.navigate("/");
        }
        dispatch({ type: LOGIN_SUCCESS, payload: data.token });
        console.log("login success", data);
    } catch (error) {
        dispatch({type: LOGIN_FAILURE, payload: error});
        console.log("error", error);
    }
}

export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
        const { data } = await api.get(`/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("user profile", data);
    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: error });
        console.log("error", error);
    }
};




export const addToFavourite = ({restaurantId, jwt}) => async (dispatch) => {
    dispatch({ type: ADD_TO_FAVOURITE_REQUEST });
    try {
        const { data } = await api.put(`/api/restaurants/restaurant/${restaurantId}/add-favourites`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: ADD_TO_FAVOURITE_SUCCESS, payload: data });
        console.log("add to favourite", data);

    } catch (error) {
        dispatch({type: ADD_TO_FAVOURITE_FAILURE, payload: error});
        console.log("error", error);
    }
}
export const forgotPassword = (reqData) => async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    try {
        const { data } = await api.post(`/auth/forgot-password?email=${reqData.email}`);
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
        console.log("forgot password success", data);
    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error });
        console.log("error", error);
    }
}
export const resetPassword = ({token, newPassword}) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
        const { data } = await api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
        console.log("reset password success", data);
    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAILURE, payload: error });
        console.log("error", error);
    }
}

export const loginWithGoogle = ({ code, redirectUri, navigate }) => async (dispatch) => {
    dispatch({ type: LOGIN_GOOGLE_REQUEST });
    
    try {
        const { data } = await api.post(`/auth/google/callback`, {
            code,
            redirectUri,
        });

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        if (data.role === "ROLE_RESTAURANT_OWNER") {
            navigate("/admin/restaurant");
        } else {
            navigate("/");
        }
        dispatch({ type: LOGIN_GOOGLE_SUCCESS, payload: data.token });
        console.log("Login with Google success:", data);
    } catch (error) {
        dispatch({ type: LOGIN_GOOGLE_FAILURE, payload: error });
        console.log("Login with Google error:", error);
    }
};


export const logOut = () => async (dispatch) => {
    dispatch({ type: LOGOUT });
    try {
        localStorage.clear();
        dispatch({ type: LOGOUT });
        console.log("log out success");

    } catch (error) {
        console.log("error", error);
    }
}

