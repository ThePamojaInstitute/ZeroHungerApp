import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Conversations } from '../../src/screens/Conversations';
import { AuthContext } from '../../src/context/AuthContext';
import { NotificationContext } from '../../src/context/ChatNotificationContext';
import { AlertContext, AlertContextFields, AlertContextType } from '../../src/context/Alert';
import { axiosInstance } from '../../config';
import MockAdapter from 'axios-mock-adapter';
import { mock } from 'jest-mock-extended';

jest.useFakeTimers()

const mockAxios = new MockAdapter(axiosInstance)
const mockSetChatIsOpen = jest.fn()
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}
const mockNavigation = {
    navigate: jest.fn(),
};
const mockAuthContextValues = {
    user: { username: "testUser1" },
    accessToken: "testToken",
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

beforeEach(() => {
    jest.clearAllMocks()
})

describe('onload', () => {
    it('renders default element correctly', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        );

        getByTestId('conversationsList')
    })
})

describe('Conversations functionality', () => {
    it('shows active conversations', async () => {
        const mockConversation = {
            other_user: { username: 'testUser2' },
            last_message: { from_user: { username: 'testUser2' }, content: 'Hello', timestamp: '2023-01-01T12:34:56Z' },
        }

        mockAxios.onGet('http://127.0.0.1:8000/chat/conversations/').reply(200, [mockConversation])

        const { queryAllByTestId } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        await waitFor(() => {
            expect(queryAllByTestId('testUser1__testUser2').length).toBe(1)
        })
    })

    it('navigates to Chat screen when a conversation is selected', async () => {
        const mockConversation = {
            other_user: { username: 'testUser2' },
            last_message: { from_user: { username: 'testUser2' }, content: 'Hello', timestamp: '2023-01-01T12:34:56Z' },
        }

        mockAxios.onGet('http://127.0.0.1:8000/chat/conversations/').reply(200, [mockConversation])

        const { getByTestId } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            fireEvent.press(getByTestId('testUser1__testUser2.Button'))
        })

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Chat', { user1: 'testUser1', user2: 'testUser2' })
    })

    it('creates a new chat when the create button is pressed', () => {
        const mockCreateGroup = 'testUser2';

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        fireEvent.changeText(getByPlaceholderText('Chat with(username)'), mockCreateGroup)
        fireEvent.press(getByText('Create'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Chat', { user1: 'testUser1', user2: 'testUser2' })
    })

    it('displays unread message notification for conversations with unread messages', async () => {
        const mockUnreadFromUsers = ['testUser2']
        const mockConversation = {
            other_user: { username: 'testUser2' },
            last_message: { from_user: { username: 'testUser2' }, content: 'Hello', timestamp: '2023-01-01T12:34:56Z' },
        }

        mockAxios.onGet('http://127.0.0.1:8000/chat/conversations/').reply(200, [mockConversation])

        const { getAllByText } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={{
                    ...mockNotificationContextValues,
                    unreadFromUsers: mockUnreadFromUsers
                }}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        await waitFor(() => {
            expect(getAllByText('You have unread messages').length).toBe(1)
        })
    })

    it('displays last message and its timestamp for conversations with messages', async () => {
        const mockConversation = {
            other_user: { username: 'testUser2' },
            last_message: { from_user: { username: 'testUser2' }, content: 'Hello', timestamp: '2023-01-01T12:34:56Z' },
        }

        mockAxios.onGet('http://127.0.0.1:8000/chat/conversations/').reply(200, [mockConversation])

        const { getAllByText } = render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        await waitFor(() => {
            expect(getAllByText('Last message: Hello').length).toBe(1)
            expect(getAllByText('7:34').length).toBe(1)
        })
    })

    it('handles errors when retrieving conversations', async () => {
        const mockError = new Error('Failed to fetch conversations')
        mockAxios.onGet('http://127.0.0.1:8000/chat/conversations/').reply(500, mockError)

        render(
            <AuthContext.Provider value={mockAuthContextValues}>
                <NotificationContext.Provider value={mockNotificationContextValues}>
                    <AlertContext.Provider value={mockAlertValue}>
                        <Conversations navigation={mockNavigation} />
                    </AlertContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        )

        await waitFor(() => {
            expect(mockAlertDispatch).toBeCalledWith({ "alertType": "error", "message": "An error occured", "type": "open" })
        })
    })
})
