import moment from "moment";
import { axiosInstance, getAccessToken } from "../../config";
import { Char } from "../../types";

interface ILOGISTICSPREFERENCES {
    PICKUP: Char,
    DELIVERY: Char,
    PUBLIC: Char,
    WHEELCHAIR: Char
}
interface IFOODCATEGORIES {
    Fruits: Char,
    Vegetables: Char,
    Grains: Char,
    Dairy: Char,
    DairyAlternatives: Char,
    MeatPoultry: Char,
    Fish: Char,
    Legumes: Char,
    BakedGoods: Char,
    Snacks: Char,
    Condiments: Char,
    Other: Char,
}
interface IDIETPREFERENCES {
    Halal: Char,
    Vegetarian: Char,
    Vegan: Char,
    LactoseFree: Char,
    NutFree: Char,
    GlutenFree: Char,
    SugarFree: Char,
    ShellfishFree: Char,
    Other: Char,
}

export const LOGISTICSPREFERENCES: ILOGISTICSPREFERENCES = {
    PICKUP: 'a',
    DELIVERY: 'b',
    PUBLIC: 'c',
    WHEELCHAIR: 'd'
}
export const FOODCATEGORIES: IFOODCATEGORIES = {
    Fruits: 'a',
    Vegetables: 'b',
    Grains: 'c',
    Dairy: 'd',
    DairyAlternatives: 'e',
    MeatPoultry: 'f',
    Fish: 'g',
    Legumes: 'h',
    BakedGoods: 'i',
    Snacks: 'j',
    Condiments: 'k',
    Other: 'l',
}
export const DIETPREFERENCES: IDIETPREFERENCES = {
    Halal: 'a',
    Vegetarian: 'b',
    Vegan: 'c',
    LactoseFree: 'd',
    NutFree: 'e',
    GlutenFree: 'f',
    SugarFree: 'g',
    ShellfishFree: 'h',
    Other: 'i',
}

export const createPost = async (post: {
    postData: {
        title: string
        images: string,
        postedBy: number,
        description: string,
        logistics: Char[],
        postalCode: string,
        accessNeeds: string,
        categories: Char[],
        diet: Char[],
        expiryDate: string,
    }
    postType: Char
}) => {
    const canadianPostalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
    if (!post.postData.title) {
        return { msg: `Please enter a title to your ${post.postType === "r" ? "request" : "offer"}`, res: null }
    } else if (post.postData.title.length > 100) {
        return { msg: "Title should be at most 100 characters", res: null }
    } else if (post.postData.categories.length === 0) {
        return { msg: "Please select a food category", res: null }
    } else if (post.postData.postalCode.length > 0 && !post.postData.postalCode.match(canadianPostalCodeRegex)) {
        return { msg: "Please enter a valid postal code", res: null }
    }

    try {
        const res = await axiosInstance.post('/posts/createPost', post)
        // const res = await axiosInstance.post('/chat/sendMessage', post)

        if (res.status === 201) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        if (error.response.data === 'invalid postal code') {
            return { msg: "Please enter a valid postal code", res: null }
        }
        return { msg: "failure", res: error }
    }
}

