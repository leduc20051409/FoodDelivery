import axios from "axios";
import { LOGIN_SUCCESS, LOGOUT } from "../../State/Customer/Authentication/ActionType";

export const API_URL = "http://localhost:8080";

let store;
export const injectStore = (_store) => {
    store = _store;
}

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = store?.getState()?.auth?.jwt;
    if (token && config.url.includes("/api")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("📛 Interceptor error caught:", error?.response?.status, originalRequest?.url);
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.post("/auth/refresh-token");
                console.log('✅ Refresh response:', data);
                const newToken = data.token;

                if (!newToken) {
                    console.error('❌ No access token in refresh response:', data);
                    throw new Error('No access token received');
                }

                store.dispatch({ type: LOGIN_SUCCESS, payload: newToken });
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                store.dispatch({ type: LOGOUT });
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;