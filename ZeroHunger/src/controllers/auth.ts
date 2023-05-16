import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../../config";


export async function createUser(user: Object) {
    if (!user['username']) {
        return { msg: "Please enter a username", res: null }
    } else if (user['username'].length > 64) {
        return { msg: "Username length should be 64 characters or less", res: null }
    }

    if (!user['email']) {
        return { msg: "Please enter an email", res: null }
    } else if (!user['email'].match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return { msg: "Please enter a valid email", res: null }
    }

    if (!user['password']) {
        return { msg: "Please enter a password", res: null }
    } else if (!user['confPassword']) {
        return { msg: "Please enter a confirmation password", res: null }
    } else if (user['password'] != user['confPassword']) {
        return { msg: "The passwords you entered do not match", res: null }
    } else if (user['password'].length < 4) {
        return { msg: "Password length should be 4 characters or more", res: null }
    } else if (user['password'].length > 64) {
        return { msg: "Password length should be 64 characters or less", res: null }
    }

    try {
        const res = await axiosInstance.post("/createUser", user)
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response.data }
    }
}

export async function deleteUser(userId: string, token: string) {
    try {
        const res = await axiosInstance.delete("/deleteUser", {
            headers: {
                Authorization: `${token}`
            },
            data: { user_id: userId }
        })
        console.log(res);
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
        if (res.data == undefined) {
            return { msg: "failure", res: res['response'] }
        }
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response }
    }
}

export async function logOutUser() {
    try {
        AsyncStorage.getItem('refresh_token').then(async res => {
            await axiosInstance.post('/logOut', {
                refresh_token: res
            }, { headers: { 'Content-Type': 'application/json' } })
        }).then(() => {
            AsyncStorage.clear()
        })
    } catch (e) {
        console.log('logout not working', e)
    }
}