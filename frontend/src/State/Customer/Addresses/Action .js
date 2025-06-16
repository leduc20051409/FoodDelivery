import { api } from "../../../components/config/Api";
import { ADD_ADDRESS_FAILURE, ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS, GET_ADDRESSES_FAILURE, GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, UPDATE_ADDRESS_FAILURE, UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS } from "./ActionType";

export const getAddresses = (jwt) => async (dispatch) => {
    dispatch({ type: GET_ADDRESSES_REQUEST });
    try {
        const { data } = await api.get("/api/users/addresses", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: GET_ADDRESSES_SUCCESS, payload: data });
        console.log("Addresses fetched successfully", data);
    } catch (error) {
        dispatch({ type: GET_ADDRESSES_FAILURE, payload: error });
        console.log("Error fetching addresses", error);
    }
}
export const addAddress = (addressData, jwt) => async (dispatch) => {
    dispatch({ type: ADD_ADDRESS_REQUEST });
    try {
        const { data } = await api.post("/api/users/addresses/add-address", addressData, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: ADD_ADDRESS_SUCCESS, payload: data });
        console.log("Address added successfully", data);
    } catch (error) {
        dispatch({ type: ADD_ADDRESS_FAILURE, payload: error });
        console.log("Error adding address", error);
    }
};

export const updateAddress = (addressId, addressData, jwt) => async (dispatch) => {
    dispatch({ type: UPDATE_ADDRESS_REQUEST });
    try {
        const { data } = await api.put(`/api/users/addresses/${addressId}/update`, addressData, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: data });
        console.log("Address updated successfully", data);
    } catch (error) {
        dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: error });
        console.log("Error updating address", error);
    }
};