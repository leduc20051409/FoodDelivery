


import { api } from "../../../components/config/Api";
import {
    CREATE_MENU_ITEM_FAILURE,
    CREATE_MENU_ITEM_REQUEST,
    CREATE_MENU_ITEM_SUCCESS,
    DELETE_MENU_ITEM_FAILURE,
    DELETE_MENU_ITEM_REQUEST,
    DELETE_MENU_ITEM_SUCCESS,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
    SEARCH_MENU_ITEM_FAILURE,
    SEARCH_MENU_ITEM_REQUEST,
    SEARCH_MENU_ITEM_SUCCESS,
    UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
    UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST,
    UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS,
} from "./ActionType";

// localhost:5454/api/admin/ingredients/food/16

export const createMenuItem = ({ menu, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.post("api/admin/food", menu,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
            console.log("created menu ", data);
            dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
        } catch (error) {
            console.log("catch error ", error);
            dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: error });
        }
    };
};

export const getMenuItemsByRestaurantId = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
        try {
            let queryParams = [];

            if (reqData.isVegetarian !== undefined) queryParams.push(`isVegetarian=${reqData.isVegetarian}`);
            if (reqData.isNonVegetarian !== undefined) queryParams.push(`isNonVegetarian=${reqData.isNonVegetarian}`);
            if (reqData.isSeasonal !== undefined) queryParams.push(`isSeasonal=${reqData.isSeasonal}`);
            if (reqData.foodCategory) queryParams.push(`foodCategory=${reqData.foodCategory}`);

            const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

            const { data } = await api.get(`/food/restaurant/${reqData.restaurantId}${queryString}`);

            console.log("menu item by restaurants ", data);
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error });
        }
    };
};

export const searchMenuItem = ({ keyword, restaurantId }) => {
    return async (dispatch) => {
        dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
        try {
            let url = `food/search?keyword=${keyword}`;
            // Only add restaurantId if it's provided and not null
            if (restaurantId) {
                url += `&restaurantId=${restaurantId}`;
            }
            const { data } = await api.get(url);
            dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SEARCH_MENU_ITEM_FAILURE });
            console.log("menu item search error ", error);
        }
    };
};


export const getAllIngredientsOfMenuItem = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
        try {
            const { data } = await api.get(
                `api/food/restaurant/${reqData.restaurantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`,
                    },
                }
            );
            console.log("menu item by restaurants ", data);
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error });
        }
    };
};

export const updateMenuItemsAvailability = ({ foodId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
        try {
            const { data } = await api.put(`/api/admin/food/${foodId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("update menuItems Availability ", data);
            dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
        } catch (error) {
            console.log("error ", error)
            dispatch({
                type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
                payload: error,
            });
        }
    };
};

export const deleteFoodAction = ({ foodId, jwt }) => async (dispatch) => {
    dispatch({ type: DELETE_MENU_ITEM_REQUEST });
    try {
        const { data } = await api.delete(`/api/admin/food/${foodId}/delete`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        console.log("delete food ", data);
        dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
    } catch (error) {
        dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
    }
};