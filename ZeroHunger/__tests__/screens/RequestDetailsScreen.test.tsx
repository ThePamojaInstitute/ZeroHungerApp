import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import RequestDetailsScreen from "../../src/screens/RequestDetailsScreen";
import { mock } from "jest-mock-extended";
import HomeScreen from "../../src/screens/HomeScreen";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { axiosInstance } from "../../config";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import Chat from "../../src/components/Chat";
import * as ws from 'react-use-websocket';


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

const myRequestPost = {
    "pk": 1,
    "username": 'test',
    "fields": {
        "title": 'request1',
        "images": "",
        "postedOn": 1,
        "postedBy": 1,
        "description": 'test desc'
    }
}
const testRequestPost = {
    "pk": 2,
    "username": 'testUser',
    "fields": {
        "title": 'request2',
        "images": "",
        "postedOn": 2,
        "postedBy": 2,
        "description": 'test desc'
    }
}

const styles = {
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.offWhite
    },
    inputText: {
        flex: 1,
        backgroundColor: Colors.white,
        marginLeft: 12,
        marginRight: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
    },
    sendMessage: {
        backgroundColor: Colors.Background,
        borderRadius: 10,
    },
    information: {
        paddingTop: 12,
        paddingBottom: 20,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight
    },
    subContainer: {
        flexDirection: "row",
        marginTop: 4,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    needBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4
    },
    location: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 12
    },
    smallText: {
        color: Colors.midDark,
        marginBottom: 8
    },
    defaultBtn: {
        width: "40%",
        marginTop: 11,
        marginBottom: 16,
        marginRight: 11,
    },
    alertMsg: {
        marginLeft: 15,
        marginTop: 5,
        color: Colors.alert2
    },
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
                            name="RequestDetailsScreen"
                            component={RequestDetailsScreen}
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

mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 2 })
mockAxios.onPost("posts/requestPostsForFeed").reply(200, [myRequestPost, testRequestPost])

