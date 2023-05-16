import { createContext, useEffect, useReducer, Dispatch, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { axiosInstance } from "../../config";
import { logOutUser } from "../controllers/auth";

export const setToken = async (type: string, value: string) => {
    if (type === "access") {
        try {
            await AsyncStorage.setItem('access_token', value)
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            await AsyncStorage.setItem('refresh_token', value)
        } catch (error) {
            console.log(error);
        }
    }
}

interface IINITIAL_STATE {
    user: Object,
    accessToken: string,
    refreshToken: string,
    loading: boolean,
    error: Object,
    dispatch: Dispatch<{ type: string, payload: any }>
}

const INITIAL_STATE = {
    user: null,
    accessToken: "notInitialized",
    refreshToken: "notInitialized",
    loading: false,
    error: null,
    dispatch: () => { }
}

export const AuthContext = createContext<IINITIAL_STATE>(INITIAL_STATE)

const AuthReducer = (state: Object, action: { type: string; payload: any }) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: true,
                error: null
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.token['access'],
                refreshToken: action.payload.token['refresh'],
                loading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: false,
                error: action.payload
            }
        case "LOGOUT":
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: false,
                error: null
            }
        case "SIGNUP_START":
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            }
        case "SIGNUP_SUCCESS":
            return {
                ...state,
                user: null,
                loading: false,
                error: null
            }
        case "SIGNUP_FAILURE":
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const [firstLoad, setFirstLoad] = useState(true)

    const initializeTokenState = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refresh_token')

            if (refreshToken) {
                const response = await axiosInstance.post('token/refresh/', { refresh: refreshToken })
                if (response.data) {
                    state['refreshToken'] = response.data['refresh']
                    state['accessToken'] = response.data['access']
                    state['user'] = jwt_decode(state['accessToken'])

                    setToken("access", state['accessToken'])
                    setToken("refresh", state['refreshToken'])
                } else {
                    logOutUser()
                }
            }
        } catch (error) {
            console.log("Refresh token expired or non existing");
        }
    }

    const updateTokens = async () => {
        if (firstLoad) {
            initializeTokenState().then(() => { setFirstLoad(false) })
        } else {
            const response = await axiosInstance.post('token/refresh/', { refresh: state['refreshToken'] })

            if (response.data) {
                state['refreshToken'] = response.data['refresh']
                state['accessToken'] = response.data['access']
                state['user'] = jwt_decode(state['accessToken'])

                setToken("access", state['accessToken'])
                setToken("refresh", state['refreshToken'])
            } else {
                logOutUser()
            }
        }
    }

    useEffect(() => {
        if (state['accessToken'] !== "notInitialized" && state['accessToken']) {
            setToken("access", state['accessToken'])
            setToken("refresh", state['refreshToken'])
        }
    }, [state['accessToken'], state['refreshToken']])

    useEffect(() => {
        if (firstLoad) {
            updateTokens()
        }

        const fourMinutes = 1000 * 60 * 4

        const interval = setInterval(() => {
            if (state['refreshToken']) {
                updateTokens()
            }
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [state['refreshToken'], state['accessToken'], firstLoad])

    return (
        <AuthContext.Provider value={
            { user: state['user'], accessToken: state['accessToken'], refreshToken: state['refreshToken'], loading: state['loading'], error: state['error'], dispatch }}>
            {firstLoad ? null : children}
        </AuthContext.Provider>
    )
}