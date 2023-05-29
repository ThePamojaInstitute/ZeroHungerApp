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
    console.log(obj);
    if (!obj.title) {
        // alert('Please enter a title to your request')
        return { msg: "Please enter a title to your request", res: null }
    } else if (obj.title.length >= 100) {
        // alert('Title should be at most 100 characters')
        return { msg: "Title should be at most 100 characters", res: null }
    }

    try {
        const res = await axiosInstance.post('/posts/createPost')
        if (res.status === 201) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        console.log(error);
        // alert('An error occured!')
        return { msg: "failure", res: error }
    }
}