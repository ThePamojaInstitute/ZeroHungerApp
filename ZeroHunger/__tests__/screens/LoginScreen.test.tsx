import LoginScreen from "../../src/screens/Loginscreen";
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import React from "react";
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import MockAdapter from "axios-mock-adapter"
import { Linking } from "react-native";


jest.mock('jwt-decode', () => () => ({}))
const mockNavigation = {
    navigate: jest.fn(),
};
const mockEvent = { preventDefault: jest.fn() };
const mockDispatch = jest.fn()
const mockAxios = new MockAdapter(axiosInstance)

const spyLogInUser = jest.spyOn(Utils, 'logInUser')
const spyCanOpenURL = jest.spyOn(Linking, 'canOpenURL')
const spyOpenURL = jest.spyOn(Linking, 'openURL')

afterEach(() => {
    jest.clearAllMocks()
})


describe('on load', () => {
    it('renders default elements', () => {
        const { getAllByText, getAllByPlaceholderText } = render(<LoginScreen navigation={mockNavigation} />)
        expect(getAllByText("Login").length).toBe(1)
        getAllByPlaceholderText("Username")
        getAllByPlaceholderText("Password")
    });

    it('does not navigate to the landing page if user is not logged in', () => {
        render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).not.toBeCalled()
    })

    it('navigates to the landing page when the user is logged in', () => {
        render(
            <AuthContext.Provider value={{ user: "User", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).toBeCalledWith('LandingPageScreenTemp')
    })
})

describe('events on login button press', () => {
    it('calls preventDefault', async () => {
        const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />)

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    it('shows error message when not entering username', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<LoginScreen navigation={mockNavigation} />)
        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        getByText("Please enter a username")
        expect(queryAllByText("Please enter a password").length).toBe(0)
    })

    it('shows error message when entering username but not password', async () => {
        const { getByTestId, getByText } = render(<LoginScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("LogIn.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        getByText("Please enter a password")
    })

    it('shows no errors when entering both username and password', async () => {
        const { getByTestId, queryAllByText } = render(<LoginScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a username").length).toBe(0)
    })

    it('calls dispatch function to LOGIN_START', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(mockDispatch).toBeCalled()
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { "payload": null, "type": "LOGIN_START" })
    })

    it('calls logInUser function', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({ "username": 'username', "password": 'password' })
    })
})

describe('logInUser function', () => {
    it('calls dispatch when the post requests resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })
        mockAxios.onPost('/token/').reply(200, { refresh: 'refresh_tokne', access: 'access_token' })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({ "username": 'username', "password": 'password' })
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": { "token": { "access": "access_token", "refresh": "refresh_tokne" }, "user": {} }, "type": "LOGIN_SUCCESS" })
    })

    it('navigates the landing page when the post request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })
        mockAxios.onPost('/token/').reply(200, { refresh: 'refresh_tokne', access: 'access_token' })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({ "username": 'username', "password": 'password' })
        expect(mockNavigation.navigate).toBeCalledWith('LandingPageScreenTemp')
    })

    it('calls dispatch with LOGIN_FAILURE when the response login fails', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("LogIn.usernameInput")
        const passwordInput = getByTestId("LogIn.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "failure", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "LOGIN_FAILURE" })
    })
})

describe('testing navigation', () => {
    it('navigates to CreateAccount screen when pressing Sign Up button', () => {
        const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />)

        const button = getByTestId("SignUp.Button")
        fireEvent.press(button)

        expect(mockNavigation.navigate).toBeCalledWith('CreateAccountScreen')
    })
})

describe('password recovery', () => {
    it('calls canOpenURL when pressing on the button', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith("http://127.0.0.1:8000/password-reset/")
    })

    it('opens url if supported', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        spyCanOpenURL.mockResolvedValue(true)
        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith("http://127.0.0.1:8000/password-reset/")
        await waitFor(() => {
            expect(spyOpenURL).toBeCalledWith("http://127.0.0.1:8000/password-reset/")
        })
    })

    it('doesnt open url if not supported', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <LoginScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        spyCanOpenURL.mockResolvedValue(false)
        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith("http://127.0.0.1:8000/password-reset/")
        await waitFor(() => {
            expect(spyOpenURL).not.toBeCalled()
        })
    })
})