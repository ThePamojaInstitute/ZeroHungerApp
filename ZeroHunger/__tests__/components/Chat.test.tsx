import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Chat } from '../../src/components/Chat';
import { NotificationContext } from '../../src/context/ChatNotificationContext';
import mockWS from "jest-websocket-mock";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { BaseURL } from '../../config';
import moment from 'moment';


jest.mock('@expo/vector-icons', () => ({
    Entypo: '',
    Ionicons: '',
}));

const mockNavigation = {
    navigate: jest.fn(),
    setOptions: jest.fn()
}
const mockSetChatIsOpen = jest.fn()
const mockRoute = {
    key: "testKey",
    name: "Chat",
    params: {
        user1: "testUser1",
        user2: "testUser2"
    }
}
const mockAuthContextValues = {
    user: { username: "testUser1" },
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: null
}
const mockNotificationContextValues = {
    setChatIsOpen: mockSetChatIsOpen,
    unreadMessageCount: 0,
    connectionStatus: 'Open',
    chatIsOpen: false,
    unreadFromUsers: ['']
}

const timeNow = moment(moment.now()).toDate()

let ws: mockWS
beforeEach(() => {
    jest.clearAllMocks()
    ws = new mockWS(`ws://${BaseURL}/chats/testUser1__testUser2/`)
})
afterEach(() => {
    mockWS.clean()
})

const styles = {
    chatBar: {
        backgroundColor: '#f8f9fb',
        borderColor: '#eff1f7',
        borderTopWidth: 1,
        height: 69,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100
    },
    chatInputContainer: {
        width: '85%',
        marginLeft: 15,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
    },
    chatInput: {
        paddingLeft: 10,
        paddingRight: -20,
        paddingVertical: 6.5,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 15,
        maxHeight: 70,
        width: '93%'
    },
    chatCameraIcon: {
        marginBottom: 11,
        marginLeft: 5,
    },
    chatSendIcon: {
        right: 0,
        position: 'absolute',
        marginRight: 5,
        marginTop: 4.5,
        top: 0,
        bottom: 0
    },
    postMsgCont: {
        flexDirection: 'row',
        marginVertical: -11
    },
    postMsgSubCont: {
        marginVertical: 10,
        marginRight: 65,
        marginLeft: 5
    },
    postMsgImg: {
        height: 90,
        width: 90,
        resizeMode: 'cover',
        marginLeft: -10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 5
    },
    postMsgTitle: {
        color: Colors.dark,
        fontFamily: 'PublicSans_500Medium',
        fontSize: 15
    },
    postMsgNeedBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        marginTop: -3,
        marginBottom: -10
    },
    postMsgIn: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primaryLightest,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginleft: 20,
        marginBottom: 20
    },
    postMsgOut: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginRight: 20,
        marginBottom: 20
    },
    postMsgContainerIn: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    postMsgContainerOut: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse',
    },
    postMsgLocation: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 12
    },
    noMsgs: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10
    }
}

const TestComponent = (
    <AuthContext.Provider value={{ ...mockAuthContextValues, user: '' }}>
        <NotificationContext.Provider value={mockNotificationContextValues}>
            <Chat route={mockRoute} navigation={mockNavigation} />
        </NotificationContext.Provider>
    </AuthContext.Provider>
)
const TestComponentLoggedIn = (
    <AuthContext.Provider value={mockAuthContextValues}>
        <NotificationContext.Provider value={mockNotificationContextValues}>
            <Chat route={mockRoute} navigation={mockNavigation} />
        </NotificationContext.Provider>
    </AuthContext.Provider>
)
const TestComponentWithPostPrev = (
    <AuthContext.Provider value={mockAuthContextValues}>
        <NotificationContext.Provider value={mockNotificationContextValues}>
            <Chat route={{
                ...mockRoute, params: {
                    user1: "testUser1",
                    user2: "testUser2",
                    post: { "title": "testTitle", "images": "", "postedOn": "7/11/2023", "postedBy": 2, "description": "", "postId": 2, "username": "testUser2", "type": "r" },
                    msg: 'Hi testUser2, do you still need this? I have some to share'
                }
            }} navigation={mockNavigation} />
        </NotificationContext.Provider>
    </AuthContext.Provider>
)

