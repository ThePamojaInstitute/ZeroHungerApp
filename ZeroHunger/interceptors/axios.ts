import { axiosInstance } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

let refresh = false;
axiosInstance.interceptors.response.use(resp => resp, async error => {

    if (error.response.status === 401 && !refresh) {
        refresh = true;
        console.log(AsyncStorage.getItem('refresh_token'))
        const response = await
            axiosInstance.post('token/refresh/', {
                refresh: AsyncStorage.getItem('refresh_token')
            })
        if (response.status === 200) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer 
            ${response.data['access']}`;
            AsyncStorage.setItem('access_token', response.data.access);
            AsyncStorage.setItem('refresh_token', response.data.refresh);
            return axiosInstance(error.config);
        }
    }
    refresh = false;
    return error;
})