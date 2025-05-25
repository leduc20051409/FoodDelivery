import axios from "axios";
import { api, API_URL } from "../../config/Api";
import { LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_REQUEST, REGISTER_SUCCESS, GET_USER_REQUEST, ADD_TO_FAVOURITE_REQUEST, LOGOUT, REGISTER_FAILURE, LOGIN_FAILURE, GET_USER_FAILURE, ADD_TO_FAVOURITE_FAILURE, GET_USER_SUCCESS, ADD_TO_FAVOURITE_SUCCESS } from "./ActionType";
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

