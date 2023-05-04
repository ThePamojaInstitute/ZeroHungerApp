import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../../config";


export async function createUser(user: Object) {
    if (!user['username']) {
        return { msg: "Please enter a username", res: null }
    } else if (user['username'].length > 50) {
        return { msg: "Username length should be 50 characters or less", res: null }
    }

    if (!user['email']) {
        return { msg: "Please enter an email", res: null }
    } else if (!user['email'].match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return { msg: "Please enter a valid email", res: null }
    }

    if (!user['password']) {
        return { msg: "Please enter a password", res: null }
    } else if (user['password'] != user['confPassword']) {
        return { msg: "The passwords you entered do not match", res: null }
    }

    try {
        const res = await axiosInstance.post("/createUser", user)
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response }
    }
}

export async function deleteUser(userId: string) {
    try {
        const res = await axiosInstance.post("/deleteUser", userId)
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}

export async function modifyUser(user: Object) {
    try {
        const res = await axiosInstance.post("/modifyUser", user)
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}

export async function logInUser(user: Object) {
    if (!user["username"]) {
        return { msg: "Please enter a username", res: null }
    } else if (!user["password"]) {
        return { msg: "Please enter a password", res: null }
    }

    try {

        const res = await axiosInstance.post("/logIn", user)
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response }
    }
}

export async function logOutUser() {
    console.log(axiosInstance.defaults.headers.common);
    try {
        const { data } = await axiosInstance.post('/logout', {
            refresh_token: AsyncStorage.getItem('refresh_token')
        }, { headers: { 'Content-Type': 'application/json' } });
        AsyncStorage.clear()
        axiosInstance.defaults.headers.common['Authorization'] = null;
    } catch (e) {
        console.log('logout not working', e)
    }
}