describe('onload', () => {
    describe('user is not logged in', () => {
        it('navigates to LoginScreen', () => {
            render(TestComponent)

            expect(mockNavigation.navigate).toBeCalledWith("LoginScreen")
        })
    })

    describe('user is logged in', () => {
        it('renders default elements', () => {
            const { queryAllByTestId } = render(TestComponentLoggedIn)

            expect(queryAllByTestId('Chat.container').length).toBe(1)
            expect(queryAllByTestId('Chat.messagesList').length).toBe(1)
            expect(queryAllByTestId('Chat.chatBar').length).toBe(1)
            expect(queryAllByTestId('Chat.chatCameraIcon').length).toBe(1)
            expect(queryAllByTestId('Chat.chatInputContainer').length).toBe(1)
            expect(queryAllByTestId('Chat.chatInput').length).toBe(1)
            expect(queryAllByTestId('Chat.chatSendIcon').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(TestComponentLoggedIn)

            expect(getByTestId('Chat.container').props.style).toStrictEqual({ flex: 1, backgroundColor: 'white' })
            expect(getByTestId('Chat.chatBar').props.style[0]).toStrictEqual(styles.chatBar)
            expect(getByTestId('Chat.chatBar').props.style[1]).toStrictEqual({ height: 69 })
            expect(getByTestId('Chat.chatCameraIcon').props.style).toStrictEqual(styles.chatCameraIcon)
            expect(getByTestId('Chat.chatInputContainer').props.style).toStrictEqual(styles.chatInputContainer)
            expect(getByTestId('Chat.chatInput').props.style[0]).toStrictEqual(styles.chatInput)
            expect(getByTestId('Chat.chatSendIcon').props.style).toStrictEqual(styles.chatSendIcon)
        })
    })
})

describe('Chat functionality', () => {
    describe('on start', () => {
        it('opens chat on mount and closes chat on unmount', () => {
            const { unmount } = render(TestComponentLoggedIn)

            expect(mockSetChatIsOpen).toHaveBeenCalledTimes(1)
            expect(mockSetChatIsOpen).toHaveBeenCalledWith(true)

            unmount()

            expect(mockSetChatIsOpen).toHaveBeenCalledTimes(2)
            expect(mockSetChatIsOpen).toHaveBeenCalledWith(false)
        })

        it('sends read_messages when WebSocket connection is open', async () => {
            render(TestComponentLoggedIn);

            await ws.connected

            await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")
        })
    })

    describe('when no messages', () => {
        it('shows no messages message if no messages', async () => {
            const { queryAllByText } = render(TestComponentLoggedIn)

            await ws.connected

            const msg1 = { type: 'last_30_messages', messages: [] }
            const msg2 = { type: 'limit_reached', messages: [] }

            ws.send(JSON.stringify(msg1))
            ws.send(JSON.stringify(msg2))

            expect(queryAllByText('No Messages').length).toBe(1)
        })

        it('loads styles', async () => {
            const { getByTestId } = render(TestComponentLoggedIn)

            await ws.connected

            const msg1 = { type: 'last_30_messages', messages: [] }
            const msg2 = { type: 'limit_reached', messages: [] }

            ws.send(JSON.stringify(msg1))
            ws.send(JSON.stringify(msg2))

            expect(getByTestId('Chat.noMsgs').props.style).toStrictEqual(styles.noMsgs)
        })
    })

    it('loads more messages when reaching the end of the list', async () => {
        const { getByTestId } = render(TestComponentLoggedIn)

        await ws.connected

        const json = JSON.stringify({ type: 'last_30_messages', messages: [] })
        ws.send(json)

        await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")

        const messagesList = getByTestId('Chat.messagesList')
        fireEvent(messagesList, 'onEndReached')

        await expect(ws).toReceiveMessage("{\"type\":\"render__30_40\",\"name\":\"testUser1\"}")
    })

    describe('sending messages', () => {
        it('sends chat message when send button is pressed', async () => {
            const { getByTestId } = render(TestComponentLoggedIn)

            await ws.connected

            const messageInput = getByTestId('Chat.chatInput')
            fireEvent.changeText(messageInput, 'Test message')
            fireEvent.press(getByTestId('Chat.chatSendIcon'))

            await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")
            await expect(ws).toReceiveMessage("{\"type\":\"chat_message\",\"message\":\"Test message\",\"name\":\"testUser1\"}")

            expect(messageInput.props.value).toBe('')
        })

        it('renders message after it being sent', async () => {
            const { getByTestId, queryAllByText } = render(TestComponentLoggedIn)

            await ws.connected

            const messageInput = getByTestId('Chat.chatInput')
            fireEvent.changeText(messageInput, 'Test message')
            fireEvent.press(getByTestId('Chat.chatSendIcon'))

            await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")
            await expect(ws).toReceiveMessage("{\"type\":\"chat_message\",\"message\":\"Test message\",\"name\":\"testUser1\"}")

            const timeNow = moment(moment.now()).toDate()
            const message = {
                "id": "b75a2e78-c1bc-4b61-829b-515f9c1f3b97",
                "conversation": "cc0fe444-bbf8-429e-a148-5e6eff232794",
                "from_user": {
                    "username": "testUser1"
                },
                "to_user": {
                    "username": "testUser2"
                },
                "content": "testing",
                "timestamp": timeNow,
                "read": false
            }
            const json = JSON.stringify({ type: 'chat_message_echo', message: message })

            ws.send(json)

            expect(queryAllByText('testing').length).toBe(1)

            expect(messageInput.props.value).toBe('')
        })
    })

    describe('receiving messages', () => {
        it('renders onload messages', async () => {
            const { queryAllByTestId, queryAllByText } = render(TestComponentLoggedIn)

            await ws.connected

            const messages = [
                {
                    "id": "b75a2e78-c1bc-4b61-829b-515f9c1f3b97",
                    "conversation": "cc0fe444-bbf8-429e-a148-5e6eff232794",
                    "from_user": {
                        "username": "testUser1"
                    },
                    "to_user": {
                        "username": "testUser2"
                    },
                    "content": "testing1",
                    "timestamp": timeNow,
                    "read": true
                },
                {
                    "id": "b75a2e78-c1bc-4b61-829b-515f9c1f3b98",
                    "conversation": "cc0fe444-bbf8-429e-a148-5e6eff232794",
                    "from_user": {
                        "username": "testUser2"
                    },
                    "to_user": {
                        "username": "testUser1"
                    },
                    "content": "testing2",
                    "timestamp": timeNow,
                    "read": true
                },
                {
                    "id": "b75a2e78-c1bc-4b61-829b-515f9c1f3b99",
                    "conversation": "cc0fe444-bbf8-429e-a148-5e6eff232794",
                    "from_user": {
                        "username": "testUser2"
                    },
                    "to_user": {
                        "username": "testUser1"
                    },
                    "content": "testing3",
                    "timestamp": timeNow,
                    "read": false
                }
            ]
            const json = JSON.stringify({ type: 'last_30_messages', messages: messages })

            ws.send(json)

            await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")

            expect(queryAllByText('testing1').length).toBe(1)
            expect(queryAllByText('testing2').length).toBe(1)
            expect(queryAllByText('testing3').length).toBe(1)
            expect(queryAllByTestId('Message.container').length).toBe(3)
        })
    })
})

describe('post preview messages', () => {
    const postMsg = "{\"type\":\"chat_message\",\"message\":{\"title\":\"testTitle\",\"images\":\"\",\"postedOn\":\"7/11/2023\",\"postedBy\":2,\"description\":\"\",\"postId\":2,\"username\":\"testUser2\",\"type\":\"r\"},\"name\":\"testUser1\"}"
    const associateMsg = "{\"type\":\"chat_message\",\"message\":\"Hi testUser2, do you still need this? I have some to share\",\"name\":\"testUser1\"}"
    const postSerializedMsg = {
        "id": "b75a2e78-c1bc-4b61-829b-515f9c1f3b97",
        "conversation": "cc0fe444-bbf8-429e-a148-5e6eff232794",
        "from_user": {
            "username": "testUser1"
        },
        "to_user": {
            "username": "testUser2"
        },
        "content": "{\"title\":\"testTitle\",\"images\":\"\",\"postedOn\":\"7/11/2023\",\"postedBy\":2,\"description\":\"\",\"postId\":2,\"username\":\"testUser2\",\"type\":\"r\"}",
        "timestamp": timeNow,
        "read": true
    }

    it('send the messages to the server', async () => {
        render(TestComponentWithPostPrev)

        await ws.connected

        await expect(ws).toReceiveMessage("{\"type\":\"read_messages\"}")
        await expect(ws).toReceiveMessage(postMsg)
        await expect(ws).toReceiveMessage(associateMsg)
    })

    describe('rendering the post preview message', () => {
        it('renders elements', async () => {
            const { queryAllByTestId } = render(TestComponentWithPostPrev)

            await ws.connected

            const json = JSON.stringify({ type: 'chat_message_echo', message: postSerializedMsg })
            ws.send(json)

            expect(queryAllByTestId('Chat.postPrev').length).toBe(1)
            expect(queryAllByTestId('Chat.postCont').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsg').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgCont').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgImg').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgSubCont').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgLocation').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgLocationIcon').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgDistance').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgNeedBy').length).toBe(1)
            expect(queryAllByTestId('Chat.postMsgTag').length).toBe(1)
        })

        it('renders styles', async () => {
            const { getByTestId } = render(TestComponentWithPostPrev)

            await ws.connected

            const json = JSON.stringify({ type: 'chat_message_echo', message: postSerializedMsg })
            ws.send(json)

            expect(getByTestId('Chat.postCont').props.style).toStrictEqual(styles.postMsgContainerOut)
            expect(getByTestId('Chat.postMsg').props.style).toStrictEqual(styles.postMsgOut)
            expect(getByTestId('Chat.postMsgCont').props.style).toStrictEqual(styles.postMsgCont)
            expect(getByTestId('Chat.postMsgImg').props.style).toStrictEqual(styles.postMsgImg)
            expect(getByTestId('Chat.postMsgSubCont').props.style).toStrictEqual(styles.postMsgSubCont)
            expect(getByTestId('Chat.postMsgTitle').props.style[0]).toStrictEqual(styles.postMsgTitle)
            expect(getByTestId('Chat.postMsgTitle').props.style[1]).toStrictEqual({ color: Colors.white })
            expect(getByTestId('Chat.postMsgLocation').props.style).toStrictEqual(styles.postMsgLocation)
            expect(getByTestId('Chat.postMsgLocationIcon').props.style).toStrictEqual({ marginRight: 4, color: Colors.white })
            expect(getByTestId('Chat.postMsgDistance').props.style[0]).toStrictEqual(globalStyles.Small2)
            expect(getByTestId('Chat.postMsgDistance').props.style[1]).toStrictEqual({ color: Colors.white })
            expect(getByTestId('Chat.postMsgNeedBy').props.style).toStrictEqual(styles.postMsgNeedBy)
            expect(getByTestId('Chat.postMsgTag').props.style).toStrictEqual(globalStyles.Tag)
        })

        it('renders texts', async () => {
            const { queryAllByText, getByTestId } = render(TestComponentWithPostPrev)

            await ws.connected

            const json = JSON.stringify({ type: 'chat_message_echo', message: postSerializedMsg })
            ws.send(json)

            expect(queryAllByText('testTitle').length).toBe(1)
            expect(getByTestId('Chat.postMsgDistance').props.children).toStrictEqual([1, "km away"])
            expect(getByTestId('Chat.postMsgTag').props.children).toStrictEqual(["Need in ", 3, " days"])
        })
    })

    it('navigates to post when pressed on post message', async () => {
        const { getByTestId } = render(TestComponentWithPostPrev)

        await ws.connected

        const json = JSON.stringify({ type: 'chat_message_echo', message: postSerializedMsg })
        ws.send(json)

        fireEvent.press(getByTestId('Chat.postPrev'))

        expect(mockNavigation.navigate).toBeCalledWith("RequestDetailsScreen", {
            "description": "",
            "imagesLink": "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600",
            "postId": 2,
            "postedBy": 2,
            "postedOn": "7/11/2023",
            "title": "testTitle",
            "username": "testUser2"
        })
    })
})
