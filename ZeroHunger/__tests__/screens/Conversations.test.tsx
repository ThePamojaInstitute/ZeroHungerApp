import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Conversations } from '../../src/screens/Conversations';
import { AuthContext } from '../../src/context/AuthContext';
import { NotificationContext } from '../../src/context/ChatNotificationContext';
import { AlertContext, AlertContextFields, AlertContextType } from '../../src/context/Alert';
import { axiosInstance } from '../../config';
import MockAdapter from 'axios-mock-adapter';
import { mock } from 'jest-mock-extended';
import styles from "../../styles/screens/conversationsStyleSheet"
import { Colors } from '../../styles/globalStyleSheet';
import moment from 'moment';
import { useFonts } from '@expo-google-fonts/public-sans';


jest.mock('@expo-google-fonts/public-sans', () => ({
    useFonts: jest.fn()
}))
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
    unreadFromUsers: ['testUser2', 'testUser4']
}

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks()
    mockAxios.resetHistory()
})

const TestComponent = (
    <AuthContext.Provider value={mockAuthContextValues}>
        <NotificationContext.Provider value={mockNotificationContextValues}>
            <AlertContext.Provider value={mockAlertValue}>
                <Conversations navigation={mockNavigation} />
            </AlertContext.Provider>
        </NotificationContext.Provider>
    </AuthContext.Provider>
)

const now = moment.now()
const mockConversations = [
    {
        other_user: { username: 'testUser2' },
        last_message: { from_user: { username: 'testUser2' }, content: 'Hello testUser1', timestamp: moment(now).subtract(1, 'm').toDate() },
    },
    {
        other_user: { username: 'testUser3' },
        last_message: { from_user: { username: 'testUser1' }, content: 'Hello testUser3', timestamp: moment(now).toDate() },
    },
    {
        other_user: { username: 'testUser4' },
        last_message: { from_user: { username: 'testUser4' }, content: 'Hello testUser1', timestamp: moment(now).subtract(100, 'd').toDate() },
    },
    {
        other_user: { username: 'testUser5' },
        last_message: { from_user: { username: 'testUser5' }, content: 'Hello testUser1', timestamp: moment(now).subtract(5, 'd').toDate() },
    },
    {
        other_user: { username: 'testUser6' },
        last_message: { from_user: { username: 'testUser1' }, content: 'Hello testUser6', timestamp: moment(now).subtract(4, 'h').toDate() },
    },
]

describe('on loading', () => {
    it('shows loading', async () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { getAllByText } = render(TestComponent)

        await act(() => {
            expect(getAllByText('Loading...').length).toBe(1)
        })
    })

    it('doesn\'t show default elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByTestId } = render(TestComponent)

        expect(queryAllByTestId('Conversations.container').length).toBe(1)
        expect(queryAllByTestId('Conversations.noMsgs').length).toBe(0)
        expect(queryAllByTestId('Conversations.subContainer').length).toBe(0)
        expect(queryAllByTestId('Conversations.searchContainer').length).toBe(0)
        expect(queryAllByTestId('Conversations.searchInputContainer').length).toBe(0)
        expect(queryAllByTestId('Conversations.searchInput').length).toBe(0)
        expect(queryAllByTestId('Conversations.List').length).toBe(0)
    })
})

