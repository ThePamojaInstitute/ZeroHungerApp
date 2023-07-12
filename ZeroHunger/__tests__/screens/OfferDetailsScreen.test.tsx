import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import HomeScreen from "../../src/screens/HomeScreen";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { axiosInstance } from "../../config";
import styles from "../../styles/screens/postDetailsStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import Chat from "../../src/components/Chat";
import * as ws from 'react-use-websocket';
import OfferDetailsScreen from "../../src/screens/OfferDetailsScreen";


const mockAxios = new MockAdapter(axiosInstance)
const mockUser = { username: 'test', user_id: '1' }
const mockAuthContextValues = { user: mockUser, accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}
const mockReadyState = {
    UNINSTANTIATED: -1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
}
const mockSendJsonMessage = jest.fn()
const mockGetWebSocket = jest.fn()
const mockSendMessage = jest.fn()

jest.spyOn(ws, 'default').mockReturnValue({
    readyState: mockReadyState.OPEN,
    sendJsonMessage: mockSendJsonMessage,
    sendMessage: mockSendMessage,
    lastMessage: undefined,
    lastJsonMessage: undefined,
    getWebSocket: jest.fn().mockReturnValue(mockGetWebSocket)
})

beforeEach(() => {
    jest.clearAllMocks()
})

const myOfferPost = {
    "pk": 1,
    "username": 'test',
    "fields": {
        "title": 'offer1',
        "images": "",
        "postedOn": 1,
        "postedBy": 1,
        "description": 'test desc'
    }
}
const testOfferPost = {
    "pk": 2,
    "username": 'testUser',
    "fields": {
        "title": 'offer2',
        "images": "",
        "postedOn": 2,
        "postedBy": 2,
        "description": 'test desc'
    }
}

const TestComponent = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={mockAuthContextValues}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                        />
                        <Stack.Screen
                            name="OfferDetailsScreen"
                            component={OfferDetailsScreen}
                        />
                        <Stack.Screen
                            name="Chat"
                            component={Chat}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 2, r: 0 })
mockAxios.onPost("posts/requestPostsForFeed").reply(200, [myOfferPost, testOfferPost])

