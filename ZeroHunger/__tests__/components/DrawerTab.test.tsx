import { act, fireEvent, render } from "@testing-library/react-native"
import { AuthContext } from "../../src/context/AuthContext"
import { NavigationContainer } from "@react-navigation/native"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DrawerTab from "../../src/components/DrawerTab"
import { mock } from "jest-mock-extended"
import { useFonts } from "@expo-google-fonts/public-sans"
import { globalStyles } from "../../styles/globalStyleSheet"
import * as Utils from "../../src/controllers/auth";
import MockAdapter from "axios-mock-adapter"
import { axiosInstance } from "../../config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../../styles/components/drawerTabStyleSheet"

jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))

const mockDispatch = jest.fn()
const mockAxios = new MockAdapter(axiosInstance)
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}
const mockAuthContextValues = {
    user: { username: "testUser" },
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: mockDispatch
}

mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks();
    spyLogOutUser.mockReset()
    mockAxios.resetHistory()
})

const TestComponent = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={mockAuthContextValues}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ZeroHunger"
                            component={DrawerTab}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

const TestComponentLoggedOut = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={{ ...mockAuthContextValues, user: '' }}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ZeroHunger"
                            component={DrawerTab}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

describe('on loading', () => {
    it('shows loading', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { getAllByText } = render(<TestComponent />)

        expect(getAllByText('Loading...').length).toBe(2)
    })

    it('doesn\'t show default elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByText, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Drawer.closed').length).toBe(0)
        expect(queryAllByTestId('Drawer.usernameCont').length).toBe(0)
        expect(queryAllByTestId('Drawer.username').length).toBe(0)
        expect(queryAllByText('testUser').length).toBe(0)
        expect(queryAllByTestId('Drawer.accSettBtn').length).toBe(0)
        expect(queryAllByTestId('Drawer.accSettBtnLabel').length).toBe(0)
        expect(queryAllByText('Account Settings').length).toBe(0)
        expect(queryAllByTestId('Drawer.closeBtn').length).toBe(0)
        expect(queryAllByTestId('Drawer.historyBtn').length).toBe(0)
        expect(queryAllByText('Request & Offer History').length).toBe(0)
        expect(queryAllByTestId('Drawer.dietRestBtn').length).toBe(0)
        expect(queryAllByText('Dietary Restrictions').length).toBe(0)
        expect(queryAllByTestId('Drawer.notifSettBtn').length).toBe(0)
        expect(queryAllByText('Notifications Settings').length).toBe(0)
        expect(queryAllByTestId('Drawer.FAQBtn').length).toBe(0)
        expect(queryAllByText('FAQ').length).toBe(0)
        expect(queryAllByTestId('Drawer.termsBtn').length).toBe(0)
        expect(queryAllByText('Terms and Conditions').length).toBe(0)
        expect(queryAllByTestId('Drawer.policyBtn').length).toBe(0)
        expect(queryAllByText('Privacy Policy').length).toBe(0)
        expect(queryAllByTestId('Drawer.logOutBtn').length).toBe(0)
        expect(queryAllByText('Log Out').length).toBe(0)
    })
})