describe('my request default elemnts', () => {
    it('renders default elements', async () => {
        const { queryAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(queryAllByTestId('Posts.btn')[0])
        })

        expect(queryAllByTestId('ReqDet.container').length).toBe(1)
        expect(queryAllByTestId('ReqDet.imgsList').length).toBe(1)
        expect(queryAllByTestId('ReqDet.title').length).toBe(1)
        expect(queryAllByTestId('ReqDet.subContainer').length).toBe(1)
        expect(queryAllByTestId('ReqDet.location').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationText').length).toBe(1)
        expect(queryAllByTestId('ReqDet.editBtn').length).toBe(1)
        expect(queryAllByTestId('ReqDet.editBtnLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.distanceText').length).toBe(0)
        expect(queryAllByTestId('ReqDet.needBy').length).toBe(0)
        expect(queryAllByTestId('ReqDet.needByTag').length).toBe(0)
        expect(queryAllByTestId('ReqDet.sendMsgCont').length).toBe(0)
        expect(queryAllByTestId('ReqDet.sendMsgLabel').length).toBe(0)
        expect(queryAllByTestId('ReqDet.msgInput').length).toBe(0)
        expect(queryAllByTestId('ReqDet.sendMsgBtnCont').length).toBe(0)
        expect(queryAllByTestId('ReqDet.sendMsgBtn').length).toBe(0)
        expect(queryAllByTestId('ReqDet.sendMsgBtnLabel').length).toBe(0)
        expect(queryAllByTestId('ReqDet.description').length).toBe(1)
        expect(queryAllByTestId('ReqDet.discLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.discBody').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfo').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfoLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfoCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterUsername').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationDet').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationDetText').length).toBe(1)
        expect(queryAllByTestId('ReqDet.details').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsSub').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailCat').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsQuant').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsReq').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailCatVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsQuantVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsReqVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPref').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefSubCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPickOrDel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPostal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPickOrDelVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPostalVal').length).toBe(1)
    })

    it('renders default texts', async () => {
        const { queryAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(queryAllByTestId('Posts.btn')[0])
        })

        expect(queryAllByText('request1').length).toBe(1)
        expect(queryAllByText('Edit').length).toBe(1)
        expect(queryAllByText('Send a message').length).toBe(0)
        expect(queryAllByText('Send').length).toBe(0)
        expect(queryAllByText('Description').length).toBe(1)
        expect(queryAllByText('test desc').length).toBe(1)
        expect(queryAllByText('No Description').length).toBe(0)
        expect(queryAllByText('Poster Information').length).toBe(1)
        expect(queryAllByText('test').length).toBe(1)
        expect(queryAllByText('Request Details').length).toBe(1)
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
            fireEvent.press(getAllByTestId('Posts.btn')[0])
        })

        expect(getByTestId('ReqDet.container').props.style).toStrictEqual(styles.container)
        expect(getByTestId('ReqDet.title').props.style[0]).toStrictEqual(globalStyles.H2)
        expect(getByTestId('ReqDet.title').props.style[1]).toStrictEqual({ paddingTop: 12 })
        expect(getByTestId('ReqDet.subContainer').props.style).toStrictEqual(styles.subContainer)
        expect(getByTestId('ReqDet.location').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('ReqDet.locationText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('ReqDet.editBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.secondaryBtn)
        expect(getByTestId('ReqDet.editBtn').parent.parent.props.style[0][1]).toStrictEqual({ marginTop: 0, width: 'auto', padding: 10 })
        expect(getByTestId('ReqDet.editBtnLabel').props.style).toStrictEqual(globalStyles.secondaryBtnLabel)
        expect(getByTestId('ReqDet.description').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.discLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.discLabel').props.style[1]).toStrictEqual({ paddingBottom: 12, paddingTop: 20 })
        expect(getByTestId('ReqDet.discBody').props.style).toStrictEqual(globalStyles.Body)
        expect(getByTestId('ReqDet.posterInfo').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.posterInfoLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.posterInfoLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.posterInfoCont').props.style).toStrictEqual({ flexDirection: "row", marginRight: 12 })
        expect(getByTestId('ReqDet.posterUsername').props.style[0]).toStrictEqual(globalStyles.H5)
        expect(getByTestId('ReqDet.posterUsername').props.style[1]).toStrictEqual({ marginLeft: 3, marginTop: 2 })
        expect(getByTestId('ReqDet.locationDet').props.style).toStrictEqual(styles.location)
        expect(getByTestId('ReqDet.locationDetText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('ReqDet.details').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.detailsLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.detailsLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.detailsSub').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('ReqDet.detailCat').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailCat').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailsQuant').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsQuant').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailsReq').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsReq').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailCatVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailCatVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.detailsQuantVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsQuantVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.detailsReqVal').props.style).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPref').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.meetPrefLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.meetPrefLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.meetPrefSubCont').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('ReqDet.meetPrefPickOrDel').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPickOrDel').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.meetPrefPostal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPostal').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.meetPrefPickOrDelVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPickOrDelVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.meetPrefPostalVal').props.style).toStrictEqual(globalStyles.Small1)
    })
})

