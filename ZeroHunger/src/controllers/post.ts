import { axiosInstance } from "../../config";
import { Char } from "../../types";


export const createPost = async (obj: {
    postData: {
        title: string
        images: string,
        postedBy: Number,
        postedOn: string,
        description: string
    }
    postType: Char
}) => {
    if (!obj.postData.title) {
        return { msg: `Please enter a title to your ${obj.postType === "r" ? "request" : "offer"}`, res: null }
    } else if (obj.postData.title.length > 100) {
        return { msg: "Title should be at most 100 characters", res: null }
    }

    try {
        const res = await axiosInstance.post('/posts/createPost', obj)
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

export const createPostObj = (fields: object, pk: number, username: string) => {
    const postedOnDate = new Date(fields['postedOn'] * 1000).toLocaleDateString('en-US')
    const newPost = {
        title: fields['title'],
        imagesLink: fields['images'],
        postedOn: postedOnDate,
        postedBy: fields['postedBy'],
        description: fields['description'],
        fulfilled: fields['fulfilled'],
        postId: pk,
        username: username
    }

    return newPost
}

export const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}