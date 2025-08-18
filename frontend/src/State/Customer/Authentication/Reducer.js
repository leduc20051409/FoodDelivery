

import { isPresentInFavourites } from "../../../components/config/Logic";
import { REGISTER_REQUEST, LOGIN_REQUEST, GET_USER_REQUEST, ADD_TO_FAVOURITE_REQUEST, REGISTER_SUCCESS, LOGIN_SUCCESS, REGISTER_FAILURE, LOGIN_FAILURE, GET_USER_FAILURE, ADD_TO_FAVOURITE_FAILURE, GET_USER_SUCCESS, LOGOUT, ADD_TO_FAVOURITE_SUCCESS, SET_SELECTED_ADDRESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE, LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_FAILURE, LOGIN_GOOGLE_SUCCESS } from "./ActionType";
const initialState = {
    user: null,
    error: null,
    jwt: localStorage.getItem("token"),
    favorites: [],
    success: null,
    isLoading: false,
    selectedAddress: null
};


export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVOURITE_REQUEST:
        case RESET_PASSWORD_REQUEST:
        case FORGOT_PASSWORD_REQUEST:
        case LOGIN_GOOGLE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: null
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload);
            return {
                ...state,
                isLoading: false,
                jwt: action.payload,
                success: "Register success"
            };
        case GET_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                user: action.payload,
                favorites: action.payload.favorites
            };
        case ADD_TO_FAVOURITE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                favorites: isPresentInFavourites(state.favorites, action.payload)
                    ? state.favorites.filter((item) => item.id !== action.payload.id)
                    : [...state.favorites, action.payload]
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: "Email sent successfully",
                error: null
            }
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: "Password reset successfully",
                error: null
            }
        case LOGIN_GOOGLE_SUCCESS:
            localStorage.setItem("token", action.payload);
            return {
                ...state,
                isLoading: false,
                jwt: action.payload,    
                success: "Login success"
            };
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case ADD_TO_FAVOURITE_FAILURE:
        case RESET_PASSWORD_FAILURE:
        case FORGOT_PASSWORD_FAILURE:
        case LOGIN_GOOGLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            };
        case SET_SELECTED_ADDRESS:
            return {
                ...state,
                selectedAddress: action.payload
            };

        case LOGOUT:
            localStorage.removeItem("token");
            return initialState;
        default:
            return state;
    }
};
