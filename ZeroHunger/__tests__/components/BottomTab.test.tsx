import React from "react";
import styles from "../../styles/components/bottomTabStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import HomeScreen from "../../src/screens/HomeScreen";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MockAdapter from "axios-mock-adapter"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from '@expo-google-fonts/public-sans';
import BottomTab from "../../src/components/BottomTab";
import DrawerTab from "../../src/components/DrawerTab";
import RequestFormScreen from "../../src/screens/RequestFormScreen";
import OfferFormScreen from "../../src/screens/OfferFormScreen";

jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))
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

mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks()
})

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
                            name="RequestFormScreen"
                            component={RequestFormScreen}
                        />
                        <Stack.Screen
                            name="OfferFormScreen"
                            component={OfferFormScreen}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

describe('on drawer loading', () => {
    it('shows loading', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { getAllByText } = render(<TestComponent />)

        expect(getAllByText('Loading...').length).toBe(2)
    })

    it('doesn\'t show default drawer elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByText, queryAllByTestId, getByTestId } = render(<TestComponent />)

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
            const { queryAllByText, queryAllByTestId } = render(<TestComponent />)

            expect(queryAllByTestId('Bottom.homeNav').length).toBe(2)
            expect(queryAllByTestId('Bottom.homeNavIcon').length).toBe(1)
            expect(queryAllByTestId('Bottom.homeNavIconOutline').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNav').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNavButton').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNavIcon').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNavLabel').length).toBe(1)
            expect(queryAllByText('Post').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNavModal').length).toBe(1)
            expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalLabel').length).toBe(0)
            expect(queryAllByText('What would you like to post?').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalClose').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalReqBtn').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalReqLabel').length).toBe(0)
            expect(queryAllByText('A Request for Food').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalOffBtn').length).toBe(0)
            expect(queryAllByTestId('Bottom.postNavModalOffLabel').length).toBe(0)
            expect(queryAllByText('An Offering of Food').length).toBe(0)
            expect(queryAllByTestId('Bottom.messagesNav').length).toBe(2)
            expect(queryAllByTestId('Bottom.messagesNavIcon').length).toBe(1)
            expect(queryAllByTestId('Bottom.messagesNavIconOutline').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId, getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('Bottom.homeNav')[0].props.style).toStrictEqual(styles.homeButton)
            expect(getAllByTestId('Bottom.homeNav')[1].props.style).toStrictEqual(styles.homeButton)
            expect(getByTestId('Bottom.homeNavIcon').props.style[1]).toStrictEqual({ marginBottom: -10 })
            expect(getByTestId('Bottom.homeNavIconOutline').props.style[1]).toStrictEqual({ marginBottom: -10 })
            expect(getByTestId('Bottom.postNavButton').parent.parent.props.style[0]).toStrictEqual(styles.postButton)
            expect(getByTestId('Bottom.postNavIcon').props.style[1]).toStrictEqual({ marginLeft: 3 })
            expect(getByTestId('Bottom.postNavLabel').props.style).toStrictEqual(styles.bottomBarText)
            expect(getAllByTestId('Bottom.messagesNav')[0].props.style).toStrictEqual(styles.messagesButton)
            expect(getAllByTestId('Bottom.messagesNav')[1].props.style).toStrictEqual(styles.messagesButton)
            expect(getByTestId('Bottom.messagesNavIcon').props.style[1]).toStrictEqual({ marginBottom: -10 })
            expect(getByTestId('Bottom.messagesNavIconOutline').props.style[1]).toStrictEqual({ marginBottom: -10 })
        })
    })
})

