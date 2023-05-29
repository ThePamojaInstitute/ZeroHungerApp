import React from "react";
import CreateAccountScreen from '../../src/screens/CreateAccountScreen';
import * as Utils from "../../src/controllers/auth";
import { AuthContext } from "../../src/context/AuthContext";
import { axiosInstance } from "../../config";
import { render, fireEvent, act } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
const mockNavigation = {
    navigate: jest.fn(),
};
const mockEvent = { preventDefault: jest.fn() };
const mockDispatch = jest.fn()
const mockAxios = new MockAdapter(axiosInstance)
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}

const spyCreateUser = jest.spyOn(Utils, 'createUser')

afterEach(() => {
    jest.clearAllMocks();
})

it('renders default elements', () => {
    const { getAllByText, getAllByPlaceholderText } = render(<CreateAccountScreen navigation={mockNavigation} />)
    expect(getAllByText("Sign Up").length).toBe(1)
    getAllByPlaceholderText("Username")
    getAllByPlaceholderText("Email Address")
    getAllByPlaceholderText("Password")
    getAllByPlaceholderText("Confirm Password")
});

describe('events on Sign Up button press', () => {
    it('calls preventDefault', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    it('shows error message when not entering username', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Please enter a username",
            "type": "open"
        })
    })

    it('shows error message when entering only the username', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Please enter an email",
            "type": "open"
        })
    })

    it('shows error message when entering username that is longer that 50 characters', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ante in')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Username length should be 64 characters or less",
            "type": "open"
        })
    })

    it('shows error message when entering only the username and email', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Please enter a password",
            "type": "open"
        })
    })

    it('shows error message when not entering a confirmation password ', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Please enter a confirmation password",
            "type": "open"
        })
    })

    it('shows error message when password and password confirmation do not match ', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'passwor')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "The passwords you entered do not match",
            "type": "open"
        })
    })

    it('shows error message when password lenght is less than 4', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'pas')
        fireEvent.changeText(confPasswordInput, 'pas')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Password length should be 4 characters or more",
            "type": "open"
        })
    })

    it('shows error message when password lenght is more than 64', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ante in')
        fireEvent.changeText(confPasswordInput, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ante in')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "Password length should be 64 characters or less",
            "type": "open"
        })
    })

    it('shows successfull when entering all required inputs correctly', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AlertContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledTimes(1)
        expect(mockAlertDispatch).toBeCalledWith({ "alertType": "success", "message": "Account created successfully!", "type": "open" })
    })

    it('calls dispatch function to SIGNUP_START', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockDispatch).toBeCalled()
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { "payload": null, "type": "SIGNUP_START" })
    })

    it('calls createUser function', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(spyCreateUser).toBeCalledWith({
            "username": 'username',
            "email": 'email@email.com',
            "password": 'password',
            "confPassword": 'password'
        })
    })
})

describe('createUser function', () => {
    it('calls dispatch when the post requests resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(spyCreateUser).toBeCalledWith({
            "username": 'username',
            "email": 'email@email.com',
            "password": 'password',
            "confPassword": 'password'
        })
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "SIGNUP_SUCCESS" })
    })

    it('shows Account created successfully! when the post requests resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "success",
            "message": "Account created successfully!",
            "type": "open"
        })
    })

    it('navigates the login screen when the post request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "success", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "SIGNUP_SUCCESS" })
        expect(mockNavigation.navigate).toBeCalledWith('LoginScreen')
    })

    it('calls dispatch with SIGNUP_FAILURE when the response login fails', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <CreateAccountScreen navigation={mockNavigation} />
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "failure", res: { "data": "data" } })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": { "data": "data" }, "type": "SIGNUP_FAILURE" })
        expect(mockNavigation.navigate).not.toBeCalledWith('LoginScreen')
    })
})