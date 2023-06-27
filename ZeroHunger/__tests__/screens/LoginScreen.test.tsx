import React from "react";
import { Linking } from "react-native";
import LoginScreen from "../../src/screens/Loginscreen";
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import { NavigationContext } from "@react-navigation/native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { useFonts } from '@expo-google-fonts/public-sans';


jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))

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

const spyLogInUser = jest.spyOn(Utils, 'logInUser')
const spyCanOpenURL = jest.spyOn(Linking, 'canOpenURL')
const spyOpenURL = jest.spyOn(Linking, 'openURL')

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks()
})

const passwordResetURL = 'zh-backend-azure-webapp.azurewebsites.net/users/reset_password/'
const styles = {
    container: {
        backgroundColor: "#EFF1F7",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        padding: 0,
        gap: 10,
        marginTop: 20,
        marginBottom: -10
    },
    dividerLine: {
        height: 1,
        flex: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#B8B8B8',
    },
    dividerText: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark
    }
}


describe('on loading', () => {
    it('shows loading', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { getAllByText } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider >
        )

        expect(getAllByText('Loading...').length).toBe(1)
    })

    it('doesn\'t show default elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByText } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider >
        )

        expect(queryAllByText("Username").length).toBe(0)
        expect(queryAllByText("Password").length).toBe(0)
        expect(queryAllByText("Forgot password?").length).toBe(0)
        expect(queryAllByText("Login").length).toBe(0)
        expect(queryAllByText("OR").length).toBe(0)
        expect(queryAllByText("Sign Up").length).toBe(0)
    })
})

describe('on load', () => {
    it('renders default elements', () => {
        const { getAllByText } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider >
        )

        expect(getAllByText("Username").length).toBe(1)
        expect(getAllByText("Password").length).toBe(1)
        expect(getAllByText("Forgot password?").length).toBe(1)
        expect(getAllByText("Login").length).toBe(1)
        expect(getAllByText("OR").length).toBe(1)
        expect(getAllByText("Sign Up").length).toBe(1)
    });

    it('renders default styles', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider >
        )

        const container = getByTestId('Login.container')
        const usernameInputContainer = getByTestId('Login.usernameInputContainer')
        const usernameLabel = getByTestId('Login.usernameLabel')
        const usernameInput = getByTestId('Login.usernameInput')
        const passwordInputContainer = getByTestId('Login.passwordInputContainer')
        const innerPasswordInputContainer = getByTestId('Login.innerPasswordInputContainer')
        const passwordLabel = getByTestId('Login.passwordLabel')
        const passwordInput = getByTestId('Login.passwordInput')
        const forgotPassword = getByTestId('Login.forgotPassword')
        const loginButton = getByTestId('Login.Button')
        const loginButtonLabel = getByTestId('Login.ButtonLabel')
        const SignUpButton = getByTestId('SignUp.Button')
        const SignUpButtonLabel = getByTestId('SignUp.ButtonLabel')
        const divider = getByTestId('divider')
        const dividerLine1 = getByTestId('dividerLine1')
        const dividerLine2 = getByTestId('dividerLine2')
        const dividerText = getByTestId('dividerText')

        expect(container.props.style).toStrictEqual(styles.container)
        expect(usernameInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(usernameLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(usernameLabel.props.style[1].color).toBe(Colors.dark)
        expect(usernameInput.props.style[0]).toBe(globalStyles.input)
        expect(usernameInput.props.style[1].borderColor).toBe(Colors.midLight)
        expect(passwordInputContainer.props.style).toBe(globalStyles.inputContainer)
        expect(passwordLabel.props.style[0]).toBe(globalStyles.inputLabel)
        expect(passwordLabel.props.style[1].color).toBe(Colors.dark)
        expect(innerPasswordInputContainer.props.style[0]).toBe(globalStyles.passwordInputContainer)
        expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.midLight)
        expect(passwordInput.props.style).toBe(globalStyles.passwordInput)
        expect(forgotPassword.parent.parent.props.style).toStrictEqual({ width: '90%' })
        expect(forgotPassword.props.style).toBe(globalStyles.forgotPassword)
        expect(loginButton.parent.parent.props.style[0]).toBe(globalStyles.defaultBtn)
        expect(loginButtonLabel.props.style).toBe(globalStyles.defaultBtnLabel)
        expect(SignUpButton.parent.parent.props.style[0]).toBe(globalStyles.outlineBtn)
        expect(SignUpButtonLabel.props.style).toBe(globalStyles.outlineBtnLabel)
        expect(divider.props.style).toStrictEqual(styles.divider)
        expect(dividerLine1.props.style).toStrictEqual(styles.dividerLine)
        expect(dividerLine2.props.style).toStrictEqual(styles.dividerLine)
        expect(dividerText.props.style).toStrictEqual(styles.dividerText)
    });

    it('does not navigate to the home page if user is not logged in', () => {
        render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).not.toBeCalled()
    })

    it('navigates to the home page when the user is logged in', () => {
        render(
            <AuthContext.Provider value={{ user: "User", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).toBeCalledWith('HomeScreen')
    })
})

