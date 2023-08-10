import { ENV, axiosInstance, storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"


export async function createUser(user: Object, acceptedTerms: boolean) {
    try {
        const res = await axiosInstance.post("users/createUser", user)
        return { msg: "success", res: res.data }
    } catch (error) {
        return { msg: "failure", res: error.response.data }
    }
}

export async function editUser(accessToken: string, editedUser: object) {
    try {
        const res = await axiosInstance.put('users/editUser',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                    credentials: 'include'
                },
                data: { user: editedUser }
            })
        return { msg: "success", res: res.data }
    }
    catch (error) {
        return { msg: "failure", res: error.response.data }
    }
}

export async function deleteUser(token: string) {
    try {
        const res = await axiosInstance.delete("users/deleteUser", {
            headers: {
                Authorization: `${token}`
            },
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
        let refreshToken
        if (ENV === 'production') storage.getString('refresh_token')
        else {
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
            if (ENV === 'production') {
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
        console.log('logout not working', e)
    }
}

export const getAccount = async (accessToken: string) => {
    try {
        const res = await axiosInstance.get('users/editUser', {
            headers: {
                Authorization: `${accessToken}`
            }
        })

        return res.data
    } catch (err) {
        console.log(err);
    }
}