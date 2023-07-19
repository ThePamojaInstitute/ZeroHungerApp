import { axiosInstance } from "../../config";
import { Char } from "../../types";

export const logisticsPreferences = {
    PICKUP: 0,
    DELIVERY: 1,
    PUBLIC: 2
}


export const createPost = async (post: {
    postData: {
        title: string
        images: string,
        postedBy: Number,
        description: string,
        logistics: number[]
    }
    postType: Char
}) => {
    if (!post.postData.title) {
        return { msg: `Please enter a title to your ${post.postType === "r" ? "request" : "offer"}`, res: null }
    } else if (post.postData.title.length > 100) {
        return { msg: "Title should be at most 100 characters", res: null }
    }

    try {
        const res = await axiosInstance.post('/posts/createPost', post)
        if (res.status === 201) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        console.log(error);
        return { msg: "failure", res: error }
    }
}

export const deletePost = async (postType: Char, postId: Number, token: string) => {
    if (postId === 0) return

    try {
        const res = await axiosInstance.delete('/posts/deletePost', {
            headers: {
                Authorization: token
            },
            data: {
                'postType': postType,
                'postId': postId
            }
        })

        if (res.status === 200) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        console.log(error);
        return { msg: "failure", res: 'An error occured' }
    }
}

export const markAsFulfilled = async (postType: Char, postId: Number, token: string) => {
    if (postId === 0) return

    try {
        const res = await axiosInstance.put('/posts/markAsFulfilled', {
            headers: {
                Authorization: token
            },
            data: {
                'postType': postType,
                'postId': postId
            }
        })

        if (res.status === 200) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        console.log(error);
        return { msg: "failure", res: 'An error occured' }
    }
}

export const handleImageUpload = async (images: string[]) => {
    if (images.length === 0) return ''

    let imageString = images[0];
    imageString = imageString.substring(imageString.indexOf(",") + 1);

    const res = await axiosInstance.post("posts/testBlobImage", { "IMAGE": imageString })
    let result = res.data;

    console.log('Processing Request');
    console.log("Image Uploaded to: " + result);
    return result
}

export const getLogisticsType = (num: number) => {
    switch (num) {
        case logisticsPreferences.PICKUP:
            return 'Pick up'
        case logisticsPreferences.DELIVERY:
            return 'Delivery'
        case logisticsPreferences.PUBLIC:
            return 'Meet at a public location'
    }
}

export const handleLogistics = (str: string) => {
    if (!str) return 'None'

    const arr = str.split(',')
    if (arr.length === 1) {
        return getLogisticsType(parseInt(arr[0]))
    }

    let preferences = ''

    arr.forEach((num, i) => {
        const type = getLogisticsType(parseInt(num))
        if (preferences.length > 0) {
            preferences += `, ${type}`
        } else {
            preferences = type
        }
    })
    return preferences
}