describe('my offer default elemnts', () => {
    it('renders default elements', async () => {
        const { queryAllByTestId, getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(queryAllByTestId('Posts.btn')[0])
        })

        expect(queryAllByTestId('OffDet.container').length).toBe(1)
        expect(queryAllByTestId('OffDet.imgsList').length).toBe(1)
        expect(queryAllByTestId('OffDet.title').length).toBe(1)
        expect(queryAllByTestId('OffDet.subContainer').length).toBe(1)
        expect(queryAllByTestId('OffDet.location').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationText').length).toBe(1)
        expect(queryAllByTestId('OffDet.editBtn').length).toBe(1)
        expect(queryAllByTestId('OffDet.editBtnLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.distanceText').length).toBe(0)
        expect(queryAllByTestId('OffDet.needBy').length).toBe(0)
        expect(queryAllByTestId('OffDet.needByTag').length).toBe(0)
        expect(queryAllByTestId('OffDet.sendMsgCont').length).toBe(0)
        expect(queryAllByTestId('OffDet.sendMsgLabel').length).toBe(0)
        expect(queryAllByTestId('OffDet.msgInput').length).toBe(0)
        expect(queryAllByTestId('OffDet.sendMsgBtnCont').length).toBe(0)
        expect(queryAllByTestId('OffDet.sendMsgBtn').length).toBe(0)
        expect(queryAllByTestId('OffDet.sendMsgBtnLabel').length).toBe(0)
        expect(queryAllByTestId('OffDet.description').length).toBe(1)
        expect(queryAllByTestId('OffDet.discLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.discBody').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfo').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfoLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfoCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterUsername').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationDet').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationDetText').length).toBe(1)
        expect(queryAllByTestId('OffDet.details').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsSub').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailCat').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsQuant').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsReq').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailCatVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsQuantVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsReqVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPref').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefSubCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPickOrDel').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPostal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPickOrDelVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPostalVal').length).toBe(1)
    })

    it('renders default texts', async () => {
        const { queryAllByTestId, queryAllByText, getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(queryAllByTestId('Posts.btn')[0])
        })

        expect(queryAllByText('offer1').length).toBe(1)
        expect(queryAllByText('Edit').length).toBe(1)
        expect(queryAllByText('Send a message').length).toBe(0)
        expect(queryAllByText('Send').length).toBe(0)
        expect(queryAllByText('Description').length).toBe(1)
        expect(queryAllByText('test desc').length).toBe(1)
        expect(queryAllByText('No Description').length).toBe(0)
        expect(queryAllByText('Poster Information').length).toBe(1)
        expect(queryAllByText('test').length).toBe(1)
        expect(queryAllByText('Offer Details').length).toBe(1)
        expect(queryAllByText('Food category').length).toBe(1)
        expect(queryAllByText('Quantity').length).toBe(1)
        expect(queryAllByText('Dietary Requirements').length).toBe(1)
        expect(queryAllByText('Meeting Preferences').length).toBe(1)
        expect(queryAllByText('Pick Up or Delivery Preference').length).toBe(1)
        expect(queryAllByText('Postal Code').length).toBe(1)
        // TODO
        // expect(queryAllByText('location').length).toBe(0)
        // expect(queryAllByText('km away').length).toBe(0)
        // expect(queryAllByText('need in').length).toBe(0)
        // expect(queryAllByText('locationDet').length).toBe(1)
        // expect(queryAllByText('category value').length).toBe(1)
        // expect(queryAllByText('quantity value').length).toBe(1)
        // expect(queryAllByText('requirements value').length).toBe(1)
        // expect(queryAllByText('meeting preferences value').length).toBe(1)
        // expect(queryAllByText('postal code value').length).toBe(1)
    })

    it('renders default styles', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[0])
        })

        expect(getByTestId('OffDet.container').props.style).toStrictEqual(styles.container)
        expect(getByTestId('OffDet.title').props.style[0]).toStrictEqual(globalStyles.H2)
        expect(getByTestId('OffDet.title').props.style[1]).toStrictEqual({ paddingTop: 12 })
        expect(getByTestId('OffDet.subContainer').props.style).toStrictEqual(styles.subContainer)
        expect(getByTestId('OffDet.location').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('OffDet.locationText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('OffDet.editBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.secondaryBtn)
        expect(getByTestId('OffDet.editBtn').parent.parent.props.style[0][1]).toStrictEqual({ marginTop: 0, width: 'auto', padding: 10 })
        expect(getByTestId('OffDet.editBtnLabel').props.style).toStrictEqual(globalStyles.secondaryBtnLabel)
        expect(getByTestId('OffDet.description').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.discLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.discLabel').props.style[1]).toStrictEqual({ paddingBottom: 12, paddingTop: 20 })
        expect(getByTestId('OffDet.discBody').props.style).toStrictEqual(globalStyles.Body)
        expect(getByTestId('OffDet.posterInfo').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.posterInfoLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.posterInfoLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.posterInfoCont').props.style).toStrictEqual({ flexDirection: "row", marginRight: 12 })
        expect(getByTestId('OffDet.posterUsername').props.style[0]).toStrictEqual(globalStyles.H5)
        expect(getByTestId('OffDet.posterUsername').props.style[1]).toStrictEqual({ marginLeft: 3, marginTop: 2 })
        expect(getByTestId('OffDet.locationDet').props.style).toStrictEqual(styles.location)
        expect(getByTestId('OffDet.locationDetText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('OffDet.details').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.detailsLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.detailsLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.detailsSub').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('OffDet.detailCat').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailCat').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailsQuant').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsQuant').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailsReq').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsReq').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailCatVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailCatVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.detailsQuantVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsQuantVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.detailsReqVal').props.style).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPref').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.meetPrefLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.meetPrefLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.meetPrefSubCont').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('OffDet.meetPrefPickOrDel').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPickOrDel').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.meetPrefPostal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPostal').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.meetPrefPickOrDelVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPickOrDelVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.meetPrefPostalVal').props.style).toStrictEqual(globalStyles.Small1)
    })
})

