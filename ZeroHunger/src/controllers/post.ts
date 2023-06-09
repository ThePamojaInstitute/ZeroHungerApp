import { axiosInstance } from "../../config";
import { Char } from "../../types";


export const createPost = async (obj: {
    title: string
    images: string,
    postedBy: Number,
    postedOn: Number,
    description: string
    postType: Char
}) => {
    if (!obj.title) {
        return { msg: `Please enter a title to your ${obj.postType === "r" ? "request" : "offer"}`, res: null }
    } else if (obj.title.length > 100) {
        return { msg: "Title should be at most 100 characters", res: null }
    }

    if (!obj.description) {
        return { msg: `Please enter a description to your ${obj.postType === "r" ? "request" : "offer"}`, res: null }
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