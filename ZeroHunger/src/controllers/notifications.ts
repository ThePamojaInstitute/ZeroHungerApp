import { axiosInstance, getAccessToken, setLocalStorageItem } from "../../config";


export const getNotificationsSettings = async () => {
    try {
        const res = await axiosInstance.get('/users/getNotificationsSettings', {
            headers: {
                Authorization: await getAccessToken()
            }
        })

        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const updateNotificationsSettings = async (allowExpiringPosts: boolean, allowNewMessages: boolean) => {
    try {
        await axiosInstance.put('/users/updateNotificationsSettings', {
            headers: {
                Authorization: await getAccessToken()
            },
            data: {
                'allowExpiringPosts': allowExpiringPosts,
                'allowNewMessages': allowNewMessages
            }
        })

        setLocalStorageItem('allowExpiringPosts', allowExpiringPosts.toString())
    } catch (error) {
        console.log(error);
    }
}

export async function addNotification(user: Object, notification: {
    type: String,
    user: String,
    food: String
}) {
    try {
        const res = await axiosInstance.post("users/addNotification", { user, notification })
        if (res.status === 200) {
            return { msg: "success", res: res }
        }
        else {
            return { msg: "An error occurred", res: res }
        }
    }
    catch (e) {
        console.log(e)
        return { msg: "An error occurred", res: e }
    }
}

export async function clearNotification(user: Object, timestamp: Number) {
    try {
        const res = await axiosInstance.post("users/clearNotification", { user, timestamp })
        if (res.status === 200) {
            return { msg: "success", res: res }
        }
        else {
            return { msg: "An error occurred", res: res }
        }
    }
    catch (e) {
        console.log(e)
        return { msg: "An error occurred", res: e }
    }
}

export async function clearAllNotifications(user: Object) {
    try {
        const res = await axiosInstance.post("users/clearAllNotifications", user)
        if (res.status === 200) {
            return "success"
        }
        else {
            return "An error occurred"
        }
    }
    catch (e) {
        console.log(e)
    }
}