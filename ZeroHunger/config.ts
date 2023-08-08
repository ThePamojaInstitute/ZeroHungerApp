import axios from "axios"
import { logOutUser } from "./src/controllers/auth";
import { MMKV } from 'react-native-mmkv'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Mock object of MMKV only for development
// Use actual MMKV for builds
const mockMMKV = {
    getString: (str) => 'str',
    set: (str1, str2) => { },
    clearAll: () => { },
    addOnValueChangedListener: () => { }
}

export const storage = Platform.OS === 'web' ? new MMKV() : mockMMKV


export const BaseURL = 'http://10.0.0.104:8000' //'http://127.0.0.1:8000/'
// export const BaseURL = 'https://zh-backend-azure-webapp.azurewebsites.net/'


export const passwordResetURL = 'https://zh-backend-azure-webapp.azurewebsites.net/users/reset_password/'

export const axiosInstance = axios.create({
    baseURL: `http://${BaseURL}/`,
    headers: { 'Content-Type': 'application/json' }
})

const useMMKV = (error) => {
    console.log("using MMKV");

    axiosInstance
        .post("users/token/refresh/", {
            refresh: storage.getString('refresh_token'),
        })
        .then((response) => {
            // Save tokens
            storage.set('refresh_token', response.data.refresh)
            storage.set('access_token', response.data.access)
            error.config.headers["Authorization"] = response.data.access;

            // Retry the initial call, but with the updated token in the headers. 
            // Resolves the promise if successful
            return axiosInstance(error.config);
        })
        .catch((error2) => {
            // Retry failed, clean up and reject the promise
            logOutUser()
            return Promise.reject(error2);
        })
        .finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
}
const useAsyncStorage = (error) => {
    console.log("using AsyncStorage");

    AsyncStorage.getItem('refresh_token').then(token => {
        axiosInstance
            .post("users/token/refresh/", {
                refresh: token,
            })
            .then((response) => {
                // Save tokens
                AsyncStorage.setItem('refresh_token', response.data.refresh)
                AsyncStorage.setItem('access_token', response.data.access)
                error.config.headers["Authorization"] = response.data.access;

                // Retry the initial call, but with the updated token in the headers. 
                // Resolves the promise if successful
                return axiosInstance(error.config);
            })
            .catch((error2) => {
                // Retry failed, clean up and reject the promise
                logOutUser()
                return Promise.reject(error2);
            })
    }).finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
}

const createAxiosResponseInterceptor = () => {
    const interceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Reject promise if usual error
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }

            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response.
             *
             * Must be re-attached later on or the token refresh will only happen once
             */
            axiosInstance.interceptors.response.eject(interceptor);

            // MMKV doesn't work with the Expo emulator
            // Use MMKV for builds
            if (Platform.OS === 'web') return useMMKV(error)

            return useAsyncStorage(error)
        }
    );
}
createAxiosResponseInterceptor(); // Execute the method once during start