describe('Post modal', () => {
    it('is closed by default', () => {
        const { getByTestId, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(false)
    })

    it('opens the modal when pressed', () => {
        const { getByTestId, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(false)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(1)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(true)
    })

    it('renders the default elements when opened', () => {
        const { getByTestId, queryAllByTestId, queryAllByText } = render(<TestComponent />)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalLabel').length).toBe(1)
        expect(queryAllByText('What would you like to post?').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalClose').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalReqBtn').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalReqLabel').length).toBe(1)
        expect(queryAllByText('A Request for Food').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalOffBtn').length).toBe(1)
        expect(queryAllByTestId('Bottom.postNavModalOffLabel').length).toBe(1)
        expect(queryAllByText('An Offering of Food').length).toBe(1)
    })

    it('renders the default element\'s styles when opened', () => {
        const { getByTestId, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(getByTestId('Bottom.postNavModalCont').props.style).toStrictEqual(styles.modalContent)
        expect(getByTestId('Bottom.postNavModalLabel').props.style[0]).toStrictEqual(globalStyles.H3)
        expect(getByTestId('Bottom.postNavModalLabel').props.style[1]).toStrictEqual({ alignSelf: 'center' })
        expect(getByTestId('Bottom.postNavModalClose').parent.parent.props.style[0]).toStrictEqual(styles.modalClose)
        expect(getByTestId('Bottom.postNavModalReqBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.defaultBtn)
        expect(getByTestId('Bottom.postNavModalReqBtn').parent.parent.props.style[0][1]).toStrictEqual({ marginTop: 10 })
        expect(getByTestId('Bottom.postNavModalReqLabel').props.style[0]).toStrictEqual(globalStyles.defaultBtnLabel)
        expect(getByTestId('Bottom.postNavModalReqLabel').props.style[1]).toStrictEqual({ color: '#E8E3D9' })
        expect(getByTestId('Bottom.postNavModalOffBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.secondaryBtn)
        expect(getByTestId('Bottom.postNavModalOffBtn').parent.parent.props.style[0][1]).toStrictEqual({ marginTop: 16 })
        expect(getByTestId('Bottom.postNavModalOffLabel').props.style[0]).toStrictEqual(globalStyles.secondaryBtnLabel)
        expect(getByTestId('Bottom.postNavModalOffLabel').props.style[1]).toStrictEqual({ color: Colors.primaryDark })
    })

    it('navigates to request form when button is pressed', () => {
        const { getByTestId, queryAllByTestId, queryAllByText } = render(<TestComponent />)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(1)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(true)

        expect(queryAllByTestId('Request.formContainer').length).toBe(0)
        expect(queryAllByText('Create a descriptive title for your request').length).toBe(0)

        const requestButton = getByTestId('Bottom.postNavModalReqBtn')
        fireEvent.press(requestButton)

        expect(queryAllByTestId('Request.formContainer').length).toBe(1)
        expect(queryAllByText('Create a descriptive title for your request').length).toBe(1)
    })

    it('navigates to offer form when button is pressed', () => {
        const { getByTestId, queryAllByTestId, queryAllByText } = render(<TestComponent />)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(1)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(true)

        expect(queryAllByTestId('Offer.formContainer').length).toBe(0)
        expect(queryAllByText('Create a descriptive title for the food you are offering').length).toBe(0)

        const requestButton = getByTestId('Bottom.postNavModalOffBtn')
        fireEvent.press(requestButton)

        expect(queryAllByTestId('Offer.formContainer').length).toBe(1)
        expect(queryAllByText('Create a descriptive title for the food you are offering').length).toBe(1)
    })

    it('closes the modal when button is pressed', async () => {
        const { getByTestId, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(false)

        const postButton = getByTestId('Bottom.postNavButton')
        fireEvent.press(postButton)

        expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(1)
        expect(getByTestId('Bottom.postNavModal').props.visible).toBe(true)

        const closeButton = getByTestId('Bottom.postNavModalClose')
        fireEvent.press(closeButton)

        await waitFor(() => {
            expect(queryAllByTestId('Bottom.postNavModalCont').length).toBe(0)
            expect(getByTestId('Bottom.postNavModal').props.visible).toBe(false)
        })
    })
})

describe('navigation', () => {
    it('navigates to Messages screen when button is pressed', () => {
        const { getAllByTestId, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Conversations.List').length).toBe(0)

        const messagesButton = getAllByTestId('Bottom.messagesNav')[0]
        fireEvent.press(messagesButton)

        expect(queryAllByTestId('Conversations.List').length).toBe(1)
    })

    it('navigates to Home screen when button is pressed', () => {
        const { getAllByTestId, queryAllByTestId } = render(<TestComponent />)

        const messagesButton = getAllByTestId('Bottom.messagesNav')[0]
        fireEvent.press(messagesButton)

        expect(queryAllByTestId('Conversations.List').length).toBe(1)

        const HomeButton = getAllByTestId('Bottom.homeNav')[0]
        fireEvent.press(HomeButton)

        expect(queryAllByTestId('Conversations.List').length).toBe(0)
    })
})