describe('events on login button press', () => {
    it('calls preventDefault', async () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <NavigationContext.Provider value={navContext}>
                    <LoginScreen navigation={mockNavigation} />
                </NavigationContext.Provider>
            </AlertContext.Provider>
        )

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(mockEvent.preventDefault).toBeCalled()
    })

    describe('when not entering username', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )

            spyLogInUser.mockResolvedValue({ msg: "Please enter a username", res: null })

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
            })


            const usernameErrMsgContainer = getByTestId('Login.usernameErrMsgContainer')
            const usernameErrMsg = getByTestId('Login.usernameErrMsg')

            expect(queryAllByText("Please enter a username").length).toBe(1)
            expect(queryAllByText("Please enter a password").length).toBe(0)
            expect(usernameErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(usernameErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes username label and text input\'s styles', async () => {
            const { getByTestId } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )

            spyLogInUser.mockResolvedValue({ msg: "Please enter a username", res: null })

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
            })

            const usernameLabel = getByTestId('Login.usernameLabel')
            const usernameInput = getByTestId('Login.usernameInput')

            expect(usernameLabel.props.style[1].color).toBe(Colors.alert2)
            expect(usernameInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText, getByText } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )
            spyLogInUser.mockResolvedValue({ msg: "Please enter a username", res: null })
            const usernameInput = getByTestId('Login.usernameInput')
            const usernameLabel = getByTestId('Login.usernameLabel')

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
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

    describe('when entering username but not password', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )

            spyLogInUser.mockResolvedValue({ msg: "Please enter a password", res: null })
            const usernameInput = getByTestId("Login.usernameInput")

            fireEvent.changeText(usernameInput, 'username')

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
            })

            const passwordErrMsgContainer = getByTestId('Login.passwordErrMsgContainer')
            const passwordErrMsg = getByTestId('Login.passwordErrMsg')

            expect(queryAllByText("Please enter a password").length).toBe(1)
            expect(queryAllByText("Please enter a username").length).toBe(0)
            expect(passwordErrMsgContainer.props.style).toBe(globalStyles.errorMsgContainer)
            expect(passwordErrMsg.props.style).toBe(globalStyles.errorMsg)
        })

        it('changes password label and text input\'s styles', async () => {
            const { getByTestId } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )
            spyLogInUser.mockResolvedValue({ msg: "Please enter a password", res: null })
            const usernameInput = getByTestId("Login.usernameInput")

            fireEvent.changeText(usernameInput, 'username')

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
            })

            const passwordLabel = getByTestId('Login.passwordLabel')
            const innerPasswordInputContainer = getByTestId('Login.innerPasswordInputContainer')

            expect(passwordLabel.props.style[1].color).toBe(Colors.alert2)
            expect(innerPasswordInputContainer.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and styles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            )
            spyLogInUser.mockResolvedValue({ msg: "Please enter a password", res: null })
            const passwordLabel = getByTestId('Login.passwordLabel')
            const passwordInput = getByTestId('Login.passwordInput')
            const innerPasswordInputContainer = getByTestId('Login.innerPasswordInputContainer')

            await act(() => {
                fireEvent.press(getByTestId("Login.Button"), mockEvent)
            })

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

    it('calls dispatch function to LOGIN_START', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(mockDispatch).toBeCalled()
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { "payload": null, "type": "LOGIN_START" })
    })

    it('calls logInUser function', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })
        mockAxios.onPost('users/token/').reply(200, { 'access': "token" })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({
            "username": 'username',
            "password": 'password',
            "expo_push_token": ""
        })
    })
})

