import LoginScreen from "../../src/screens/LoginScreen";
import { render, fireEvent, act } from '@testing-library/react-native';
import React from "react";

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

it('renders default elements', () => {
    const { getAllByText, getAllByPlaceholderText } = render(<LoginScreen navigation={jest.fn()} />)
    expect(getAllByText("Login").length).toBe(1)
    getAllByPlaceholderText("Username")
    getAllByPlaceholderText("Password")
});

describe('events on button press', () => {

    it('calls preventDefault', async () => {
        const { getByTestId } = render(<LoginScreen navigation={jest.fn()} />)
        const mockEvent = { preventDefault: jest.fn() };
        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    it('shows error message when not entering username', async () => {
        const { getByTestId, getByText, queryAllByText } = render(<LoginScreen navigation={jest.fn()} />)
        const mockEvent = { preventDefault: jest.fn() };
        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        getByText("Please enter a username")
        expect(queryAllByText("Please enter a password").length).toBe(0)
    })

    it('shows error message when entering username but not password', async () => {
        const { getByTestId, getByText } = render(<LoginScreen navigation={jest.fn()} />)
        const mockEvent = { preventDefault: jest.fn() }
        const usernameInput = getByTestId("LogIn.usernameInput")

        fireEvent.changeText(usernameInput, 'username')

        await act(() => {
            fireEvent.press(getByTestId("LogIn.Button"), mockEvent)
        })

        getByText("Please enter a password")
    })

    it('shows no errors when entering both username and password', async () => {
        const { getByTestId, queryAllByText } = render(<LoginScreen navigation={jest.fn()} />)
        const mockEvent = { preventDefault: jest.fn() }
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
})

describe('testing navigation', () => {
    it('navigates to CreateAccount screen when pressing Sign Up button', () => {
        const mockNavigation = {
            navigate: jest.fn(),
        };
        const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />)

        const button = getByTestId("SignUp.Button")
        fireEvent.press(button)

        expect(mockNavigation.navigate).toBeCalledWith('CreateAccountScreen')
    })
})