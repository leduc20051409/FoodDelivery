
import { isPresentInFavourites } from "../../config/Logic";
import { REGISTER_REQUEST, LOGIN_REQUEST, GET_USER_REQUEST, ADD_TO_FAVOURITE_REQUEST, REGISTER_SUCCESS, LOGIN_SUCCESS, REGISTER_FAILURE, LOGIN_FAILURE, GET_USER_FAILURE, ADD_TO_FAVOURITE_FAILURE, GET_USER_SUCCESS, LOGOUT, ADD_TO_FAVOURITE_SUCCESS } from "./ActionType";
const initialState = {
    user: null,
    error: null,
    jwt: localStorage.getItem("token"),
    favorites: [],
    success: null,
    isLoading: false
};


export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVOURITE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: null
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
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
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case ADD_TO_FAVOURITE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};
