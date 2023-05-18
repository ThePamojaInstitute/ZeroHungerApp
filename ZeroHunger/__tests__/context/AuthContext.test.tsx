import React, { useContext } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { AuthContext, AuthContextProvider, setToken } from "../../src/context/AuthContext"
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import MockAdapter from "axios-mock-adapter"


jest.mock('jwt-decode', () => () => ({}))
const mockAxios = new MockAdapter(axiosInstance)

afterEach(() => {
    jest.clearAllMocks();
})

const TestComponent = () => {
    const { user, accessToken, refreshToken, loading, error, dispatch } = useContext(AuthContext)

    const handleBtn = (type: string) => {
        if (type === "LogInStart") {
            dispatch({ type: "LOGIN_START", payload: null })
        } else if (type === "LogInSuccess") {
            dispatch({
                type: "LOGIN_SUCCESS", payload: {
                    "user": { username: "ahmad" },
                    "token": { access: "access_token", refresh: "refresh_token" }
                }
            })
        } else if (type === "LogInFailure") {
            dispatch({ type: "LOGIN_FAILURE", payload: "error" })
        }

        switch (type) {
            case "LogInStart":
                dispatch({ type: "LOGIN_START", payload: null })
                return
            case "LogInSuccess":
                dispatch({
                    type: "LOGIN_SUCCESS", payload: {
                        "user": { username: "ahmad" },
                        "token": { access: "access_token", refresh: "refresh_token" }
                    }
                })
                return
            case "LogInFailure":
                dispatch({ type: "LOGIN_FAILURE", payload: "error" })
                return
            case "LogOut":
                dispatch({ type: "LOGOUT", payload: null })
                return
            case "SignUpStart":
                dispatch({ type: "SIGNUP_START", payload: null })
                return
            case "SignUpSuccess":
                dispatch({ type: "SIGNUP_SUCCESS", payload: null })
                return
            case "SignUpFailure":
                dispatch({ type: "SIGNUP_FAILURE", payload: "error" })
                return
            default:
                return
        }
    }

    return (<View>
        <Text testID='userTest'>{user ? `Hello ${user['username']}` : "no User"}</Text>
        <Text testID='accessTokenTest'>{accessToken}</Text>
        <Text testID='refreshTokenTest'>{refreshToken}</Text>
        <Text testID='loadingTest'>{loading.toString()}</Text>
        <Text testID='loadingTest'>{error ? "error" : null}</Text>
        <TouchableOpacity testID="LogInStart.Button" onPress={() => handleBtn("LogInStart")}>
            <Text>LOGIN_START</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="LogInSuccess.Button" onPress={() => handleBtn("LogInSuccess")}>
            <Text>LOGIN_SUCCESS</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="LogInFailure.Button" onPress={() => handleBtn("LogInFailure")}>
            <Text>LOGIN_FAILURE</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="LogOut.Button" onPress={() => handleBtn("LogOut")}>
            <Text>LOGOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="SignUpStart.Button" onPress={() => handleBtn("SignUpStart")}>
            <Text>SIGNUP_START</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="SignUpSuccess.Button" onPress={() => handleBtn("SignUpSuccess")}>
            <Text>SIGNUP_SUCCESS</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="SignUpFailure.Button" onPress={() => handleBtn("SignUpFailure")}>
            <Text>SIGNUP_FAILURE</Text>
        </TouchableOpacity>
    </View>)
}