export const deletePost = async (postType: Char, postId: number) => {
    if (postId === 0) return

    try {
        const res = await axiosInstance.delete('/posts/deletePost', {
            headers: {
                Authorization: await getAccessToken()
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

export const markAsFulfilled = async (postType: Char, postId: number) => {
    if (postId === 0) return

    try {
        const res = await axiosInstance.put('/posts/markAsFulfilled', {
            headers: {
                Authorization: await getAccessToken()
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

export const handleImageUpload = async (base64Images: string[]) => {
    if (base64Images.length === 0) return ''

    const res = await axiosInstance.post("posts/testBlobImage", { "IMAGE": base64Images[0] })
    let result = res.data;

    console.log('Processing Request');
    console.log("Image Uploaded to: " + result);
    return result
}

export const extendExpiryDate = async (postId: number, type: "r" | "o") => {
    const oneWeekLater = moment(new Date()).add(1, 'week')
    const formattedDate = moment(oneWeekLater.toDate(), 'YYYY-MM-DD HH:mm')

    try {
        const res = await axiosInstance.put('/posts/extendPostExpiryDate', {
            headers: {
                Authorization: await getAccessToken()
            },
            data: {
                'postType': type,
                'postId': postId,
                'newExpiryDate': formattedDate
            }
        })

        if (res.status === 204) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: res.data }
        }
    } catch (error) {
        console.log(error);
        return { msg: "failure", res: 'An error occured' }
    }
}

export const getLogisticsType = (char: Char) => {
    switch (char) {
        case LOGISTICSPREFERENCES.PICKUP:
            return 'Pick up'
        case LOGISTICSPREFERENCES.DELIVERY:
            return 'Delivery'
        case LOGISTICSPREFERENCES.PUBLIC:
            return 'Meet at a public location'
        case LOGISTICSPREFERENCES.WHEELCHAIR:
            return 'Location must be wheelchair accessible'
        default:
            return ''
    }
}

export const handlePreferences = (str: string, getType: (char: string) => string) => {
    if (!str) return 'None'

    const arr = str.split(',')
    if (arr.length === 1) {
        return getType(arr[0])
    }

    let preferences = ''

    arr.forEach((num, i) => {
        const type = getType(num)
        if (preferences.length > 0) {
            preferences += `, ${type}`
        } else {
            preferences = type
        }
    })
    return preferences
}

export const formatPostalCode = (postalCode: string) => {
    if (!postalCode) return 'N/A'

    if (postalCode.includes('-')) {
        postalCode = postalCode.replace('-', ' ')
    } else if (postalCode.length === 6) {
        postalCode = postalCode.slice(0, 3) + ' ' + postalCode.slice(3)
    }
    return postalCode
}


export const getCategory = (char: Char) => {
    switch (char) {
        case FOODCATEGORIES.DairyAlternatives:
            return 'Dairy alternatives'
        case FOODCATEGORIES.MeatPoultry:
            return 'Meat / Poultry'
        case FOODCATEGORIES.BakedGoods:
            return 'Baked goods'
        case FOODCATEGORIES.Fruits:
            return 'Fruits'
        case FOODCATEGORIES.Vegetables:
            return 'Vegetables'
        case FOODCATEGORIES.Grains:
            return 'Grains'
        case FOODCATEGORIES.Dairy:
            return 'Dairy'
        case FOODCATEGORIES.Fish:
            return 'Fish'
        case FOODCATEGORIES.Legumes:
            return 'Legumes'
        case FOODCATEGORIES.BakedGoods:
            return 'Baked goods'
        case FOODCATEGORIES.Snacks:
            return 'Snacks'
        case FOODCATEGORIES.Condiments:
            return 'Condiments'
        case FOODCATEGORIES.Other:
            return 'Other'
        default:
            return 'Other'
    }
}

export const getDiet = (char: Char) => {
    switch (char) {
        case DIETPREFERENCES.Halal:
            return 'Halal'
        case DIETPREFERENCES.Vegetarian:
            return 'Vegetarian'
        case DIETPREFERENCES.Vegan:
            return 'Vegan'
        case DIETPREFERENCES.LactoseFree:
            return 'Lactose free'
        case DIETPREFERENCES.NutFree:
            return 'Nut free'
        case DIETPREFERENCES.GlutenFree:
            return 'Gluten free'
        case DIETPREFERENCES.SugarFree:
            return 'Sugar free'
        case DIETPREFERENCES.ShellfishFree:
            return 'Shellfish free'
        case DIETPREFERENCES.Other:
            return 'Other'
        default:
            return 'Other'
    }
}

export const handleExpiryDate = (expiryDate: string, postType: "r" | "o"): [string, number] => {
    const diffInDays = moment(expiryDate).diff(moment(), "days")

    if (postType === 'r') {
        if (diffInDays < 0) {
            return ['Expired', diffInDays]
        } else if (diffInDays === 0) {
            return ['Need today', diffInDays]
        } else {
            return [`Need in ${diffInDays + 1} days`, diffInDays]
        }
    } else {
        if (diffInDays < 0) {
            return ['Expired', diffInDays]
        } else if (diffInDays === 0) {
            return ['Expires today', diffInDays]
        } else {
            return [`Expires in ${diffInDays + 1} days`, diffInDays]
        }
    }
}