describe('other request default elemnts', () => {
    it('renders default elements', async () => {
        const { queryAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(queryAllByTestId('Posts.btn')[1])
        })

        expect(queryAllByTestId('ReqDet.container').length).toBe(1)
        expect(queryAllByTestId('ReqDet.imgsList').length).toBe(1)
        expect(queryAllByTestId('ReqDet.title').length).toBe(1)
        expect(queryAllByTestId('ReqDet.subContainer').length).toBe(1)
        expect(queryAllByTestId('ReqDet.location').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationText').length).toBe(0)
        expect(queryAllByTestId('ReqDet.editBtn').length).toBe(0)
        expect(queryAllByTestId('ReqDet.editBtnLabel').length).toBe(0)
        expect(queryAllByTestId('ReqDet.distanceText').length).toBe(1)
        expect(queryAllByTestId('ReqDet.needBy').length).toBe(1)
        expect(queryAllByTestId('ReqDet.needByTag').length).toBe(1)
        expect(queryAllByTestId('ReqDet.sendMsgCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.sendMsgLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.msgInput').length).toBe(1)
        expect(queryAllByTestId('ReqDet.sendMsgBtnCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.sendMsgBtn').length).toBe(1)
        expect(queryAllByTestId('ReqDet.sendMsgBtnLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.description').length).toBe(1)
        expect(queryAllByTestId('ReqDet.discLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.discBody').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfo').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfoLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterInfoCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.posterUsername').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationDet').length).toBe(1)
        expect(queryAllByTestId('ReqDet.locationDetText').length).toBe(1)
        expect(queryAllByTestId('ReqDet.details').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsSub').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailCat').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsQuant').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsReq').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailCatVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsQuantVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.detailsReqVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPref').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefLabel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefSubCont').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPickOrDel').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPostal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPickOrDelVal').length).toBe(1)
        expect(queryAllByTestId('ReqDet.meetPrefPostalVal').length).toBe(1)
    })

    it('renders default texts', async () => {
        const { queryAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(queryAllByTestId('Posts.btn')[1])
        })

        expect(queryAllByText('request2').length).toBe(1)
        expect(queryAllByText('Edit').length).toBe(0)
        expect(queryAllByText('Send a message').length).toBe(1)
        expect(queryAllByText('Send').length).toBe(1)
        expect(queryAllByText('Description').length).toBe(1)
        expect(queryAllByText('test desc').length).toBe(1)
        expect(queryAllByText('No Description').length).toBe(0)
        expect(queryAllByText('Poster Information').length).toBe(1)
        expect(queryAllByText('testUser').length).toBe(1)
        expect(queryAllByText('Request Details').length).toBe(1)
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
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        expect(getByTestId('ReqDet.container').props.style).toStrictEqual(styles.container)
        expect(getByTestId('ReqDet.title').props.style[0]).toStrictEqual(globalStyles.H2)
        expect(getByTestId('ReqDet.title').props.style[1]).toStrictEqual({ paddingTop: 12 })
        expect(getByTestId('ReqDet.subContainer').props.style).toStrictEqual(styles.subContainer)
        expect(getByTestId('ReqDet.location').props.style).toStrictEqual(styles.location)
        expect(getByTestId('ReqDet.distanceText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('ReqDet.needBy').props.style).toStrictEqual(styles.needBy)
        expect(getByTestId('ReqDet.needByTag').props.style).toStrictEqual(globalStyles.Tag)
        expect(getByTestId('ReqDet.sendMsgCont').props.style).toStrictEqual(styles.sendMessage)
        expect(getByTestId('ReqDet.sendMsgLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.sendMsgLabel').props.style[1]).toStrictEqual({ padding: 12 })
        expect(getByTestId('ReqDet.msgInput').props.style[0]).toStrictEqual(styles.inputText)
        expect(getByTestId('ReqDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 0 })
        expect(getByTestId('ReqDet.sendMsgBtnCont').props.style).toStrictEqual({ flexDirection: "row", justifyContent: "flex-end" })
        expect(getByTestId('ReqDet.sendMsgBtn').parent.parent.props.style[0][0]).toStrictEqual(globalStyles.defaultBtn)
        expect(getByTestId('ReqDet.sendMsgBtn').parent.parent.props.style[0][1]).toStrictEqual(styles.defaultBtn)
        expect(getByTestId('ReqDet.sendMsgBtnLabel').props.style).toStrictEqual(globalStyles.defaultBtnLabel)
        expect(getByTestId('ReqDet.description').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.discLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.discLabel').props.style[1]).toStrictEqual({ paddingBottom: 12, paddingTop: 20 })
        expect(getByTestId('ReqDet.discBody').props.style).toStrictEqual(globalStyles.Body)
        expect(getByTestId('ReqDet.posterInfo').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.posterInfoLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.posterInfoLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.posterInfoCont').props.style).toStrictEqual({ flexDirection: "row", marginRight: 12 })
        expect(getByTestId('ReqDet.posterUsername').props.style[0]).toStrictEqual(globalStyles.H5)
        expect(getByTestId('ReqDet.posterUsername').props.style[1]).toStrictEqual({ marginLeft: 3, marginTop: 2 })
        expect(getByTestId('ReqDet.locationDet').props.style).toStrictEqual(styles.location)
        expect(getByTestId('ReqDet.locationDetText').props.style).toStrictEqual(globalStyles.Small2)
        expect(getByTestId('ReqDet.details').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.detailsLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.detailsLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.detailsSub').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('ReqDet.detailCat').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailCat').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailsQuant').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsQuant').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailsReq').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsReq').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.detailCatVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailCatVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.detailsQuantVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.detailsQuantVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.detailsReqVal').props.style).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPref').props.style).toStrictEqual(styles.information)
        expect(getByTestId('ReqDet.meetPrefLabel').props.style[0]).toStrictEqual(globalStyles.H4)
        expect(getByTestId('ReqDet.meetPrefLabel').props.style[1]).toStrictEqual({ paddingBottom: 12 })
        expect(getByTestId('ReqDet.meetPrefSubCont').props.style).toStrictEqual({ flexDirection: "row" })
        expect(getByTestId('ReqDet.meetPrefPickOrDel').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPickOrDel').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.meetPrefPostal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPostal').props.style[1]).toStrictEqual(styles.smallText)
        expect(getByTestId('ReqDet.meetPrefPickOrDelVal').props.style[0]).toStrictEqual(globalStyles.Small1)
        expect(getByTestId('ReqDet.meetPrefPickOrDelVal').props.style[1]).toStrictEqual({ marginBottom: 8 })
        expect(getByTestId('ReqDet.meetPrefPostalVal').props.style).toStrictEqual(globalStyles.Small1)
    })
})