describe('Authentication States', () => {
    it('INITIAL_STATE', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        root['getByText']("no User")
        root['getByText']("false")
        expect(root['queryAllByText']("notInitialized").length).toBe(2)
        expect(root['queryAllByText']("error").length).toBe(0)
    })

    it('LOGIN_START', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("LogInStart.Button"))
        })

        root['getByText']("no User")
        root['getByText']("true")
        expect(root['queryAllByText']("notInitialized").length).toBe(0)
        expect(root['queryAllByText']("error").length).toBe(0)
    })

    it('LOGIN_SUCCESS', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("LogInSuccess.Button"))
        })

        root['getByText']("Hello ahmad")
        root['getByText']("access_token")
        root['getByText']("refresh_token")
        root['getByText']("false")
        expect(root['queryAllByText']("error").length).toBe(0)
        expect(root['queryAllByText']("notInitialized").length).toBe(0)
    })

    it('LOGIN_FAILURE', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("LogInFailure.Button"))
        })

        root['getByText']("error")
        root['getByText']("false")
        expect(root['queryAllByText']("notInitialized").length).toBe(0)
    })

    it('LOGOUT', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("LogOut.Button"))
        })

        root['getByText']("no User")
        root['getByText']("false")
        expect(root['queryAllByText']("error").length).toBe(0)
        expect(root['queryAllByText']("notInitialized").length).toBe(0)
    })

    it('SIGNUP_START', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("SignUpStart.Button"))
        })

        root['getByText']("no User")
        root['getByText']("true")
        expect(root['queryAllByText']("error").length).toBe(0)
    })

    it('SIGNUP_SUCCESS', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("SignUpSuccess.Button"))
        })

        root['getByText']("false")
        root['getByText']("no User")
        expect(root['queryAllByText']("error").length).toBe(0)
    })

    it('SIGNUP_FAILURE', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("SignUpFailure.Button"))
        })

        root['getByText']("error")
        root['getByText']("false")
        root['getByText']("no User")
    })
})

describe('setToken function', () => {
    it('sets access token', () => {
        setToken("access", "access_token")

        expect(AsyncStorage.setItem).toBeCalledWith("access_token", "access_token")
        AsyncStorage.getItem("access_token").then(res => {
            expect(res).toBe("access_token")
        })
    })

    it('sets refresh token', () => {
        setToken("refresh", "refresh_token")

        expect(AsyncStorage.setItem).toBeCalledWith("refresh_token", "refresh_token")
        AsyncStorage.getItem("refresh_token").then(res => {
            expect(res).toBe("refresh_token")
        })
    })
})

describe('initializeTokenState function', () => {
    it('calls AsyncStorage.getItem for refresh_token', async () => {
        await waitFor(() => {
            render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        expect(AsyncStorage.getItem).toBeCalledTimes(1)
        expect(AsyncStorage.getItem).toBeCalledWith("refresh_token")
    })

    it('sets tokens when refresh post request resolves', async () => {
        AsyncStorage.setItem('refresh_token', "token")
        mockAxios.onPost('token/refresh/').reply(200, { refresh: 'refresh_token', access: 'access_token' })

        await waitFor(() => {
            render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(4, "access_token", "access_token")
        expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(5, "refresh_token", "refresh_token")
    })

    it('doesnt set tokens when refresh post request rejects', async () => {
        AsyncStorage.setItem('refresh_token', "token")
        mockAxios.onPost('token/refresh/').reply(401)

        await waitFor(() => {
            render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        expect(AsyncStorage.setItem).toBeCalledTimes(3)
        expect(AsyncStorage.setItem).not.toHaveBeenNthCalledWith(4, "access_token", "access_token")
        expect(AsyncStorage.setItem).not.toHaveBeenNthCalledWith(5, "refresh_token", "refresh_token")
    })

    it('logs user out when refresh token is expired', async () => {
        AsyncStorage.setItem('refresh_token', "token")
        mockAxios.onPost('token/refresh/').reply(200)
        const spyLogOutUser = jest.spyOn(Utils, 'logOutUser').mockResolvedValue()

        await waitFor(() => {
            render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        expect(spyLogOutUser).toBeCalledTimes(1)
    })
})

describe('updating local storage', () => {
    it('updates the local storage when state of access or refresh tokens change', async () => {
        let root: Object;
        await waitFor(() => {
            root = render(<AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>)
        })

        await act(() => {
            fireEvent.press(root['getByTestId']("LogInSuccess.Button"))
        })

        expect(AsyncStorage.setItem).toBeCalledTimes(2)
        expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, "access_token", "access_token")
        expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(2, "refresh_token", "refresh_token")
    })
})