import React from "react";
import CreateAccountScreen from '../../src/screens/CreateAccountScreen';
import * as Utils from "../../src/controllers/auth";
import { AuthContext } from "../../src/context/AuthContext";
import { axiosInstance } from "../../config";
import { render, fireEvent, act } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import { NavigationContext } from "@react-navigation/native";
import { useFonts } from '@expo-google-fonts/public-sans';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";


jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))
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

// fake NavigationContext value data
const actualNav = jest.requireActual("@react-navigation/native");
const navContext = {
    ...actualNav.navigation,
    navigate: () => { },
    dangerouslyGetState: () => { },
    setOptions: () => { },
    addListener: () => () => { },
    isFocused: () => true,
};

const spyCreateUser = jest.spyOn(Utils, 'createUser')

const authContextValues = {
    user: "",
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: mockDispatch
}

afterEach(() => {
    jest.clearAllMocks();
    (useFonts as jest.Mock).mockImplementation(() => [true])
})

const testComponent = (
    <AuthContext.Provider value={authContextValues}>
        <AlertContext.Provider value={mockAlertValue}>
            <NavigationContext.Provider value={navContext}>
                <CreateAccountScreen navigation={mockNavigation} />
            </NavigationContext.Provider>
        </AlertContext.Provider>
    </AuthContext.Provider >
)

describe('on loading', () => {
    it('shows loading', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { getAllByText } = render(testComponent)

        expect(getAllByText('Loading...').length).toBe(1)
    })

    it('doesn\'t render default elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByText } = render(testComponent)

        expect(queryAllByText("Username").length).toBe(0)
        expect(queryAllByText("Email Address").length).toBe(0)
        expect(queryAllByText("Password").length).toBe(0)
        expect(queryAllByText("Confirm Password").length).toBe(0)
        expect(queryAllByText("Terms and Conditions").length).toBe(0)
        expect(queryAllByText("Read our terms and conditions.").length).toBe(0)
        expect(queryAllByText("I accept").length).toBe(0)
        expect(queryAllByText("Sign Up").length).toBe(0)
    })
})