describe('send message', () => {
    it('renders default text Input value', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        expect(getByTestId('ReqDet.msgInput').props.value).toBe('Hi testUser, do you still need this? I have some to share')
    })

    it('shows error message if input is empty', async () => {
        const { getByTestId, getAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        fireEvent.changeText(getByTestId('ReqDet.msgInput'), '')
        fireEvent.press(getByTestId('ReqDet.sendMsgBtn'))

        expect(queryAllByText('Please enter a message').length).toBe(1)
        expect(getByTestId('ReqDet.alertMsg').props.style).toStrictEqual(styles.alertMsg)
        expect(getByTestId('ReqDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 1, borderWidth: 1, borderColor: Colors.alert2 })
    })

    it('removes error message and styles if input changes', async () => {
        const { getByTestId, getAllByTestId, queryAllByText } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })

        fireEvent.changeText(getByTestId('ReqDet.msgInput'), '')
        fireEvent.press(getByTestId('ReqDet.sendMsgBtn'))

        expect(queryAllByText('Please enter a message').length).toBe(1)
        expect(getByTestId('ReqDet.alertMsg').props.style).toStrictEqual(styles.alertMsg)
        expect(getByTestId('ReqDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 1, borderWidth: 1, borderColor: Colors.alert2 })

        fireEvent.changeText(getByTestId('ReqDet.msgInput'), '')

        expect(queryAllByText('Please enter a message').length).toBe(0)
        expect(getByTestId('ReqDet.msgInput').props.style[1]).toStrictEqual({ maxHeight: 0 })
    })

    it('navigates to chat when message is sent', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('ReqDet.sendMsgBtn'))

        expect(getAllByTestId('Chat.messagesList').length).toBe(1)
    })

    it('sends the post preview message', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('ReqDet.sendMsgBtn'))

        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(3, { "message": "{\"title\":\"request2\",\"images\":\"https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600\",\"postedOn\":\"12/31/1969\",\"postedBy\":2,\"description\":\"test desc\",\"postId\":2,\"username\":\"testUser\",\"type\":\"r\"}", "name": "test", "type": "chat_message" })
    })

    it('sends the other message', async () => {
        const { getByTestId, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            fireEvent.press(getAllByTestId('Posts.btn')[1])
        })
        fireEvent.press(getByTestId('ReqDet.sendMsgBtn'))

        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(4, {
            "message": "Hi testUser, do you still need this? I have some to share",
            "name": "test",
            "type": "chat_message",
        })
    })
})
