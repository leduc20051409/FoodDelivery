import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
 // Đường dẫn đến file api.js của bạn
import { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE } from "./ActionType"; // Đường dẫn đến ActionTypes của bạn
import { api } from "../../../components/config/Api";
export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
        console.log("Token gửi đi:", jwt); // Log token trước khi gửi
        if (!jwt) {
            throw new Error("No token provided");
        }
        const { data } = await api.get(`/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        console.log("Thông tin user:", data); // Log thông tin user
        dispatch({ type: GET_USER_SUCCESS, payload: data });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error.response?.data || error.message); // Log lỗi
        dispatch({ type: GET_USER_FAILURE, payload: error.message });
    }
};