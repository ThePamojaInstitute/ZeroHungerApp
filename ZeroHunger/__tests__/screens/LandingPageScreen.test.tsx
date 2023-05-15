import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import React from "react";
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import MockAdapter from "axios-mock-adapter"
import LandingPageScreen from "../../src/screens/LandingPageScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAxios = new MockAdapter(axiosInstance)
const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')

jest.mock('jwt-decode', () => () => ({}))

const mockNavigation = {
    navigate: jest.fn(),
};

afterEach(() => {
    jest.clearAllMocks();
    spyLogOutUser.mockReset()
})

describe('onload', () => {
    it('navigates to login screen if user is not logged in', () => {
        render(
            <AuthContext.Provider value={{ user: null, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).toBeCalledWith('LoginScreen')
    })

    it('doesnt navigate to login screen if user is logged in', () => {
        render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).not.toBeCalled()
    })

    it('shows username if user is logged in', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        getByText("Good Morning user")
    })
})

describe('handling log out', () => {
    it('shows logOut button if user is logged in', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        getByText("Log Out")
    })

    it('doesnt show logOut button if user is not logged in', () => {
        const { queryAllByText } = render(
            <AuthContext.Provider value={{ user: null, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(queryAllByText("Log Out").length).toBe(0)
    })

    it('calls logOutUser when button is pressed', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(spyLogOutUser).toBeCalled()
    })

    it('calls dispatch when the post requests resolves', async () => {
        const mockDispatch = jest.fn()
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(mockDispatch).toBeCalled()
        expect(mockDispatch).toBeCalledWith({ type: "LOGOUT", payload: null })
    })

    it('navigates the log out screen when the post request resolves', async () => {
        const mockDispatch = jest.fn()
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(mockNavigation.navigate).toBeCalled()
        expect(mockNavigation.navigate).toBeCalledWith('LoginScreen')
    })
})

describe('logOutUser function', () => {
    it('calls AsyncStorage.getItem', async () => {
        const mockDispatch = jest.fn()
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')
        mockAxios.onPost('/logOut').reply(200, {})

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(AsyncStorage.getItem).toBeCalled()
        expect(AsyncStorage.getItem).toBeCalledWith('refresh_token')
    })

    it('calls AsyncStorage.clear when post request resolves', async () => {
        const mockDispatch = jest.fn()
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')
        mockAxios.onPost('/logOut').reply(200, {})

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(AsyncStorage.clear).toBeCalled()
    })
})