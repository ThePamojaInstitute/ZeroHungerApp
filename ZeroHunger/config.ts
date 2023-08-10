import axios from "axios"
import { MMKV } from 'react-native-mmkv'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { navigate } from "./RootNavigation";
import store from "./store";

export const ENV: 'production' | 'development' = 'development'

// Mock object of MMKV only for development
// Use actual MMKV for builds
const mockMMKV = {
    getString: (str) => 'str',
    set: (str1, str2) => { },
    clearAll: () => { },
    addOnValueChangedListener: () => { },
    delete: () => { },
    getAllKeys: () => { }
}

export const storage = ENV !== 'development' ? new MMKV() :
    Platform.OS === 'web' ? new MMKV() : mockMMKV

// export const HttpBaseURL = 'http://127.0.0.1:8000/'
// export const WSBaseURL = 'ws://127.0.0.1:8000/'
export const HttpBaseURL = 'http://172.22.10.170:8000/'
export const WSBaseURL = 'ws://172.22.10.170:8000/'
// export const HttpBaseURL = 'https://zh-backend-azure-webapp.azurewebsites.net/'
// export const WSBaseURL = 'ws://zh-backend-azure-webapp.azurewebsites.net/'

export const passwordResetURL = `${HttpBaseURL}users/reset_password`

export const axiosInstance = axios.create({
    baseURL: HttpBaseURL,
    headers: { 'Content-Type': 'application/json' }
})

const logOutUser = async () => {
    try {
        let refreshToken: string
        if (ENV !== 'development') {
            refreshToken = storage.getString('refresh_token')
        } else {
            if (Platform.OS === 'web') {
                refreshToken = storage.getString('refresh_token')
            } else {
                refreshToken = await AsyncStorage.getItem('refresh_token')
            }
        }

        await axiosInstance.post('users/logOut', {
            refresh_token: refreshToken
        }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            if (ENV !== 'development') {
                storage.delete('refresh_token')
                storage.delete('access_token')
            } else {
                if (Platform.OS === 'web') {
                    storage.delete('refresh_token')
                    storage.delete('access_token')
                } else {
                    AsyncStorage.removeItem('refresh_token')
                    AsyncStorage.removeItem('access_token')
                }
            }
        })
    } catch (e) {
        console.log(e)
    }
}

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
            logOutUser().then(() => {
                store.dispatch({ type: "LOGOUT", payload: null })
                navigate('LoginScreen', {})
            })
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
                logOutUser().then(() => {
                    store.dispatch({ type: "LOGOUT", payload: null })
                    navigate('LoginScreen', {})
                })
                return Promise.reject(error2);
            })
    }).finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
}

const createAxiosResponseInterceptor = () => {
    const interceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log(error);

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

            if (ENV !== 'development') return useMMKV(error)
            // MMKV doesn't work with the Expo emulator
            // Use MMKV for builds
            else {
                if (Platform.OS === 'web') return useMMKV(error)
                return useAsyncStorage(error)
            }
        }
    );
}
createAxiosResponseInterceptor(); // Execute the method once during start

export const setTokens = (data: object) => {
    if (ENV !== 'development') {
        storage.set('refresh_token', data['refresh'])
        storage.set('access_token', data['access'])
    } else {
        if (Platform.OS === 'web') {
            storage.set('refresh_token', data['refresh'])
            storage.set('access_token', data['access'])
        } else {
            AsyncStorage.setItem('refresh_token', data['refresh'])
            AsyncStorage.setItem('access_token', data['access'])
        }
    }
}