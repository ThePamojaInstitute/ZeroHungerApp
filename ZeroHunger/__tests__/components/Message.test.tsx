import { render } from "@testing-library/react-native"
import { Message } from "../../src/components/Message"
import { AuthContext } from "../../src/context/AuthContext"
import styles from "../../styles/components/messageStyleSheet"
import { Colors } from "../../styles/globalStyleSheet"
import moment from "moment"

const mockAuthContextValues = {
    user: { username: "testUser1" },
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: null
}

const now = moment.now()
const fromMeMessage = {
    id: "1",
    room: "testUser1__testUser2",
    from_user: {
        username: "testUser1",
        token: "testUser1"
    },
    to_user: {
        username: "testUser2",
        token: "testUser2"
    },
    content: "testContent1",
    timestamp: moment(now).toDate().toString(),
    read: true
}
const toMeMessage = {
    id: "1",
    room: "testUser1__testUser2",
    from_user: {
        username: "testUser2",
        token: "testUser2"
    },
    to_user: {
        username: "testUser1",
        token: "testUser1"
    },
    content: "testContent2",
    timestamp: moment(now).subtract(12, 'h').toDate().toString(),
    read: true
}

const TestComponentFromMe = (
    <AuthContext.Provider value={mockAuthContextValues}>
        <Message message={fromMeMessage} />
    </AuthContext.Provider>
)
const TestComponentToMe = (
    <AuthContext.Provider value={mockAuthContextValues}>
        <Message message={toMeMessage} />
    </AuthContext.Provider>
)

const formatMessageTimestamp = (timestamp: string) => {
    let date = new Date(timestamp).toLocaleTimeString()
    const dateLength = date.length
    let time = date.slice(0, 5)

    if (time.at(time.length - 1) === ":") {
        time = time.slice(0, time.length - 1)
    }
    time = `${time} ${date.slice(dateLength - 2, dateLength)}`

    return time
}

describe('onload', () => {
    describe('message from me', () => {
        it('renders default elements', () => {
            const { queryAllByTestId } = render(TestComponentFromMe)

            expect(queryAllByTestId('Message.container').length).toBe(1)
            expect(queryAllByTestId('Message.msg').length).toBe(1)
            expect(queryAllByTestId('Message.subContainer').length).toBe(1)
            expect(queryAllByTestId('Message.text').length).toBe(1)
            expect(queryAllByTestId('Message.timestamp').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(TestComponentFromMe)

            expect(getByTestId('Message.container').props.style).toStrictEqual(styles.containerOut)
            expect(getByTestId('Message.msg').props.style).toStrictEqual(styles.msgOut)
            expect(getByTestId('Message.subContainer').props.style).toStrictEqual(styles.subCont)
            expect(getByTestId('Message.text').props.style[0]).toStrictEqual(styles.messageText)
            expect(getByTestId('Message.text').props.style[1]).toStrictEqual({ color: Colors.white })
            expect(getByTestId('Message.timestamp').props.style[0]).toStrictEqual(styles.timestamp)
            expect(getByTestId('Message.timestamp').props.style[1]).toStrictEqual({ color: Colors.white })
        })

        it('renders the message text', () => {
            const { queryAllByText } = render(TestComponentFromMe)

            expect(queryAllByText('testContent1').length).toBe(1)
        })
    })

    describe('message to me', () => {
        it('renders default elements', () => {
            const { queryAllByTestId } = render(TestComponentToMe)

            expect(queryAllByTestId('Message.container').length).toBe(1)
            expect(queryAllByTestId('Message.msg').length).toBe(1)
            expect(queryAllByTestId('Message.subContainer').length).toBe(1)
            expect(queryAllByTestId('Message.text').length).toBe(1)
            expect(queryAllByTestId('Message.timestamp').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(TestComponentToMe)

            expect(getByTestId('Message.container').props.style).toStrictEqual(styles.containerIn)
            expect(getByTestId('Message.msg').props.style).toStrictEqual(styles.msgIn)
            expect(getByTestId('Message.subContainer').props.style).toStrictEqual(styles.subCont)
            expect(getByTestId('Message.text').props.style[0]).toStrictEqual(styles.messageText)
            expect(getByTestId('Message.text').props.style[1]).toStrictEqual({ color: Colors.dark })
            expect(getByTestId('Message.timestamp').props.style[0]).toStrictEqual(styles.timestamp)
            expect(getByTestId('Message.timestamp').props.style[1]).toStrictEqual({ color: Colors.dark })
        })

        it('renders the message text', () => {
            const { queryAllByText } = render(TestComponentToMe)

            expect(queryAllByText('testContent2').length).toBe(1)
        })
    })
})

describe('formats the timestamp correctly', () => {
    it('from me message', () => {
        const { getByTestId } = render(TestComponentFromMe)

        const timestamp = formatMessageTimestamp(fromMeMessage.timestamp)
        expect(getByTestId('Message.timestamp').props.children).toBe(timestamp)
    })

    it('to me message', () => {
        const { getByTestId } = render(TestComponentToMe)

        const timestamp = formatMessageTimestamp(toMeMessage.timestamp)
        expect(getByTestId('Message.timestamp').props.children).toBe(timestamp)
    })
})
