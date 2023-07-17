import React from "react";
import HomeScreen from "../../src/screens/HomeScreen";
import * as Utils from "../../src/controllers/auth";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../src/screens/Loginscreen";
import styles from "../../styles/screens/homeStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet";
import { useFonts } from '@expo-google-fonts/public-sans';
import BottomTab from "../../src/components/BottomTab";
import DrawerTab from "../../src/components/DrawerTab";


jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))
jest.mock('jwt-decode', () => () => ({}))

const mockAxios = new MockAdapter(axiosInstance)
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}
const mockUser = { username: 'test', user_id: '1' }
const mockAuthContextValues = {
    user: "",
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: null
}

const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')

mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks()
    spyLogOutUser.mockReset()
    mockAxios.resetHistory()
})

const TestComponentLoggedOut = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={mockAuthContextValues}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}
const TestComponent = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={{ ...mockAuthContextValues, user: mockUser, accessToken: "token" }}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ZeroHunger"
                            component={DrawerTab}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="BottomTab"
                            component={BottomTab}
                        />
                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
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
        const { queryAllByText, queryAllByTestId, getByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Home.drawerBtn').length).toBe(1)
        expect(queryAllByTestId('Home.searchBtn').length).toBe(1)
        expect(queryAllByTestId('Home.notificationBtn').length).toBe(1)
        expect(queryAllByTestId('Home.container').length).toBe(1)
        expect(queryAllByTestId('Home.subContainer').length).toBe(0)
        expect(queryAllByTestId('Home.requestsContainer').length).toBe(0)
        expect(queryAllByTestId('Home.requestsBtn').length).toBe(0)
        expect(queryAllByTestId('Home.requestsLabel').length).toBe(0)
        expect(queryAllByText('Requests').length).toBe(0)
        expect(queryAllByTestId('Home.offersContainer').length).toBe(0)
        expect(queryAllByTestId('Home.offersBtn').length).toBe(0)
        expect(queryAllByTestId('Home.offersLabel').length).toBe(0)
        expect(queryAllByText('Offers').length).toBe(0)
        expect(queryAllByTestId('Home.categoriesContainer').length).toBe(0)
        expect(queryAllByTestId('Bottom.homeNav').length).toBe(2)
        expect(queryAllByTestId('Bottom.homeNavIcon').length).toBe(1)
        expect(queryAllByTestId('Bottom.homeNavIconOutline').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNav').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavIcon').length).toBe(1)
        expect(queryAllByTestId('Bottom.messagesNav').length).toBe(2)
        expect(queryAllByTestId('Bottom.messagesNavIcon').length).toBe(1)
        expect(queryAllByTestId('Bottom.messagesNavIconOutline').length).toBe(1)
    })
})

