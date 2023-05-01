import { createContext, useEffect, useReducer, Dispatch } from "react"

interface IINITIAL_STATE {
    user: null,
    loading: boolean,
    error: Object,
    dispatch: Dispatch<{ type: string, payload: any }>
}

const INITIAL_STATE = {
    user: null,
    loading: false,
    error: null,
    dispatch: () => { }
}

export const AuthContext = createContext<IINITIAL_STATE>(INITIAL_STATE)

const AuthReducer = (state: any, action: { type: string; payload: any }) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                ...state,
                user: null,
                loading: true,
                error: null
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload
            }
        case "LOGOUT":
            return {
                ...state,
                user: null,
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


    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider value={
            { user: state.user, loading: state.loading, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}