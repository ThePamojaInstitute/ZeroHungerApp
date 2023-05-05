import { createContext, useEffect, useReducer, Dispatch } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

export const getToken = async (type: string) => {
    if (type === "access") {
        try {
            const token = await AsyncStorage.getItem('access_token')
            return token
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const token = await AsyncStorage.getItem('refresh_token')
            return token
        } catch (error) {
            console.log(error);
        }
    }
}

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
    user: string,
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

    const initializeTokenState = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token')
            const refreshToken = await AsyncStorage.getItem('refresh_token')

            if (accessToken !== null && refreshToken !== null) {
                state['accessToken'] = accessToken
                state['refreshToken'] = refreshToken
                state['user'] = JSON.stringify(jwt_decode(accessToken))
                console.log("the user is: " + state['user'])
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        initializeTokenState()
    }, [])

    useEffect(() => {
        if (state['accessToken'] !== "notInitialized") {
            setToken("access", state['accessToken'])
            setToken("refresh", state['refreshToken'])
        }
    }, [state['accessToken'] || state['refreshToken']])

    return (
        <AuthContext.Provider value={
            { user: state['user'], accessToken: state['accessToken'], refreshToken: state['refreshToken'], loading: state['loading'], error: state['error'], dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}