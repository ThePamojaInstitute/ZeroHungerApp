import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../../config";


export async function createUser(user: Object, acceptedTerms: boolean) {
    if (!user['username']) {
        return { msg: "Please enter a username", res: null }
    } else if (user['username'].length < 5) {
        return { msg: "Username length should be at least 5 characters", res: null }
    } else if (user['username'].length > 50) {
        return { msg: "Username length should be 50 characters or less", res: null }
    } else if (user['username'].includes("__")) {
        return { msg: "Username shouldn't include \"__\"", res: null }
    }

    if (!user['email']) {
        return { msg: "Please enter an email", res: null }
    } else if (!user['email'].match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return { msg: "Please enter a valid email", res: null }
    }

    if (!user['password']) {
        return { msg: "Please enter a password", res: null }
    } else if (user['password'].length < 4) {
        return { msg: "Password length should be 4 characters or more", res: null }
    } else if (user['password'].length > 64) {
        return { msg: "Password length should be 64 characters or less", res: null }
    } else if (!user['confPassword']) {
        return { msg: "Please enter a confirmation password", res: null }
    } else if (user['password'] != user['confPassword']) {
        return { msg: "The passwords you entered do not match", res: null }
    }

    if (!acceptedTerms) {
        return { msg: "Please accept terms and conditions", res: null }
    }

    try {
        const res = await axiosInstance.post("users/createUser", user)
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response.data }
    }
}

export async function editUser(accessToken: string) {
    try {
        await axiosInstance.post('users/editUser',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
            })
    }
    catch (e) {
        console.log(e);
    }
}

export async function deleteUser(userId: string, token: string) {
    try {
        const res = await axiosInstance.delete("users/deleteUser", {
            headers: {
                Authorization: `${token}`
            },
            data: { user_id: userId }
        })
        if (res.status === 200) {
            return "success"
        } else {
            return "An error occured"
        }
    } catch (error) {
        console.log(error);
    }
}

export async function modifyUser(user: Object) {


}

export async function logInUser(user: Object) {
    if (!user["username"]) {
        return { msg: "Please enter a username", res: null }
    } else if (!user["password"]) {
        return { msg: "Please enter a password", res: null }
    }

    try {

        const res = await axiosInstance.post("users/logIn", user)
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
            await axiosInstance.post('users/logOut', {
                refresh_token: res
            }, { headers: { 'Content-Type': 'application/json' } })
        }).then(() => {
            AsyncStorage.clear()
        })
    } catch (e) {
        console.log('logout not working', e)
    }
}