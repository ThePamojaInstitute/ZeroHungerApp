import { axiosInstance, getAccessToken } from "../../config"
import { Char } from "../../types"

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

export const savePreferences = async (
    postalCode: string,
    distance: number,
    dietRequirements: Char[],
    logistics: Char[]
) => {
    const canadianPostalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

    if (postalCode.length > 0 && !postalCode.match(canadianPostalCodeRegex)) {
        return { msg: "failure", res: "Please enter a valid postal code" }
    }

    const data = {
        postalCode: postalCode.toUpperCase(),
        distance: distance ?? 15,
        dietRequirements: dietRequirements ?? [],
        logistics: logistics ?? []
    }

    try {
        const res = await axiosInstance.post('users/userPreferences', {
            headers: {
                Authorization: await getAccessToken()
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

export const getPreferences = async () => {
    try {
        const res = await axiosInstance.get('users/userPreferences', {
            headers: {
                Authorization: await getAccessToken()
            }
        })

        return res.data
    } catch (err) {
        console.log(err);
    }
}

export const intitializePreferences = async (
    setLogistics: React.Dispatch<React.SetStateAction<Char[]>>,
    setPostalCode: React.Dispatch<React.SetStateAction<string>>,
    setDiet: React.Dispatch<React.SetStateAction<Char[]>>,
) => {
    const data = await getPreferences()
    setLogistics(data['logistics'])

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
        
}