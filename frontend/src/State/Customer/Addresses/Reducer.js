import { ADD_ADDRESS_FAILURE, ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS, GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, UPDATE_ADDRESS_FAILURE, UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS } from "./ActionType";

const initialState = {
    addresses: [],
    error: null,
    isLoading: false,
    success: null,
    selectedAddress: null
};

export const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADDRESSES_REQUEST:
        case ADD_ADDRESS_REQUEST:
        case UPDATE_ADDRESS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: null
            };
        case GET_ADDRESSES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                addresses: action.payload,
                success: "Addresses fetched successfully"
            };
        case ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                addresses: [...state.addresses, action.payload],
                success: "Address added successfully"
            };
        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                addresses: state.addresses.map((address) =>
                    address.id === action.payload.id ? action.payload : address
                ),
                success: "Address updated successfully"
            };
        case ADD_ADDRESS_FAILURE:
        case UPDATE_ADDRESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            };
        default:
            return state;
    }
};