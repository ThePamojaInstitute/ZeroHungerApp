import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { Chat } from '../../src/components/Chat';
import { NotificationContext } from '../../src/context/ChatNotificationContext';
import * as ws from 'react-use-websocket';

jest.useFakeTimers()

const ReadyState = {
    UNINSTANTIATED: -1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
}

const mockNavigation = {
    navigate: jest.fn(),
}
const mockSendJsonMessage = jest.fn()
const mockGetWebSocket = jest.fn()
const mockSendMessage = jest.fn()
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

jest.spyOn(ws, 'default').mockReturnValue({
    readyState: ReadyState.OPEN,
    sendJsonMessage: mockSendJsonMessage,
    sendMessage: mockSendMessage,
    lastMessage: undefined,
    lastJsonMessage: undefined,
    getWebSocket: jest.fn().mockReturnValue(mockGetWebSocket)
})

beforeEach(() => {
    jest.clearAllMocks()
})

describe('onload', () => {
    it('renders default element correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <AuthContext.Provider value={{ ...mockAuthContextValues, user: '' }}>
                <Chat route={mockRoute} navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        getByText('Send')
        getByPlaceholderText("Message")
    })
})

describe('Chat functionality', () => {
    it('navigates to LoginScreen if user is not logged in', async () => {
        render(
            <AuthContext.Provider value={{ ...mockAuthContextValues, user: '' }}>
                <Chat route={mockRoute} navigation={mockNavigation} />
            </AuthContext.Provider>
        )

        expect(mockNavigation.navigate).toBeCalledWith("LoginScreen")
    })

    it('opens chat on mount and closes chat on unmount', () => {
        const { unmount } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <Chat route={mockRoute} navigation={mockNavigation} />
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        expect(mockSetChatIsOpen).toHaveBeenCalledTimes(1)
        expect(mockSetChatIsOpen).toHaveBeenCalledWith(true)

        unmount()

        expect(mockSetChatIsOpen).toHaveBeenCalledTimes(2)
        expect(mockSetChatIsOpen).toHaveBeenCalledWith(false)
    })

    it('sends read_messages when WebSocket connection is open', async () => {
        render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <Chat route={mockRoute} navigation={mockNavigation} />
                </NotificationContext.Provider>
            </AuthContext.Provider>
        );

        // Wait for WebSocket connection to be open
        await waitFor(() => {
            expect(mockSendJsonMessage).toHaveBeenCalledTimes(2)
            expect(mockSendJsonMessage).toHaveBeenNthCalledWith(1, {
                "name": "testUser1",
                "type": "render__30_40"
            })
            expect(mockSendJsonMessage).toHaveBeenNthCalledWith(2, {
                type: 'read_messages',
            })
        })
    })

    it('sends chat message when send button is pressed', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <Chat route={mockRoute} navigation={mockNavigation} />
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        const messageInput = getByPlaceholderText('Message')
        fireEvent.changeText(messageInput, 'Test message')
        fireEvent.press(getByTestId('MessageSend.Button'))

        expect(mockSendJsonMessage).toBeCalledTimes(3)
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(1, {
            "name": "testUser1",
            "type": "render__30_40"
        })
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(2,
            { "type": "read_messages" })
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(3, {
            type: 'chat_message',
            message: 'Test message',
            name: 'testUser1',
        })
        expect(messageInput.props.value).toBe('')
    })

    it('loads more messages when reaching the end of the list', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <Chat route={mockRoute} navigation={mockNavigation} />
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        const messagesList = getByTestId('messagesList')
        fireEvent(messagesList, 'onEndReached')

        expect(mockSendJsonMessage).toHaveBeenCalledTimes(3)
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(1, {
            "name": "testUser1",
            "type": "render__30_40"
        })
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(2,
            { "type": "read_messages" })
        expect(mockSendJsonMessage).toHaveBeenNthCalledWith(3, {
            type: 'render__40_50',
            name: 'testUser1',
        })
    })
})
