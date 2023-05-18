import CreateAccountScreen from '../../src/screens/CreateAccountScreen';
import { render, fireEvent, act } from '@testing-library/react-native';
import React from "react";

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
const mockNavigation = {
    navigate: jest.fn(),
};

it('renders default elements', () => {
    const { getAllByText, getAllByPlaceholderText } = render(<CreateAccountScreen navigation={mockNavigation} />)
    expect(getAllByText("Sign Up").length).toBe(1)
    getAllByPlaceholderText("Username")
    getAllByPlaceholderText("Email Address")
    getAllByPlaceholderText("Password")
    getAllByPlaceholderText("Confirm Password")
});

describe('events on button press', () => {

    it('calls preventDefault', async () => {
        const { getByTestId } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() };
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    it('shows error message when not entering username', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() };
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a username")
    })

    it('shows error message when entering only the username', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter an email")
    })

    it('shows error message when entering username that is longer that 50 characters', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ante in')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Username length should be 64 characters or less")
    })

    it('shows error message when entering only the username and email', async () => {
        const { getByTestId, getByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
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
        const mockEvent = { preventDefault: jest.fn() }
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
        const mockEvent = { preventDefault: jest.fn() }
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
        const mockEvent = { preventDefault: jest.fn() }
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
        const mockEvent = { preventDefault: jest.fn() }
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
        const mockEvent = { preventDefault: jest.fn() }
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
})