describe('other offer default elemnts', () => {
    it('renders default elements', async () => {
        const { queryAllByTestId, getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(queryAllByTestId('Posts.btn')[1])
        })

        expect(queryAllByTestId('OffDet.container').length).toBe(1)
        expect(queryAllByTestId('OffDet.imgsList').length).toBe(1)
        expect(queryAllByTestId('OffDet.title').length).toBe(1)
        expect(queryAllByTestId('OffDet.subContainer').length).toBe(1)
        expect(queryAllByTestId('OffDet.location').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationText').length).toBe(0)
        expect(queryAllByTestId('OffDet.editBtn').length).toBe(0)
        expect(queryAllByTestId('OffDet.editBtnLabel').length).toBe(0)
        expect(queryAllByTestId('OffDet.distanceText').length).toBe(1)
        expect(queryAllByTestId('OffDet.sendMsgCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.sendMsgLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.msgInput').length).toBe(1)
        expect(queryAllByTestId('OffDet.sendMsgBtnCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.sendMsgBtn').length).toBe(1)
        expect(queryAllByTestId('OffDet.sendMsgBtnLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.description').length).toBe(1)
        expect(queryAllByTestId('OffDet.discLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.discBody').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfo').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfoLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterInfoCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.posterUsername').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationDet').length).toBe(1)
        expect(queryAllByTestId('OffDet.locationDetText').length).toBe(1)
        expect(queryAllByTestId('OffDet.details').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsSub').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailCat').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsQuant').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsReq').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailCatVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsQuantVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.detailsReqVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPref').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefLabel').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefSubCont').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPickOrDel').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPostal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPickOrDelVal').length).toBe(1)
        expect(queryAllByTestId('OffDet.meetPrefPostalVal').length).toBe(1)
    })

    it('renders default texts', async () => {
        const { queryAllByTestId, queryAllByText, getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(queryAllByTestId('Posts.btn')[1])
        })

        expect(queryAllByText('offer2').length).toBe(1)
        expect(queryAllByText('Edit').length).toBe(0)
        expect(queryAllByText('Send a message').length).toBe(1)
        expect(queryAllByText('Send').length).toBe(1)
        expect(queryAllByText('Description').length).toBe(1)
        expect(queryAllByText('test desc').length).toBe(1)
        expect(queryAllByText('No Description').length).toBe(0)
        expect(queryAllByText('Poster Information').length).toBe(1)
        expect(queryAllByText('testUser').length).toBe(1)
        expect(queryAllByText('Offer Details').length).toBe(1)
        expect(queryAllByText('Food category').length).toBe(1)
        expect(queryAllByText('Quantity').length).toBe(1)
        expect(queryAllByText('Dietary Requirements').length).toBe(1)
        expect(queryAllByText('Meeting Preferences').length).toBe(1)
        expect(queryAllByText('Pick Up or Delivery Preference').length).toBe(1)
        expect(queryAllByText('Postal Code').length).toBe(1)
        // TODO
        // expect(queryAllByText('location').length).toBe(0)
        // expect(queryAllByText('km away').length).toBe(0)
        // expect(queryAllByText('need in').length).toBe(0)
        // expect(queryAllByText('locationDet').length).toBe(1)
        // expect(queryAllByText('category value').length).toBe(1)
        // expect(queryAllByText('quantity value').length).toBe(1)
        // expect(queryAllByText('requirements value').length).toBe(1)
        // expect(queryAllByText('meeting preferences value').length).toBe(1)
        // expect(queryAllByText('postal code value').length).toBe(1)
    })

    it('renders default styles', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        expect(getByTestId('OffDet.container').props.style).toStrictEqual(styles.container)
        expect(getByTestId('OffDet.title').props.style[0]).toStrictEqual(globalStyles.H2)
        expect(getByTestId('OffDet.title').props.style[1]).toStrictEqual({ paddingTop: 12 })
        expect(getByTestId('OffDet.subContainer').props.style).toStrictEqual(styles.subContainer)
        expect(getByTestId('OffDet.location').props.style).toStrictEqual(styles.location)
        expect(getByTestId('OffDet.distanceText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('OffDet.sendMsgCont').props.style).toStrictEqual(styles.sendMessage)
        expect(getByTestId('OffDet.sendMsgLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.sendMsgLabel').props.style[1]).toStrictEqual({ padding: 12 })
        expect(getByTestId('OffDet.msgInput').props.style[0]).toStrictEqual(styles.inputText)
        expect(getByTestId('OffDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 0 })
        expect(getByTestId('OffDet.sendMsgBtnCont').props.style).toStrictEqual({ flexDirection: "row", justifyContent: "flex-end" })
        expect(getByTestId('OffDet.sendMsgBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.defaultBtn)
        expect(getByTestId('OffDet.sendMsgBtn').parent.parent.props.style[0][1]).toStrictEqual(styles.defaultBtn)
        expect(getByTestId('OffDet.sendMsgBtnLabel').props.style).toStrictEqual(globalStyles.defaultBtnLabel)
        expect(getByTestId('OffDet.description').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.discLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.discLabel').props.style[1]).toStrictEqual({ paddingBottom: 12, paddingTop: 20 })
        expect(getByTestId('OffDet.discBody').props.style).toStrictEqual(globalStyles.Body)
        expect(getByTestId('OffDet.posterInfo').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.posterInfoLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.posterInfoLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.posterInfoCont').props.style).toStrictEqual({ flexDirection: "row", marginRight: 12 })
        expect(getByTestId('OffDet.posterUsername').props.style[0]).toStrictEqual(globalStyles.H5)
        expect(getByTestId('OffDet.posterUsername').props.style[1]).toStrictEqual({ marginLeft: 3, marginTop: 2 })
        expect(getByTestId('OffDet.locationDet').props.style).toStrictEqual(styles.location)
        expect(getByTestId('OffDet.locationDetText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('OffDet.details').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.detailsLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.detailsLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.detailsSub').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('OffDet.detailCat').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailCat').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailsQuant').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsQuant').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailsReq').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsReq').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.detailCatVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailCatVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.detailsQuantVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.detailsQuantVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.detailsReqVal').props.style).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPref').props.style).toStrictEqual(styles.information)
        expect(getByTestId('OffDet.meetPrefLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('OffDet.meetPrefLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('OffDet.meetPrefSubCont').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('OffDet.meetPrefPickOrDel').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPickOrDel').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.meetPrefPostal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPostal').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('OffDet.meetPrefPickOrDelVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('OffDet.meetPrefPickOrDelVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('OffDet.meetPrefPostalVal').props.style).toStrictEqual(globalStyles.Small1)
    })
})

describe('send message', () => {
    it('renders default text Input value', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        expect(getByTestId('OffDet.msgInput').props.value).toBe('Hi testUser, is this still available?')
    })

    it('shows error message if input is empty', async () => {
        const { getByTestId, getAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        fireEvent.changeText(getByTestId('OffDet.msgInput'), '')
        fireEvent.press(getByTestId('OffDet.sendMsgBtn'))

        expect(queryAllByText('Please enter a message').length).toBe(1)
        expect(getByTestId('OffDet.alertMsg').props.style).toStrictEqual(styles.alertMsg)
        expect(getByTestId('OffDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 1, borderWidth: 1, borderColor: Colors.alert2 })
    })

    it('removes error message and styles if input changes', async () => {
        const { getByTestId, getAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        fireEvent.changeText(getByTestId('OffDet.msgInput'), '')
        fireEvent.press(getByTestId('OffDet.sendMsgBtn'))

        expect(queryAllByText('Please enter a message').length).toBe(1)
        expect(getByTestId('OffDet.alertMsg').props.style).toStrictEqual(styles.alertMsg)
        expect(getByTestId('OffDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 1, borderWidth: 1, borderColor: Colors.alert2 })

        fireEvent.changeText(getByTestId('OffDet.msgInput'), '')

        expect(queryAllByText('Please enter a message').length).toBe(0)
        expect(getByTestId('OffDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 0 })
    })

    it('navigates to chat when message is sent', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('OffDet.sendMsgBtn'))

        expect(getAllByTestId('Chat.messagesList').length).toBe(1)
    })

    it('sends the post preview message', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('OffDet.sendMsgBtn'))

        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(2, { "message": "{\"title\":\"offer2\",\"images\":\"https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600\",\"postedOn\":\"12/31/1969\",\"postedBy\":2,\"description\":\"test desc\",\"postId\":2,\"username\":\"testUser\",\"type\":\"o\"}", "name": "test", "type": "chat_message" })
    })

    it('sends the other message', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getByTestId('Home.offersBtn'))
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('OffDet.sendMsgBtn'))

        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(3, {
            "message": "Hi testUser, is this still available?",
            "name": "test",
            "type": "chat_message",
        })
    })
})