describe('logInUser function', () => {
    it('calls dispatch when the post requests resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })
        mockAxios.onPost('users/token/').reply(200, { refresh: 'refresh_tokne', access: 'access_token' })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({
            "username": 'username',
            "password": 'password',
            "expo_push_token": ""
        })
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": { "token": { "access": "access_token", "refresh": "refresh_tokne" }, "user": {} }, "type": "LOGIN_SUCCESS" })
    })

    it('navigates the home page when the post request resolves', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "success", res: null })
        mockAxios.onPost('users/token/').reply(200, { refresh: 'refresh_tokne', access: 'access_token' })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(spyLogInUser).toBeCalledWith({
            "username": 'username',
            "password": 'password',
            "expo_push_token": ""
        })
        expect(mockNavigation.navigate).toBeCalledWith('HomeScreen')
    })

    it('calls dispatch with LOGIN_FAILURE when the response login fails', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "failure", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(spyLogInUser).toBeCalled()
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { "payload": null, "type": "LOGIN_FAILURE" })
    })

    it('shows invalid credentials alert when the response login fails', async () => {
        const { getByTestId, queryAllByText } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const usernameInput = getByTestId("Login.usernameInput")
        const passwordInput = getByTestId("Login.passwordInput")

        spyLogInUser.mockResolvedValue({ msg: "failure", res: null })

        fireEvent.changeText(usernameInput, 'username')
        fireEvent.changeText(passwordInput, 'password')

        await act(() => {
            fireEvent.press(getByTestId("Login.Button"), mockEvent)
        })

        expect(queryAllByText('Invalid credentials').length).toBe(1)
    })
})

describe('testing navigation', () => {
    it('navigates to CreateAccount screen when pressing Sign Up button', () => {
        const { getByTestId } = render(
            <AlertContext.Provider value={mockAlertValue}>
                <NavigationContext.Provider value={navContext}>
                    <LoginScreen navigation={mockNavigation} />
                </NavigationContext.Provider>
            </AlertContext.Provider>
        )

        const button = getByTestId("SignUp.Button")
        fireEvent.press(button)

        expect(mockNavigation.navigate).toBeCalledWith('CreateAccountScreen')
    })
})

describe('password recovery', () => {
    it('calls canOpenURL when pressing on the button', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )

        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith(passwordResetURL)
    })

    it('opens url if supported', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )

        spyCanOpenURL.mockResolvedValue(true)
        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith(passwordResetURL)
        await waitFor(() => {
            expect(spyOpenURL).toBeCalledWith(passwordResetURL)
        })
    })

    it('doesnt open url if not supported', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )

        spyCanOpenURL.mockResolvedValue(false)
        const button = getByTestId("passwordReset.Button")
        fireEvent.press(button)

        expect(spyCanOpenURL).toBeCalledWith(passwordResetURL)
        await waitFor(() => {
            expect(spyOpenURL).not.toBeCalled()
        })
    })
})

describe('password show/hide', () => {
    it('renders with eye-off icon', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const eyeIcon = getByTestId('eyeIcon').parent.parent.parent

        expect(eyeIcon.props.name).toBe("eye-off-outline")
    })

    it('eye icon changes when pressed', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const eyeIcon = getByTestId('eyeIcon').parent.parent.parent

        expect(eyeIcon.props.name).toBe("eye-off-outline")

        fireEvent.press(eyeIcon)

        expect(eyeIcon.props.name).toBe("eye-outline")
    })

    it('hides password when eye icon is off', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const eyeIcon = getByTestId('eyeIcon').parent.parent.parent
        const passwordInput = getByTestId('Login.passwordInput')

        expect(eyeIcon.props.name).toBe("eye-off-outline")
        expect(passwordInput.props.secureTextEntry).toBe(true)
    })

    it('shows password when eye icon is not off', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: mockDispatch }}>
                <AlertContext.Provider value={mockAlertValue}>
                    <NavigationContext.Provider value={navContext}>
                        <LoginScreen navigation={mockNavigation} />
                    </NavigationContext.Provider>
                </AlertContext.Provider>
            </AuthContext.Provider>
        )
        const eyeIcon = getByTestId('eyeIcon').parent.parent.parent
        const passwordInput = getByTestId('Login.passwordInput')

        expect(eyeIcon.props.name).toBe("eye-off-outline")
        expect(passwordInput.props.secureTextEntry).toBe(true)

        fireEvent.press(eyeIcon)

        expect(eyeIcon.props.name).toBe("eye-outline")
        expect(passwordInput.props.secureTextEntry).toBe(false)
    })
})