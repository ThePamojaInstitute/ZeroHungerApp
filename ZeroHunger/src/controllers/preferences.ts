import { axiosInstance } from "../../config"
import { LOGISTICSPREFERENCES } from "./post"

export const LOGISTICS = {
    PICKUP: 0,
    DELIVERY: 1,
    PUBLIC: 2,
    WHEELCHAIR: 3
}
export const DIETREQUIREMENTS = {
    HALAL: 0,
    VEGETARIAN: 1,
    VEGAN: 2,
    LACTOSEFREE: 3,
    NUTFREE: 4,
    GLUTENFREE: 5,
    SUGARFREE: 6,
    SHELLFISHFREE: 7
}

export const getLogisticsType = (type: number) => {
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

export const getDietType = (type: number) => {
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

export const savePreferences = async (postalCode: string, dietRequirements: number[], logistics: number[], accessToken: string) => {
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
        if (res.status === 200) {
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

export const intitializePreferences = (
    accessToken: string,
    setAccessNeeds: React.Dispatch<React.SetStateAction<number>>,
    setLogistics: React.Dispatch<React.SetStateAction<number[]>>,
    setPostalCode: React.Dispatch<React.SetStateAction<string>>
) => {
    getPreferences(accessToken).then(data => {
        if (data['logistics'].length === 0) {
            setAccessNeeds(0)
        } else {
            if (data['logistics'].includes(0)) {
                setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.PICKUP])
            }

            if (data['logistics'].includes(1)) {
                setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.DELIVERY])
                setAccessNeeds(2)
            }

            if (data['logistics'].includes(2)) {
                setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.PUBLIC])
            }

            if (data['logistics'].includes(3)) {
                setAccessNeeds(1)
            }

            if (!data['logistics'].includes(1) && !data['logistics'].includes(3)) {
                setAccessNeeds(0)
            }
        }

        if (data['postalCode']) {
            setPostalCode(data['postalCode'])
        }
    })
}