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
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() };
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a username")
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("The passwords you entered do not match").length).toBe(0)
    })

    it('shows error message when entering only the username', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter an email")
        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("The passwords you entered do not match").length).toBe(0)
    })

    it('shows error message when entering username that is longer that 50 characters', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("SignUp.usernameInput")

        fireEvent.changeText(usernameInput, 'usLorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consectetur quam et dui luctus, quis blandit eros posuere. Nunc a facilisis elit, eu sodales dui. Sed semper est ut justo varius, non cursus ex ornare. Maecenas at elementum sapien, in porta libero. Praesent et tortor accumsan, tempus dui ac, cursus enim.ername')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Username length should be 50 characters or less")
        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("The passwords you entered do not match").length).toBe(0)
    })

    it('shows error message when entering only the username and email', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("SignUp.usernameInput")
        const emailInput = getByTestId("SignUp.emailInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(emailInput, 'email@email.com')

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        getByText("Please enter a password")
        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("The passwords you entered do not match").length).toBe(0)
    })

    it('shows error message when not entering a confirmation password ', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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
        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
    })

    it('shows error message when password and password confirmation do not match ', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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
        expect(queryAllByText("Please enter a username").length).toBe(0)
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
    })

    it('shows no errors when entering all required inputs correctly', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<CreateAccountScreen navigation={mockNavigation} />)
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
        expect(queryAllByText("Please enter an email").length).toBe(0)
        expect(queryAllByText("Please enter a valid email").length).toBe(0)
        expect(queryAllByText("Please enter a password").length).toBe(0)
        expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
        expect(queryAllByText("The passwords you entered do not match").length).toBe(0)
    })
})