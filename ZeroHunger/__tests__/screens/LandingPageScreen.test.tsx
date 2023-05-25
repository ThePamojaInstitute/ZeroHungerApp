import React from "react";
import LandingPageScreen from "../../src/screens/LandingPageScreen";
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MockAdapter from "axios-mock-adapter"

jest.mock('jwt-decode', () => () => ({}))
const mockAxios = new MockAdapter(axiosInstance)
const mockDispatch = jest.fn()
const mockNavigation = {
    navigate: jest.fn(),
};

const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')
const spyDeleteUser = jest.spyOn(Utils, 'deleteUser')

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
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onPost('/logOut').reply(200, {})

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(AsyncStorage.getItem).toBeCalled()
        expect(AsyncStorage.getItem).toBeCalledWith('refresh_token')
    })

    it('calls AsyncStorage.clear when post request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user" }, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onPost('/logOut').reply(200, {})

        await act(() => {
            fireEvent.press(getByTestId("LogOut.Button"))
        })

        expect(AsyncStorage.clear).toBeCalled()
    })
})

describe('deleteUser function', () => {
    it('returns success message if delete request status is 200', async () => {
        mockAxios.onDelete('/deleteUser').reply(200, {})
        const res = await Utils.deleteUser("101", "token")
        expect(res).toBe("success")
    })

    it('returns error message if delete request status is not 200', async () => {
        mockAxios.onDelete('/deleteUser').reply(204, {})
        const res = await Utils.deleteUser("101", "token")
        expect(res).toBe("An error occured")
    })
})

describe('handleDeleteUser', () => {
    it('calls deleteUser function when button is pressed', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(spyDeleteUser).toBeCalledWith("101", "access_token")
    })

    it('calls logOutUser when delete request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(200, {})

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(spyLogOutUser).toBeCalled()
    })

    it('calls dispatch to LOGOUT when logOutUser resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(200, {})
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(mockDispatch).toBeCalledWith({ type: "LOGOUT", payload: null })
    })

    it('navigates to login screen when logOutUser resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(200, {})
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(mockNavigation.navigate).toBeCalledWith("LoginScreen")
    })

    it('doesnt call dispatch when logOutUser rejects', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(200, {})
        spyLogOutUser.mockRejectedValue({})

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(mockDispatch).not.toBeCalled()
    })

    it('doesnt navigate to login screen when logOutUser rejects', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(200, {})
        spyLogOutUser.mockRejectedValue({})

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(mockNavigation.navigate).not.toBeCalled()
    })

    it('doesnt call logOutUser when delete request rejects', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: { username: "user", user_id: "101" }, accessToken: "access_token", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LandingPageScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        mockAxios.onDelete('/deleteUser').reply(204, {})

        await act(() => {
            fireEvent.press(getByTestId("DeleteUser.Button"))
        })

        expect(spyLogOutUser).not.toBeCalled()
    })
})