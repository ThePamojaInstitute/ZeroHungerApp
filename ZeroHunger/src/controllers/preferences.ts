import { axiosInstance } from "../../config"
import { Char } from "../../types"
import { ACCESSNEEDSPREFERENCES, LOGISTICSPREFERENCES } from "./post"

interface ILOGISTICS {
    PICKUP: Char,
    DELIVERY: Char,
    PUBLIC: Char,
    WHEELCHAIR: Char
}

interface IDIETREQUIREMENTS {
    HALAL: Char,
    VEGETARIAN: Char,
    VEGAN: Char,
    LACTOSEFREE: Char,
    NUTFREE: Char,
    GLUTENFREE: Char,
    SUGARFREE: Char,
    SHELLFISHFREE: Char
}

export const LOGISTICS: ILOGISTICS = {
    PICKUP: 'a',
    DELIVERY: 'b',
    PUBLIC: 'c',
    WHEELCHAIR: 'd'
}
export const DIETREQUIREMENTS: IDIETREQUIREMENTS = {
    HALAL: 'a',
    VEGETARIAN: 'b',
    VEGAN: 'c',
    LACTOSEFREE: 'd',
    NUTFREE: 'e',
    GLUTENFREE: 'f',
    SUGARFREE: 'g',
    SHELLFISHFREE: 'h'
}

export const getLogisticsType = (type: Char) => {
    switch (type) {
        case LOGISTICS.PICKUP:
            return 'Pick up'
        case LOGISTICS.DELIVERY:
            return 'Delivery'
        case LOGISTICS.PUBLIC:
            return 'Meet at a public location'
        case LOGISTICS.WHEELCHAIR:
            return 'Wheelchair accessible'
        default:
            return ''
    }
}

export const getDietType = (type: Char) => {
    switch (type) {
        case DIETREQUIREMENTS.HALAL:
            return 'Halal'
        case DIETREQUIREMENTS.VEGETARIAN:
            return 'Vegetarian'
        case DIETREQUIREMENTS.VEGAN:
            return 'Vegan'
        case DIETREQUIREMENTS.LACTOSEFREE:
            return 'Lactose free'
        case DIETREQUIREMENTS.NUTFREE:
            return 'Nut free'
        case DIETREQUIREMENTS.GLUTENFREE:
            return 'Gluten free'
        case DIETREQUIREMENTS.SUGARFREE:
            return 'Sugar free'
        case DIETREQUIREMENTS.SHELLFISHFREE:
            return 'Shellfish free'
        default:
            return ''
    }
}

export const savePreferences = async (postalCode: string, dietRequirements: Char[], logistics: Char[], accessToken: string) => {
    const canadianPostalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

    if (postalCode.length > 0 && !postalCode.match(canadianPostalCodeRegex)) {
        return { msg: "failure", res: "Please enter a valid postal code" }
    }

    const data = {
        postalCode: postalCode.toUpperCase(),
        dietRequirements: dietRequirements,
        logistics: logistics
    }

    try {
        const res = await axiosInstance.post('users/userPreferences', {
            headers: {
                Authorization: `${accessToken}`
            },
            data: data
        })
        if (res.status === 204) {
            return { msg: "success", res: res.data }
        } else {
            return { msg: "failure", res: null }
        }
    } catch (err) {
        return { msg: "failure", res: null }
    }
}

export const getPreferences = async (accessToken: string) => {
    try {
        const res = await axiosInstance.get('users/userPreferences', {
            headers: {
                Authorization: `${accessToken}`
            }
        })

        return res.data
    } catch (err) {
        console.log(err);
    }
}

export const getPreferencesLogistics = (
    data: Char[],
    setAccessNeeds: React.Dispatch<React.SetStateAction<Char>>,
    setLogistics: React.Dispatch<React.SetStateAction<Char[]>>,
) => { // converts from post's logistics to preferences' logistics and access needs
    if (data.length === 0) {
        setAccessNeeds(ACCESSNEEDSPREFERENCES.NONE)
    } else {
        if (data.includes(LOGISTICS.PICKUP)) {
            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.PICKUP])
        }

        if (data.includes(LOGISTICS.DELIVERY)) {
            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.DELIVERY])
            setAccessNeeds(ACCESSNEEDSPREFERENCES.DELIVERY)
        }

        if (data.includes(LOGISTICS.PUBLIC)) {
            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.PUBLIC])
        }

        if (data.includes(LOGISTICS.WHEELCHAIR)) {
            setAccessNeeds(ACCESSNEEDSPREFERENCES.WHEELCHAIR)
        }

        if (!data.includes(LOGISTICS.DELIVERY) && !data.includes(LOGISTICS.WHEELCHAIR)) {
            setAccessNeeds(ACCESSNEEDSPREFERENCES.NONE)
        }
    }
}

export const intitializePreferences = (
    accessToken: string,
    setAccessNeeds: React.Dispatch<React.SetStateAction<Char>>,
    setLogistics: React.Dispatch<React.SetStateAction<Char[]>>,
    setPostalCode: React.Dispatch<React.SetStateAction<string>>,
    setDiet: React.Dispatch<React.SetStateAction<Char[]>>,
) => {
    getPreferences(accessToken).then(data => {
        getPreferencesLogistics(data['logistics'], setAccessNeeds, setLogistics)

        if (data['postalCode']) {
            setPostalCode(data['postalCode'])
        }

        if (data['diet']) {
            Object.keys(DIETREQUIREMENTS).map(value => {
                if (data['diet'].includes(DIETREQUIREMENTS[value])) {
                    setDiet((oldArray: Char[]) => [...oldArray, DIETREQUIREMENTS[value]])
                }
            })
        }
    })
}