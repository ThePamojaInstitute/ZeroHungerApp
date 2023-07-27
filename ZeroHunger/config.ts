import axios from "axios"
import { logOutUser } from "./src/controllers/auth";
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const BaseURL = '127.0.0.1:8000'
// export const BaseURL = 'zh-backend-azure-webapp.azurewebsites.net'

export const passwordResetURL = 'https://zh-backend-azure-webapp.azurewebsites.net/users/reset_password/'

export const axiosInstance = axios.create({
    baseURL: `http://${BaseURL}/`,
    headers: { 'Content-Type': 'application/json' }
})

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

            return axiosInstance
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
    );
}
createAxiosResponseInterceptor(); // Execute the method once during start