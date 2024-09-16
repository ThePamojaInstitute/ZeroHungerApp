import { createContext, useEffect, useReducer, Dispatch, useState } from "react"
import jwt_decode from "jwt-decode";
import { axiosInstance, storage } from "../../config";
import { logOutUser } from "../controllers/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from '../../RootNavigation';
import store from "../../store";
import { ENV } from "../../env";
import { getPrivateKey, getPrivateKey1 } from "../controllers/publickey";

const setItem = (key, value) => {
    if (ENV === 'production') storage.set(key, value)
    else {
        if (Platform.OS === 'web') storage.set(key, value)
        else AsyncStorage.setItem(key, value)
    }
}

export const setToken = (type: string, value: string) => {
    if (type === "access") {
        try {
            setItem('access_token', value)
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            setItem('refresh_token', value)
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
    privkey: string,
    dispatch: Dispatch<{ type: string, payload: Object }>
}

const INITIAL_STATE = {
    user: null,
    accessToken: "notInitialized",
    refreshToken: "notInitialized",
    loading: false,
    error: null,
    privkey: "notInitialized",
    dispatch: () => { }
}

export const AuthContext = createContext<IINITIAL_STATE>(INITIAL_STATE)

const AuthReducer = (state: Object, action: { type: string; payload: Object }) => {
    switch (action.type) {
        case "LOGIN_START":
            console.log(`starting login`)
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: true,
                error: null,
                // privkey: null
            }
        case "LOGIN_SUCCESS":
            // console.log(`SUCCESSFUL LOGIN: ${action.payload['privateKey']}`)
            return {
                ...state,
                user: action.payload['user'],
                accessToken: action.payload['token'].access,
                refreshToken: action.payload['token'].refresh,
                loading: false,
                error: null,
                // privateKey: action.payload['privateKey']//getPrivateKey1(action.payload['user'])
            }
        case "LOGIN_FAILURE":
            console.log(`login failure`)
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: false,
                error: action.payload,
                privkey: null
            }
        case "LOGOUT":
            console.log(`LOGGING OUT`)
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                loading: false,
                error: null,
                privkey: null
            }
        case "SIGNUP_START":
            console.log(``)
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            }
        case "SIGNUP_SUCCESS":
            console.log(``)
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
        case "UPDATE_ACCESS":
            console.log(`updating access`)
            return {
                ...state,
                user: action.payload['user'],
                accessToken: action.payload['access'],
                // privateKey: getPrivateKey1(action.payload['user']),
            }
        case "UPDATE_REFRESH":
            console.log(`updating refresh`)
            return {
                ...state,
                user: action.payload['user'],
                refreshToken: action.payload['access'],
                // privateKey: getPrivateKey1(action.payload['user']),
            }
        case "PRIVATEKEY":
            console.log(`AUTHCONTEXT RECEIVED: ${action.payload['privkey']} AS PRIVATE KEY`)
            return {
                ...state,
                privkey: action.payload['privkey']
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const [firstLoad, setFirstLoad] = useState(true)

    if (!store.isReady) {
        store.isReady = true
        store.dispatch = params => dispatch(params)
        Object.freeze(store)
    }

    if (ENV === 'production' || Platform.OS === 'web') {
        const listener = storage.addOnValueChangedListener((changedKey) => {
            try {
                const token = storage.getString(changedKey)
                if (changedKey === 'access_token') {
                    dispatch({
                        type: 'UPDATE_ACCESS', payload: {
                            user: jwt_decode(token),
                            access: token
                        }
                    })
                } else if (changedKey === 'refresh_token') {
                    dispatch({
                        type: 'UPDATE_REFRESH', payload: {
                            user: jwt_decode(token),
                            access: token
                        }
                    })
                }
            }
            catch {
                if (changedKey === 'mmkv.default\\access_token' || changedKey === 'mmkv.default\\refresh_token') {
                    dispatch({ type: 'LOGOUT', payload: null })
                    RootNavigation.navigate('LoginScreen', {})
                }
            }
        })
    }

    const initializeTokenState = async () => {
        try {
            let refreshToken
            if (ENV === 'production') {
                refreshToken = storage.getString('refresh_token')
            }
            else {
                if (Platform.OS === 'web') {
                    refreshToken = storage.getString('refresh_token')
                }
                else {
                    refreshToken = await AsyncStorage.getItem('refresh_token')
                }
            }

            if (refreshToken) {
                console.log(`TESTING CONDITION HERE`)
                const response = await axiosInstance.post('users/token/refresh/', { refresh: refreshToken })

                if (response.data) {
                    state['refreshToken'] = response.data['refresh']
                    state['accessToken'] = response.data['access']
                    state['user'] = jwt_decode(state['accessToken'])

                    // if (Platform.OS === 'web') {
                    //     console.log(`SETTING KEY HEREEEEEEEEEEEEEEEEEEEEEEEEE`)
                    //     state['privkey'] = storage.getString(state['user'].username + 'privkey')
                    // } else {
                    //     state['privkey'] = await AsyncStorage.getItem(state['user'].username + 'privkey')
                    // }
                    // console.log(`PRINTING FROM AUTHCONTEXT user: ${state['user'].username}, privatekey: ${state['privkey']}`)

                    setToken("access", state['accessToken'])
                    setToken("refresh", state['refreshToken'])
                } else {
                    logOutUser()
                }
            }
            // if (Platform.OS === 'web') {
            //     console.log(`SETTING KEY HEREEEEEEEEEEEEEEEEEEEEEEEEE AFTER RESPONSE`)
            //     state['privkey'] = storage.getString(state['user'].username + 'privkey')
            // } else {
            //     state['privkey'] = await AsyncStorage.getItem(state['user'].username + 'privkey')
            // }
            // console.log(state['privkey'])
        } catch (error) {
            console.log("Refresh token expired or non existing");
        }
    }

    const updateTokens = async () => {
        if (firstLoad) {
            initializeTokenState().then(() => { setFirstLoad(false) })
        } else {
            const response = await axiosInstance.post('users/token/refresh/', { refresh: state['refreshToken'] })

            if (response.data) {
                state['refreshToken'] = response.data['refresh']
                state['accessToken'] = response.data['access']
                state['user'] = jwt_decode(state['accessToken'])

                // if (Platform.OS === 'web') {
                //     state['privkey'] = storage.getString(state['user'].username + 'privkey')
                // } else {
                //     state['privkey'] = await AsyncStorage.getItem(state['user'].username + 'privkey')
                // }

                setToken("access", state['accessToken'])
                setToken("refresh", state['refreshToken'])

                // console.log(`PRINTING FROM AUTHCONTEXT`)
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

    // useEffect(() => {
    //     if (state['user']) {

    //         state['privkey'] = getPrivateKey1(state['user'].username)
    //         // if (Platform.OS === 'web') {
    //         //     console.log(`SETTING KEYSTATE IN USE EFFECT`)
    //         //     state['privkey'] = storage.getString(state['user'].username + 'privkey')
    //         // } else {
    //         //     state['privkey'] = AsyncStorage.getItem(state['user'].username + 'privkey')
    //         // }
    //     }
    // }, [state['user']])

    useEffect(() => {
        try {
            console.log(`Privkey changed to: ${state['privkey']}`)
        } catch(error) {
            console.log(`Error encountered at authcontext: ${error}`)
        }
    }, [state['privkey']])

    return (
        <AuthContext.Provider value={
            { user: state['user'], accessToken: state['accessToken'], refreshToken: state['refreshToken'], loading: state['loading'], error: state['error'], privkey: state['privkey'], dispatch }}>
            {firstLoad ? null : children}
        </AuthContext.Provider>
    )
}