describe('onload', () => {
    describe('default elements', () => {
        it('renders default elements', async () => {
            const { getAllByText, getAllByTestId, queryAllByTestId } = render(<TestComponent />)

            expect(queryAllByTestId('Drawer.open').length).toBe(0)
            expect(getAllByTestId('Drawer.closed').length).toBe(1)
            expect(getAllByTestId('Home.drawerBtn').length).toBe(1)
            expect(getAllByTestId('Home.searchBtn').length).toBe(1)
            expect(getAllByTestId('Home.notificationBtn').length).toBe(1)
            expect(getAllByTestId('Home.container').length).toBe(1)
            expect(getAllByTestId('Home.subContainer').length).toBe(1)
            expect(getAllByTestId('Home.requestsContainer').length).toBe(1)
            expect(getAllByTestId('Home.requestsBtn').length).toBe(1)
            expect(getAllByTestId('Home.requestsLabel').length).toBe(1)
            expect(getAllByText('Requests').length).toBe(1)
            expect(getAllByTestId('Home.offersContainer').length).toBe(1)
            expect(getAllByTestId('Home.offersBtn').length).toBe(1)
            expect(getAllByTestId('Home.offersLabel').length).toBe(1)
            expect(getAllByText('Offers').length).toBe(1)
            expect(getAllByTestId('Home.categoriesContainer').length).toBe(1)
            expect(getAllByTestId('Bottom.homeNav').length).toBe(2)
            expect(getAllByTestId('Bottom.homeNavIcon').length).toBe(1)
            expect(getAllByTestId('Bottom.homeNavIconOutline').length).toBe(1)
            expect(getAllByTestId('Bottom.postNav').length).toBe(1)
            expect(getAllByTestId('Bottom.postNavIcon').length).toBe(1)
            expect(getAllByTestId('Bottom.messagesNav').length).toBe(2)
            expect(getAllByTestId('Bottom.messagesNavIcon').length).toBe(1)
            expect(getAllByTestId('Bottom.messagesNavIconOutline').length).toBe(1)
            await waitFor(() => {
                expect(getAllByText('No requests available').length).toBe(1)
            })
        })

        it('renders default styles', () => {
            const { getByTestId } = render(<TestComponent />)

            expect(getByTestId('Home.container').props.style).toStrictEqual(styles.container)
            expect(getByTestId('Home.subContainer').props.style).toStrictEqual(styles.subContainer)
            expect(getByTestId('Home.requestsContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 100)" })
            expect(getByTestId('Home.requestsContainer').props.style[1]).toStrictEqual(styles.pressable)
            expect(getByTestId('Home.requestsBtn').props.style).toStrictEqual(styles.pressableText)
            expect(getByTestId('Home.requestsLabel').props.style).toStrictEqual(globalStyles.H3)
            expect(getByTestId('Home.offersContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 0)" })
            expect(getByTestId('Home.offersContainer').props.style[1]).toStrictEqual(styles.pressable)
            expect(getByTestId('Home.offersBtn').props.style).toStrictEqual(styles.pressableText)
            expect(getByTestId('Home.offersLabel').props.style).toStrictEqual(globalStyles.H3)
            expect(getByTestId('Home.categoriesContainer').props.style).toStrictEqual(styles.categoriesContainer)
        })
    })

    it('navigates to login screen if user is not logged in', () => {
        const { queryAllByTestId } = render(<TestComponentLoggedOut />)

        expect(queryAllByTestId('Login.container').length).toBe(1)
    })

    it('doesnt navigate to login screen if user is logged in', () => {
        const { queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Login.container').length).toBe(0)
    })
})

describe('switching between requests and offers', () => {
    it('default on requests', () => {
        const { getByTestId } = render(<TestComponent />)

        expect(getByTestId('Home.requestsContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 100)" })
        expect(getByTestId('Home.offersContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 0)" })
    })

    it('switches to offers when offers button is pressed', async () => {
        const { getByTestId, queryAllByText } = render(<TestComponent />)

        const offersBtn = getByTestId('Home.offersBtn')
        await act(() => {
            fireEvent.press(offersBtn)
        })

        expect(getByTestId('Home.requestsContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 0)" })
        expect(getByTestId('Home.offersContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 100)" })
        await waitFor(() => {
            expect(queryAllByText('No offers available').length).toBe(1)
            expect(queryAllByText('No requests available').length).toBe(0)
        })
    })

    it('switches back to requests when requests button is pressed', async () => {
        const { getByTestId, queryAllByText } = render(<TestComponent />)

        const offersBtn = getByTestId('Home.offersBtn')
        const requestsBtn = getByTestId('Home.requestsBtn')
        await act(() => {
            fireEvent.press(offersBtn)
        })

        expect(getByTestId('Home.requestsContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 0)" })
        expect(getByTestId('Home.offersContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 100)" })

        await act(() => {
            fireEvent.press(requestsBtn)
        })

        expect(getByTestId('Home.requestsContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 100)" })
        expect(getByTestId('Home.offersContainer').props.style[0]).toStrictEqual({ "borderBottomColor": "rgba(48, 103, 117, 0)" })
        await waitFor(() => {
            expect(queryAllByText('No requests available').length).toBe(1)
            expect(queryAllByText('No offers available').length).toBe(0)
        })
    })
})

describe('header nav', () => {
    describe('drawer tab', () => {
        it('is closed by default', () => {
            const { queryAllByTestId } = render(<TestComponent />)

            expect(queryAllByTestId('Drawer.open').length).toBe(0)
            expect(queryAllByTestId('Drawer.closed').length).toBe(1)
        })

        it('opens when button is pressed', async () => {
            const { getByTestId, queryAllByTestId } = render(<TestComponent />)
            const openDrawerBtn = getByTestId('Home.drawerBtn')

            expect(queryAllByTestId('Drawer.open').length).toBe(0)
            expect(queryAllByTestId('Drawer.closed').length).toBe(1)
            await act(() => {
                fireEvent.press(openDrawerBtn)
            })
            expect(queryAllByTestId('Drawer.open').length).toBe(1)
            expect(queryAllByTestId('Drawer.closed').length).toBe(0)
        })

        it('closes when button is pressed', async () => {
            const { getByTestId, queryAllByTestId } = render(<TestComponent />)
            const openDrawerBtn = getByTestId('Home.drawerBtn')
            const closeDrawerBtn = getByTestId('Drawer.closeBtn')

            await act(() => {
                fireEvent.press(openDrawerBtn)
            })

            expect(queryAllByTestId('Drawer.open').length).toBe(1)
            expect(queryAllByTestId('Drawer.closed').length).toBe(0)

            await act(() => {
                fireEvent.press(closeDrawerBtn)
            })

            expect(queryAllByTestId('Drawer.open').length).toBe(0)
            expect(queryAllByTestId('Drawer.closed').length).toBe(1)
        })
    })
})