describe('on load', () => {
    it('renders default elements', () => {
        const { getAllByText } = render(testComponent)

        expect(getAllByText("Username").length).toBe(1)
        expect(getAllByText("Email Address").length).toBe(1)
        expect(getAllByText("Password").length).toBe(1)
        expect(getAllByText("Confirm Password").length).toBe(1)
        expect(getAllByText("Terms and Conditions").length).toBe(1)
        expect(getAllByText("Read our terms and conditions.").length).toBe(1)
        expect(getAllByText("I accept").length).toBe(1)
        expect(getAllByText("Sign Up").length).toBe(1)
    });

    it('renders default styles', () => {
        const { getByTestId } = render(testComponent)

        const container = getByTestId('SignUp.container')
        const usernameInputContainer = getByTestId('SignUp.usernameInputContainer')
        const usernameLabel = getByTestId('SignUp.usernameLabel')
        const usernameInput = getByTestId('SignUp.usernameInput')
        const emailInputContainer = getByTestId('SignUp.emailInputContainer')
        const emailLabel = getByTestId('SignUp.emailLabel')
        const emailInput = getByTestId('SignUp.emailInput')
        const passwordInputContainer = getByTestId('SignUp.passwordInputContainer')
        const innerPasswordInputContainer = getByTestId('SignUp.innerPasswordInputContainer')
        const passwordLabel = getByTestId('SignUp.passwordLabel')
        const passwordInput = getByTestId('SignUp.passwordInput')
        const confPasswordInputContainer = getByTestId('SignUp.confPasswordInputContainer')
        const innerconfPasswordInputContainer = getByTestId('SignUp.innerconfPasswordInputContainer')
        const confPasswordLabel = getByTestId('SignUp.confPasswordLabel')
        const confPasswordInput = getByTestId('SignUp.confPasswordInput')
        const termsAndCondContainer = getByTestId('SignUp.termsAndCondContainer')
        const termsInputLabel = getByTestId('SignUp.termsInputLabel')
        const termsAndCondText = getByTestId('SignUp.termsAndCondText')
        const termsAndCondLink = getByTestId('SignUp.termsAndCondLink')
        const termsAndCondAcceptText = getByTestId('SignUp.termsAndCondAcceptText')
        const checkboxContainer = getByTestId('SignUp.checkboxContainer')

        expect(container.props.style).toBe(globalStyles.authContainer)
        expect(usernameInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(usernameLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(usernameLabel.props.style[1].color).toBe(Colors.dark)
        expect(usernameInput.props.style[0]).toBe(globalStyles.input)
        expect(usernameInput.props.style[1].borderColor).toBe(Colors.midLight)
        expect(emailInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(emailLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(emailLabel.props.style[1].color).toBe(Colors.dark)
        expect(emailInput.props.style[0]).toBe(globalStyles.input)
        expect(emailInput.props.style[1].borderColor).toBe(Colors.midLight)
        expect(passwordInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(passwordLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(passwordLabel.props.style[1].color).toBe(Colors.dark)
        expect(innerPasswordInputContainer.props.style[0]).toBe(globalStyles.passwordInputContainer)
        expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.midLight)
        expect(passwordInput.props.style).toBe(globalStyles.passwordInput)
        expect(confPasswordInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(confPasswordLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(confPasswordLabel.props.style[1].color).toBe(Colors.dark)
        expect(innerconfPasswordInputContainer.props.style[0]).toBe(globalStyles.passwordInputContainer)
        expect(innerconfPasswordInputContainer.props.style[1].borderColor).toBe(Colors.midLight)
        expect(confPasswordInput.props.style).toBe(globalStyles.passwordInput)
        expect(termsAndCondContainer.props.style).toBe(globalStyles.termsAndCondContainer)
        expect(termsInputLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(termsInputLabel.props.style[1].color).toBe(Colors.dark)
        expect(termsAndCondText.props.style).toBe(globalStyles.termsAndCondText)
        expect(termsAndCondLink.props.style).toStrictEqual({ textDecorationLine: 'underline' })
        expect(checkboxContainer.props.style).toStrictEqual({ flexDirection: 'row' })
        expect(termsAndCondAcceptText.props.style).toBe(globalStyles.termsAndCondAcceptText)
    });

    it('does not navigate to the home page if user is not logged in', () => {
        render(testComponent)

        expect(mockNavigation.navigate).not.toBeCalled()
    })

    it('navigates to the home page when the user is logged in', () => {
        render(
            <AuthContext.Provider value={{ ...authContextValues, user: "User" }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <CreateAccountScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider >
        )

        expect(mockNavigation.navigate).toBeCalledWith('HomeScreen')
    })
})

describe('events on Sign Up button press', () => {
    it('calls preventDefault', async () => {
        const { getByTestId } = render(testComponent)
        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    describe('when not entering username', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const usernameErrMsgContainer = getByTestId('SignUp.usernameErrMsgContainer')
            const usernameErrMsg = getByTestId('SignUp.usernameErrMsg')

            expect(queryAllByText("Please enter a username").length).toBe(1)
            expect(usernameErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(usernameErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes username label and text input\'s styles', async () => {
            const { getByTestId } = render(testComponent)

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const usernameLabel = getByTestId('SignUp.usernameLabel')
            const usernameInput = getByTestId('SignUp.usernameInput')

            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)

            await act(() => {
                fireEvent.changeText(usernameInput, 'username')
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(usernameLabel.props.style[1].color).toBe(Colors.dark)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    describe('when entering invalid username', () => {
        it('starts with \"__\"', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.changeText(usernameInput, '__username')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(queryAllByText("Username shouldn't include \"__\"").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('ends with \"__\"', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.changeText(usernameInput, 'username__')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(queryAllByText("Username shouldn't include \"__\"").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('includes \"__\"', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.changeText(usernameInput, 'user__name')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(queryAllByText("Username shouldn't include \"__\"").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('length < 5', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.changeText(usernameInput, 'user')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(queryAllByText("Username shouldn't include \"__\"").length).toBe(0)
            expect(queryAllByText("Username length should be at least 5 characters").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('length > 50', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const usernameInput = getByTestId('SignUp.usernameInput')
            const usernameLabel = getByTestId('SignUp.usernameLabel')

            await act(() => {
                fireEvent.changeText(usernameInput,
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit accumsan.')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(queryAllByText("Username shouldn't include \"__\"").length).toBe(0)
            expect(queryAllByText("Username length should be 50 characters or less").length).toBe(1)
            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })
    })

    describe('when entering username but not email', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            const usernameInput = getByTestId('SignUp.usernameInput')
            await act(() => {
                fireEvent.changeText(usernameInput, 'username')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const emailErrMsgContainer = getByTestId('SignUp.emailErrMsgContainer')
            const emailErrMsg = getByTestId('SignUp.emailErrMsg')

            expect(queryAllByText("Please enter an email").length).toBe(1)
            expect(emailErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(emailErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes email label and text input\'s styles', async () => {
            const { getByTestId } = render(testComponent)

            const usernameInput = getByTestId('SignUp.usernameInput')
            await act(() => {
                fireEvent.changeText(usernameInput, 'username')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const emailLabel = getByTestId('SignUp.emailLabel')
            const emailInput = getByTestId('SignUp.emailInput')

            expect(emailLabel.props.style[1].color).toBe(Colors.alert2)
            expect(emailInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const emailLabel = getByTestId('SignUp.emailLabel')
            const emailInput = getByTestId('SignUp.emailInput')

            const usernameInput = getByTestId('SignUp.usernameInput')
            await act(() => {
                fireEvent.changeText(usernameInput, 'username')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter an email").length).toBe(1)
            expect(emailLabel.props.style[1].color).toBe(Colors.alert2)
            expect(emailInput.props.style[1].borderColor).toBe(Colors.alert2)

            await act(() => {
                fireEvent.changeText(emailInput, 'email')
            })

            expect(queryAllByText("Please enter an email").length).toBe(0)
            expect(emailLabel.props.style[1].color).toBe(Colors.dark)
            expect(emailInput.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    describe('when entering invalid email', () => {
        it('shows invalid message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)
            const emailLabel = getByTestId('SignUp.emailLabel')
            const emailInput = getByTestId('SignUp.emailInput')

            const usernameInput = getByTestId('SignUp.usernameInput')
            await act(() => {
                fireEvent.changeText(usernameInput, 'username')
                fireEvent.changeText(emailInput, 'email')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please enter an email").length).toBe(0)
            expect(queryAllByText("Please enter a valid email").length).toBe(1)
            expect(emailLabel.props.style[1].color).toBe(Colors.alert2)
            expect(emailInput.props.style[1].borderColor).toBe(Colors.alert2)
        })
    })

    describe('when not entering password', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const passwordErrMsgContainer = getByTestId('SignUp.passwordErrMsgContainer')
            const passwordErrMsg = getByTestId('SignUp.passwordErrMsg')

            expect(queryAllByText("Please enter a password").length).toBe(1)
            expect(passwordErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(passwordErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes password label and text input\'s styles', async () => {
            const { getByTestId } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const passwordLabel = getByTestId('SignUp.passwordLabel')
            const innerPasswordInputContainer = getByTestId('SignUp.innerPasswordInputContainer')

            expect(passwordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const passwordLabel = getByTestId('SignUp.passwordLabel')
            const passwordInput = getByTestId('SignUp.passwordInput')
            const innerPasswordInputContainer = getByTestId('SignUp.innerPasswordInputContainer')

            expect(queryAllByText("Please enter a password").length).toBe(1)
            expect(passwordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)

            await act(() => {
                fireEvent.changeText(passwordInput, 'password')
            })

            expect(queryAllByText("Please enter a password").length).toBe(0)
            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(passwordLabel.props.style[1].color).toBe(Colors.dark)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    describe('when entering invalid password', () => {
        it('lenght < 4', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            const passwordLabel = getByTestId('SignUp.passwordLabel')
            const innerPasswordInputContainer = getByTestId('SignUp.innerPasswordInputContainer')

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'pas')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Password length should be 4 characters or more").length).toBe(1)
            expect(passwordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('lenght > 64', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            const passwordLabel = getByTestId('SignUp.passwordLabel')
            const innerPasswordInputContainer = getByTestId('SignUp.innerPasswordInputContainer')

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'),
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Password length should be 64 characters or less").length).toBe(1)
            expect(passwordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })
    })

    describe('when not entering a confirmation password', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const confPasswordErrMsgContainer = getByTestId('SignUp.confPasswordErrMsgContainer')
            const confPasswordErrMsg = getByTestId('SignUp.confPasswordErrMsg')

            expect(queryAllByText("Please enter a confirmation password").length).toBe(1)
            expect(confPasswordErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(confPasswordErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes password label and text input\'s styles', async () => {
            const { getByTestId } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const confPasswordLabel = getByTestId('SignUp.confPasswordLabel')
            const innerconfPasswordInputContainer = getByTestId('SignUp.innerconfPasswordInputContainer')

            expect(confPasswordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerconfPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const confPasswordLabel = getByTestId('SignUp.confPasswordLabel')
            const innerconfPasswordInputContainer = getByTestId('SignUp.innerconfPasswordInputContainer')

            expect(queryAllByText("Please enter a confirmation password").length).toBe(1)
            expect(confPasswordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerconfPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
            })

            expect(queryAllByText("Please enter a confirmation password").length).toBe(0)
            expect(confPasswordLabel.props.style[1].color).toBe(Colors.dark)
            expect(innerconfPasswordInputContainer.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    describe('when password and confirmation password don\'t match', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
                fireEvent.changeText(getByTestId('SignUp.confPasswordInput'), 'passwor')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const confPasswordLabel = getByTestId('SignUp.confPasswordLabel')
            const innerconfPasswordInputContainer = getByTestId('SignUp.innerconfPasswordInputContainer')

            expect(queryAllByText("The passwords you entered do not match").length).toBe(1)
            expect(confPasswordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerconfPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })
    })

    describe('when terms and conditions not accepted', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
                fireEvent.changeText(getByTestId('SignUp.confPasswordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            expect(queryAllByText("Please accept terms and conditions").length).toBe(1)
        })

        it('changes styles', async () => {
            const { getByTestId } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
                fireEvent.changeText(getByTestId('SignUp.confPasswordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const termsInputLabel = getByTestId('SignUp.termsInputLabel')
            const termsAndCondErrMsg = getByTestId('SignUp.termsAndCondErrMsg')

            expect(termsInputLabel.props.style[1].color).toBe(Colors.alert2)
            expect(termsAndCondErrMsg.props.style).toStrictEqual({
                fontFamily: 'PublicSans_400Regular',
                fontSize: 13,
                color: Colors.alert2
            })
        })

        it('removes error message and styles when checkbox is pressed', async () => {
            const { getByTestId, queryAllByText } = render(testComponent)

            await act(() => {
                fireEvent.changeText(getByTestId('SignUp.usernameInput'), 'username')
                fireEvent.changeText(getByTestId('SignUp.emailInput'), 'email@test.com')
                fireEvent.changeText(getByTestId('SignUp.passwordInput'), 'password')
                fireEvent.changeText(getByTestId('SignUp.confPasswordInput'), 'password')
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
            })

            const termsInputLabel = getByTestId('SignUp.termsInputLabel')
            const termsAndCondErrMsg = getByTestId('SignUp.termsAndCondErrMsg')

            expect(queryAllByText("Please accept terms and conditions").length).toBe(1)
            expect(termsInputLabel.props.style[1].color).toBe(Colors.alert2)
            expect(termsAndCondErrMsg.props.style).toStrictEqual({
                fontFamily: 'PublicSans_400Regular',
                fontSize: 13,
                color: Colors.alert2
            })

            await act(() => {
                fireEvent.press(getByTestId("SignUp.checkbox"))
            })

            expect(queryAllByText("Please accept terms and conditions").length).toBe(0)
            expect(termsInputLabel.props.style[1].color).toBe(Colors.dark)
        })
    })

    it('calls dispatch function to SIGNUP_START', async () => {
        const { getByTestId } = render(testComponent)
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
        const { getByTestId } = render(testComponent)
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
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })


        expect(spyCreateUser).toBeCalled()
        expect(spyCreateUser).toBeCalledWith({
            "username": 'username',
            "email": 'email@email.com',
            "password": 'password',
            "confPassword": 'password'
        }, true)
    })
})

describe('createUser function', () => {
    it('calls dispatch when the post requests resolves', async () => {
        const { getByTestId } = render(testComponent)
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
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(spyCreateUser).toBeCalledWith({
            "username": 'username',
            "email": 'email@email.com',
            "password": 'password',
            "confPassword": 'password'
        }, true)
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "SIGNUP_SUCCESS" })
    })

    it('shows Account created successfully! when the post requests resolves', async () => {
        const { getByTestId } = render(testComponent)
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
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

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
        const { getByTestId } = render(testComponent)
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
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "SIGNUP_SUCCESS" })
        expect(mockNavigation.navigate).toBeCalledWith('LoginScreen')
    })

    it('calls dispatch with SIGNUP_FAILURE when the response login fails', async () => {
        const { getByTestId } = render(testComponent)
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
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

        await act(() => {
            fireEvent.press(getByTestId("SignUp.Button"), mockEvent)
        })

        expect(spyCreateUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": { "data": "data" }, "type": "SIGNUP_FAILURE" })
        expect(mockNavigation.navigate).not.toBeCalledWith('LoginScreen')
    })
})

describe('terms and conditions checkbox', () => {
    it('renders with checkbox unchecked', () => {
        const { getByTestId } = render(testComponent)
        const checkbox = getByTestId('SignUp.checkbox').parent.parent

        expect(checkbox.props.name).toBe('checkbox-blank-outline')
    })

    it('checkbox icon changes when checked', async () => {
        const { getByTestId } = render(testComponent)
        const checkbox = getByTestId('SignUp.checkbox').parent.parent

        await act(() => {
            fireEvent.press(getByTestId("SignUp.checkbox"))
        })

        expect(checkbox.props.name).toBe('checkbox-marked')
    })
})