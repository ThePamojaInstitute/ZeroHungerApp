import { render } from "@testing-library/react-native"
import { Message } from "../../src/components/Message"
import { AuthContext } from "../../src/context/AuthContext"
import '@testing-library/jest-dom'

const message = {
    id: "1",
    room: "testRoom",
    from_user: {
        username: "fromUserTest",
        token: "fromUserToken"
    },
    to_user: {
        username: "toUserTest",
        token: "toUserToken"
    },
    content: "testContent",
    timestamp: "2023-06-01T14:53:33.965885Z",
    read: true
}
const AuthContextValues = {
    user: { username: "toUserTest" },
    accessToken: "",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: null
}

describe('onload', () => {
    it('renders correctly', () => {
        const { queryAllByText } = render(
            <AuthContext.Provider value={AuthContextValues}>
                <Message message={message} />
            </AuthContext.Provider>
        )

        expect(queryAllByText('testContent').length).toBe(1)
        expect(queryAllByText('10:53').length).toBe(1)
    })

    it('shows invalid if timestamp is invalid', () => {
        const { getByText } = render(
            <AuthContext.Provider value={AuthContextValues}>
                <Message message={{ ...message, timestamp: "invalidTimestamp" }} />
            </AuthContext.Provider>
        )

        getByText('Inval')
    })
})