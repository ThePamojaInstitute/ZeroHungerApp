import { axiosInstance } from "../../config";


export async function createUser(user: Object) {
    if (!user['username']) {
        console.log("Please enter a username");
        return
    } else if (user['username'].length > 50) {
        console.log("Username length should be 50 characters or less");
        return
    }

    if (!user['email'].match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        console.log("Please enter a valid email");
        return
    }

    try {
        const res = await axiosInstance.post("/createUser", user)
        console.log(res);
    } catch (error) {
        console.log(error);
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
        console.log("Please enter a username");
        return
    } else if (!user["password"]) {
        console.log("Please enter a password");
        return
    }

    try {
        const res = await axiosInstance.post("/logIn", user)
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}

export async function logOutUser() {
    try {
        const res = await axiosInstance.post("/logOut")
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}