describe('onload', () => {
    describe('when conversations exist', () => {
        it('renders default element', async () => {
            const { queryAllByTestId } = render(TestComponent)

            expect(queryAllByTestId('Conversations.container').length).toBe(1)
            expect(queryAllByTestId('Conversations.noMsgs').length).toBe(0)
            expect(queryAllByTestId('Conversations.subContainer').length).toBe(1)
            expect(queryAllByTestId('Conversations.searchContainer').length).toBe(1)
            expect(queryAllByTestId('Conversations.searchInputContainer').length).toBe(1)
            expect(queryAllByTestId('Conversations.searchInput').length).toBe(1)
            expect(queryAllByTestId('Conversations.List').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(TestComponent)

            expect(getByTestId('Conversations.container').props.style).toStrictEqual({ backgroundColor: Colors.Background })
            expect(getByTestId('Conversations.searchContainer').props.style).toStrictEqual(styles.searchContainer)
            expect(getByTestId('Conversations.searchInputContainer').props.style).toStrictEqual(styles.searchInputContainer)
            expect(getByTestId('Conversations.searchInput').props.style).toStrictEqual(styles.searchInput)
        })
    })

    describe('when no conversations', () => {
        it('renders default element', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, [])

            const { queryAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(queryAllByTestId('Conversations.container').length).toBe(1)
                expect(queryAllByTestId('Conversations.subContainer').length).toBe(1)
                expect(queryAllByTestId('Conversations.searchContainer').length).toBe(1)
                expect(queryAllByTestId('Conversations.searchInputContainer').length).toBe(1)
                expect(queryAllByTestId('Conversations.searchInput').length).toBe(1)
                expect(queryAllByTestId('Conversations.List').length).toBe(1)
            })

            await act(() => {
                expect(queryAllByTestId('Conversations.noMsgs').length).toBe(1)
                expect(queryAllByTestId('Conversations.container').length).toBe(1)
                expect(queryAllByTestId('Conversations.subContainer').length).toBe(0)
                expect(queryAllByTestId('Conversations.searchContainer').length).toBe(0)
                expect(queryAllByTestId('Conversations.searchInputContainer').length).toBe(0)
                expect(queryAllByTestId('Conversations.searchInput').length).toBe(0)
                expect(queryAllByTestId('Conversations.List').length).toBe(0)
            })
        })

        it('renders default styles', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, [])

            const { getByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getByTestId('Conversations.container').props.style).toStrictEqual({ backgroundColor: Colors.Background })
                expect(getByTestId('Conversations.searchContainer').props.style).toStrictEqual(styles.searchContainer)
                expect(getByTestId('Conversations.searchInputContainer').props.style).toStrictEqual(styles.searchInputContainer)
                expect(getByTestId('Conversations.searchInput').props.style).toStrictEqual(styles.searchInput)
            })

            await act(() => {
                expect(getByTestId('Conversations.noMsgs').props.style).toStrictEqual(styles.noMsgs)
            })
        })
    })

    describe('renders conversations', () => {
        it('renders all conversations', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { getAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getAllByTestId('Conversation.testUser1__testUser2').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser3').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser4').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser5').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser6').length).toBe(1)
            })
        })

        it('renders default elements', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { getAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getAllByTestId('Conversation.testUser1__testUser2').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser2Cont').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser3').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser3Cont').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser4').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser4Cont').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser5').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser5Cont').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser6').length).toBe(1)
                expect(getAllByTestId('Conversation.testUser1__testUser6Cont').length).toBe(1)
                expect(getAllByTestId('Conversation.info').length).toBe(5)
                expect(getAllByTestId('Conversation.profileImg').length).toBe(5)
                expect(getAllByTestId('Conversation.content').length).toBe(5)
                expect(getAllByTestId('Conversation.username').length).toBe(5)
                expect(getAllByTestId('Conversation.lastMsg').length).toBe(5)
                expect(getAllByTestId('Conversation.timestamp').length).toBe(5)
            })
        })

        it('renders default elements styles', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { getByTestId, getAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getByTestId('Conversation.testUser1__testUser2Cont').props.style).toStrictEqual(styles.conversation)
                expect(getAllByTestId('Conversation.info')[0].props.style).toStrictEqual(styles.info)
                expect(getAllByTestId('Conversation.profileImg')[0].props.style).toStrictEqual(styles.profileImg)
                expect(getAllByTestId('Conversation.content')[0].props.style).toStrictEqual(styles.content)
                expect(getAllByTestId('Conversation.username')[0].props.style).toStrictEqual(styles.username)
                expect(getAllByTestId('Conversation.lastMsg')[0].props.style).toStrictEqual(styles.lastMessage)
                expect(getAllByTestId('Conversation.timestamp')[0].props.style).toStrictEqual(styles.timestamp)
            })
        })

        it('renders unread conversations elements', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { queryAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(queryAllByTestId('Conversation.ellipse').length).toBe(2)
                expect(queryAllByTestId('Conversation.ellipseFrame').length).toBe(2)
            })
        })

        it('renders unread elements styles', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { getByTestId, getAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getByTestId('Conversation.testUser1__testUser2Cont').props.style).toStrictEqual(styles.conversation)
                expect(getAllByTestId('Conversation.info')[1].props.style).toStrictEqual(styles.info)
                expect(getAllByTestId('Conversation.profileImg')[1].props.style).toStrictEqual(styles.profileImg)
                expect(getAllByTestId('Conversation.content')[1].props.style).toStrictEqual(styles.content)
                expect(getAllByTestId('Conversation.username')[1].props.style).toStrictEqual(styles.usernameUnread)
                expect(getAllByTestId('Conversation.lastMsg')[1].props.style).toStrictEqual(styles.lastMessageUnread)
                expect(getAllByTestId('Conversation.ellipseFrame')[1].props.style).toStrictEqual(styles.ellipseFrame)
                expect(getAllByTestId('Conversation.ellipse')[1].props.style).toStrictEqual(styles.ellipse)
                expect(getAllByTestId('Conversation.timestamp')[1].props.style).toStrictEqual(styles.timestamp)
            })
        })

        it('renders usernames correctly', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { queryAllByText } = render(TestComponent)

            await waitFor(() => {
                expect(queryAllByText('testUser2').length).toBe(1)
                expect(queryAllByText('testUser3').length).toBe(1)
                expect(queryAllByText('testUser4').length).toBe(1)
                expect(queryAllByText('testUser5').length).toBe(1)
                expect(queryAllByText('testUser6').length).toBe(1)
            })
        })

        it('renders last messages correctly', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { queryAllByText } = render(TestComponent)

            await waitFor(() => {
                expect(queryAllByText('Hello testUser1').length).toBe(3)
                expect(queryAllByText('Hello testUser3').length).toBe(1)
                expect(queryAllByText('Hello testUser6').length).toBe(1)
            })
        })

        it('renders timestamps correctly', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { queryAllByText } = render(TestComponent)

            await waitFor(() => {
                expect(queryAllByText('now').length).toBe(1)
                expect(queryAllByText('1m').length).toBe(1)
                expect(queryAllByText('4h').length).toBe(1)
                expect(queryAllByText('5d').length).toBe(1)
                expect(queryAllByText('14w').length).toBe(1)
            })
        })

        it('orders conversation by timestamp for earliest to latest', async () => {
            mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

            const { getAllByTestId } = render(TestComponent)

            await waitFor(() => {
                expect(getAllByTestId('Conversation.username')[0].props.children).toBe("testUser3")
                expect(getAllByTestId('Conversation.username')[1].props.children).toBe("testUser2")
                expect(getAllByTestId('Conversation.username')[2].props.children).toBe("testUser6")
                expect(getAllByTestId('Conversation.username')[3].props.children).toBe("testUser5")
                expect(getAllByTestId('Conversation.username')[4].props.children).toBe("testUser4")
            })
        })
    })
})

describe('navigation', () => {
    it('navigates to a chat when pressed', async () => {
        mockAxios.onGet('chat/conversations/').reply(200, mockConversations)

        const { getByTestId } = render(TestComponent)

        await waitFor(() => {
            fireEvent.press(getByTestId('Conversation.testUser1__testUser2'))
        })
        expect(mockNavigation.navigate).toBeCalledTimes(1)
        expect(mockNavigation.navigate).toBeCalledWith("Chat", { "user1": "testUser1", "user2": "testUser2" })
    })
})
