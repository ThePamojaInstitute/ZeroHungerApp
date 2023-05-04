import { createContext, useEffect, useReducer, Dispatch } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token')
        return token
    } catch (error) {
        console.log(error);
    }
}

export const setToken = async (value: string) => {
    try {
        await AsyncStorage.setItem('token', value)
    } catch (error) {
        console.log(error);
    }
}

interface IINITIAL_STATE {
    username: string,
    accessToken: string,
    refreshToken: string,
    loading: boolean,
    error: Object,
    dispatch: Dispatch<{ type: string, payload: any }>
}

const INITIAL_STATE = {
    username: null,
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
                username: null,
                accessToken: "null",
                refreshToken: "null",
                loading: true,
                error: null
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                username: action.payload.username,
                accessToken: action.payload.token['access'],
                refreshToken: action.payload.token['refresh'],
                loading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                ...state,
                username: null,
                accessToken: "null",
                refreshToken: "null",
                loading: false,
                error: action.payload
            }
        case "LOGOUT":
            return {
                ...state,
                username: null,
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
            const token = await AsyncStorage.getItem('token')
            console.log("from initilize" + token);

            if (token !== null) {
                state['accessToken'] = token
            }
            return token
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        initializeTokenState()
    }, [])

    useEffect(() => {
        if (state['accessToken'] !== "notInitialized") {
            setToken(state['accessToken'])
        }
    }, [state['accessToken']])

    return (
        <AuthContext.Provider value={
            { username: state['username'], accessToken: state['accessToken'], refreshToken: null, loading: state['loading'], error: state['error'], dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}