import React from "react";
import CreateAccountScreen from '../../src/screens/CreateAccountScreen';
import * as Utils from "../../src/controllers/auth";
import { AuthContext } from "../../src/context/AuthContext";
import { axiosInstance } from "../../config";
import { render, fireEvent, act } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
const mockNavigation = {
    navigate: jest.fn(),
};
const mockEvent = { preventDefault: jest.fn() };
const mockDispatch = jest.fn()
const mockAxios = new MockAdapter(axiosInstance)

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
        const { getByTestId } = render(<CreateAccountScreen navigation={mockNavigation} />)
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    it('shows error message when not entering username', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a username")
    })

    it('shows error message when entering only the username', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter an email")
    })

    it('shows error message when entering username that is longer that 50 characters', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ante in')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Username length should be 64 characters or less")
    })

    it('shows error message when entering only the username and email', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a password")
    })

    it('shows error message when not entering a confirmation password ', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a confirmation password")
    })

    it('shows error message when password and password confirmation do not match ', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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

        getByText("The passwords you entered do not match")
    })

    it('shows error message when password lenght is less than 4', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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

        getByText("Password length should be 4 characters or more")
    })

    it('shows error message when password lenght is more than 64', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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

        getByText("Password length should be 64 characters or less")
    })

    it('shows no errors when entering all required inputs correctly', async () => {
        const { getByTestId, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Username length should be 64 characters or less").length).toBe(0)
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("Password length should be 4 characters or more").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("Password length should be 64 characters or less").length).toBe(0)
    })

    it('calls dispatch function to SIGNUP_START', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <CreateAccountScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

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
                <CreateAccountScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

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
                <CreateAccountScreen navigation={mockNavigation} />
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

    it('navigates the login screen when the post request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <CreateAccountScreen navigation={mockNavigation} />
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
                <CreateAccountScreen navigation={mockNavigation} />
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")
        const passwordInput = getByTestId("SignUp.passwordInput")
        const confPasswordInput = getByTestId("SignUp.confPasswordInput")

        spyCreateUser.mockResolvedValue({ msg: "failure", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')
        fireEvent.changeText(passwordInput, 'password')
        fireEvent.changeText(confPasswordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "SIGNUP_FAILURE" })
        expect(mockNavigation.navigate).not.toBeCalledWith('LoginScreen')
    })
})