describe('onload', () => {
    describe('default elements', () => {
        it('renders default elements', async () => {
            const { getAllByText, getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('Drawer.closed').length).toBe(1)
            expect(getAllByTestId('Drawer.usernameCont').length).toBe(1)
            expect(getAllByTestId('Drawer.username').length).toBe(1)
            expect(getAllByText('testUser').length).toBe(1)
            expect(getAllByTestId('Drawer.accSettBtn').length).toBe(1)
            expect(getAllByTestId('Drawer.accSettBtnLabel').length).toBe(1)
            expect(getAllByText('Account Settings').length).toBe(1)
            expect(getAllByTestId('Drawer.closeBtn').length).toBe(1)
            expect(getAllByTestId('Drawer.historyBtn').length).toBe(1)
            expect(getAllByText('Request & Offer History').length).toBe(1)
            expect(getAllByTestId('Drawer.dietRestBtn').length).toBe(1)
            expect(getAllByText('Dietary Restrictions').length).toBe(1)
            expect(getAllByTestId('Drawer.notifSettBtn').length).toBe(1)
            expect(getAllByText('Notifications Settings').length).toBe(1)
            expect(getAllByTestId('Drawer.FAQBtn').length).toBe(1)
            expect(getAllByText('FAQ').length).toBe(1)
            expect(getAllByTestId('Drawer.termsBtn').length).toBe(1)
            expect(getAllByText('Terms and Conditions').length).toBe(1)
            expect(getAllByTestId('Drawer.policyBtn').length).toBe(1)
            expect(getAllByText('Privacy Policy').length).toBe(1)
            expect(getAllByTestId('Drawer.logOutBtn').length).toBe(1)
            expect(getAllByText('Log Out').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(<TestComponent />)

            expect(getByTestId('Drawer.closed').props.style).toStrictEqual(styles.drawerContainer)
            expect(getByTestId('Drawer.usernameCont').props.style).toStrictEqual({ padding: 4, marginLeft: -25 })
            expect(getByTestId('Drawer.username').props.style[0]).toStrictEqual(globalStyles.H2)
            expect(getByTestId('Drawer.username').props.style[1]).toStrictEqual({ paddingBottom: 8 })
            expect(getByTestId('Drawer.accSettBtnLabel').props.style).toStrictEqual(globalStyles.Body)
            expect(getByTestId('Drawer.accSettBtnLabel').props.style).toStrictEqual(globalStyles.Body)
            expect(getByTestId('Drawer.logOutBtn').parent.parent.props.style[0]).toStrictEqual(styles.logOutBtn)
            expect(getByTestId('Drawer.logOutBtnText').props.style).toStrictEqual(styles.logOutBtnText)
        })
    })

    describe('username', () => {
        it('shows username if user is logged in', () => {
            const { getByText } = render(<TestComponent />)

            getByText("testUser")
        })

        it('shows "User" if user is not logged in', () => {
            const { getByText } = render(<TestComponentLoggedOut />)

            getByText("User")
        })
    })
})

describe('buttons', () => {
    it('navigates to AccountSettingsScreen when button is pressed', async () => {
        const { getByTestId, queryAllByText } = render(<TestComponent />)

        expect(queryAllByText('Delete User').length).toBe(0)

        const button = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(button)
        })

        expect(queryAllByText('Delete User').length).toBe(1)
    })
})

describe('handling log out', () => {
    it('calls logOutUser when button is pressed', async () => {
        const { getByTestId } = render(<TestComponent />)

        const button = getByTestId('Drawer.logOutBtn')
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(button)
        })

        expect(spyLogOutUser).toBeCalled()
    })

    it('calls dispatch when the post requests resolves', async () => {
        const { getByTestId } = render(<TestComponent />)

        const button = getByTestId('Drawer.logOutBtn')
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(button)
        })

        expect(mockDispatch).toBeCalled()
        expect(mockDispatch).toBeCalledWith({ type: "LOGOUT", payload: null })
    })

    it('gives success alert when the post request resolves', async () => {
        const { getByTestId } = render(<TestComponent />)

        const button = getByTestId('Drawer.logOutBtn')
        spyLogOutUser.mockResolvedValue()


        await act(() => {
            fireEvent.press(button)
        })
        expect(mockAlertDispatch).toBeCalledWith({ "alertType": "success", "message": "Logged out successfully!", "type": "open" })
    })
})

describe('logOutUser function', () => {
    it('calls AsyncStorage.getItem', async () => {
        const { getByTestId } = render(<TestComponent />)
        mockAxios.onPost('users/logOut').reply(200, {})

        const button = getByTestId('Drawer.logOutBtn')
        await act(() => {
            fireEvent.press(button)
        })

        expect(AsyncStorage.getItem).toBeCalled()
        expect(AsyncStorage.getItem).toBeCalledWith('refresh_token')
    })

    it('calls AsyncStorage.clear when post request resolves', async () => {
        const { getByTestId } = render(<TestComponent />)
        mockAxios.onPost('users/logOut').reply(200, {})

        const button = getByTestId('Drawer.logOutBtn')
        await act(() => {
            fireEvent.press(button)
        })

        expect(AsyncStorage.clear).toBeCalled()
    })
})
