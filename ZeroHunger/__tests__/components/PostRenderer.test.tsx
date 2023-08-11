import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";
import DrawerTab from "../../src/components/DrawerTab";
import { axiosInstance } from "../../config";
import MockAdapter from "axios-mock-adapter";
import { useFonts } from "@expo-google-fonts/public-sans";
import styles from "../../styles/components/postRendererStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet";


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
const mockDispatch = jest.fn()
const mockAuthContextValues = {
    user: { username: "testUser", user_id: '1' },
    accessToken: "access_token",
    refreshToken: "",
    loading: false,
    error: "",
    dispatch: mockDispatch
}

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks()
    mockAxios.resetHistory()
})

const requestPosts = [
    {
        "pk": 1,
        "username": 'testUser',
        "fields": {
            "title": 'request1',
            "images": "",
            "postedOn": 1,
            "postedBy": 1,
            "description": 'test desc'
        }
    },
    {
        "pk": 2,
        "username": 'userTest',
        "fields": {
            "title": 'request2',
            "images": "",
            "postedOn": 2,
            "postedBy": 2,
            "description": 'test'
        }
    },
    {
        "pk": 3,
        "username": 'userTest',
        "fields": {
            "title": 'request3',
            "images": "",
            "postedOn": 3,
            "postedBy": 3,
            "description": 'test'
        }
    }
]
const offerPosts = [
    {
        "pk": 1,
        "username": 'testUser',
        "fields": {
            "title": 'offer1',
            "images": "",
            "postedOn": 1,
            "postedBy": 1,
            "description": 'test desc'
        }
    },
    {
        "pk": 2,
        "username": 'userTest',
        "fields": {
            "title": 'offer2',
            "images": "",
            "postedOn": 2,
            "postedBy": 2,
            "description": 'test'
        }
    },
    {
        "pk": 3,
        "username": 'userTest',
        "fields": {
            "title": 'offer3',
            "images": "",
            "postedOn": 3,
            "postedBy": 3,
            "description": 'test'
        }
    }
]

const TestComponent = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={mockAuthContextValues}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ZeroHunger"
                            component={DrawerTab}
                            options={{ headerShown: false }}
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
})

describe('when no posts', () => {
    it('shows no requests text', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

        const { getAllByText } = render(<TestComponent />)

        await waitFor(() => {
            expect(getAllByText('No requests available').length).toBe(1)
        })
    })

    it('shows no offers text', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

        const { getAllByText, getByTestId } = render(<TestComponent />)

        fireEvent.press(getByTestId('Home.offersBtn'))

        await waitFor(() => {
            expect(getAllByText('No offers available').length).toBe(1)
        })
    })
})

describe('rendering requests', () => {
    it('renders 1 request', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 1 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [requestPosts[0]])

        const { queryAllByText, getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            expect(queryAllByText('No requests available').length).toBe(0)
            getByTestId('Posts.title')
            expect(queryAllByText('request1').length).toBe(1)
        })
    })

    it('renders 2 requests', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 2 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [requestPosts[0], requestPosts[1]])

        const { queryAllByText, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No requests available').length).toBe(0)
            expect(queryAllByText('request1').length).toBe(1)
            expect(queryAllByText('request2').length).toBe(1)
        })
    })

    it('renders 5 requests', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 5 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, requestPosts.concat(requestPosts[0], requestPosts[1]))

        const { queryAllByText, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No requests available').length).toBe(0)
            expect(queryAllByText('request1').length).toBe(2)
            expect(queryAllByText('request2').length).toBe(2)
            expect(queryAllByText('request3').length).toBe(1)
        })
    })

    it('renders more than 5 requests', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 6 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, requestPosts.concat(requestPosts))

        const { queryAllByText, getAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No requests available').length).toBe(0)
            expect(queryAllByText('request1').length).toBe(2)
            expect(queryAllByText('request2').length).toBe(2)
            expect(queryAllByText('request3').length).toBe(2)
        })
    })
})

describe('rendering requests elements', () => {
    it('renders default elements', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 1 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [requestPosts[0]])

        const { queryAllByTestId } = render(<TestComponent />)

        await waitFor(() => {
            expect(queryAllByTestId('Posts.btn').length).toBe(1)
            expect(queryAllByTestId('Posts.Img').length).toBe(1)
            expect(queryAllByTestId('Posts.subContainer').length).toBe(1)
            expect(queryAllByTestId('Posts.contentCont').length).toBe(1)
            expect(queryAllByTestId('Posts.title').length).toBe(1)
            expect(queryAllByTestId('Posts.ellipsis').length).toBe(1)
            expect(queryAllByTestId('Posts.username').length).toBe(1)
            expect(queryAllByTestId('Posts.locationCont').length).toBe(1)
            expect(queryAllByTestId('Posts.locationText').length).toBe(1)
            expect(queryAllByTestId('Posts.tag').length).toBe(1)
            expect(queryAllByTestId('Posts.tagLabel').length).toBe(1)
        })
    })

    it('renders default styles', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 0, r: 1 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [requestPosts[0]])

        const { getByTestId } = render(<TestComponent />)

        await waitFor(() => {
            expect(getByTestId('Posts.btn').parent.parent.props.style[0]).toStrictEqual(styles.container)
            expect(getByTestId('Posts.Img').props.style).toStrictEqual(styles.image)
            expect(getByTestId('Posts.subContainer').props.style).toStrictEqual(styles.subContainer)
            expect(getByTestId('Posts.contentCont').props.style).toStrictEqual({ flexDirection: 'row' })
            expect(getByTestId('Posts.title').props.style).toStrictEqual(globalStyles.H4)
            expect(getByTestId('Posts.ellipsis').parent.parent.props.style[0]).toStrictEqual({ marginLeft: 'auto' })
            expect(getByTestId('Posts.username').props.style).toStrictEqual(globalStyles.Small1)
            expect(getByTestId('Posts.locationCont').props.style).toStrictEqual(styles.locationCont)
            expect(getByTestId('Posts.locationText').props.style).toStrictEqual(globalStyles.Small1)
            expect(getByTestId('Posts.tag').props.style).toStrictEqual(styles.postTag)
            expect(getByTestId('Posts.tagLabel').props.style).toStrictEqual(styles.postTagLabel)
        })
    })
})

describe('rendering offers', () => {
    it('renders 1 offer', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 1, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [offerPosts[0]])

        const { queryAllByText, getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            expect(queryAllByText('No offers available').length).toBe(0)
            getByTestId('Posts.title')
            expect(queryAllByText('offer1').length).toBe(1)
        })
    })

    it('renders 2 offers', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 2, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [offerPosts[0], offerPosts[1]])

        const { queryAllByText, getAllByTestId, getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No offers available').length).toBe(0)
            expect(queryAllByText('offer1').length).toBe(1)
            expect(queryAllByText('offer2').length).toBe(1)
        })
    })

    it('renders 5 offers', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 5, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, offerPosts.concat(offerPosts[0], offerPosts[1]))

        const { queryAllByText, getAllByTestId, getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No offers available').length).toBe(0)
            expect(queryAllByText('offer1').length).toBe(2)
            expect(queryAllByText('offer2').length).toBe(2)
            expect(queryAllByText('offer3').length).toBe(1)
        })
    })

    it('renders more than 5 offers', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 6, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, offerPosts.concat(offerPosts))

        const { queryAllByText, getAllByTestId, getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            getAllByTestId('Posts.title')
            expect(queryAllByText('No offers available').length).toBe(0)
            expect(queryAllByText('offer1').length).toBe(2)
            expect(queryAllByText('offer2').length).toBe(2)
            expect(queryAllByText('offer3').length).toBe(2)
        })
    })
})

describe('rendering offers elements', () => {
    it('renders default elements', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 1, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [offerPosts[0]])

        const { queryAllByTestId, getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            expect(queryAllByTestId('Posts.btn').length).toBe(1)
            expect(queryAllByTestId('Posts.Img').length).toBe(1)
            expect(queryAllByTestId('Posts.subContainer').length).toBe(1)
            expect(queryAllByTestId('Posts.contentCont').length).toBe(1)
            expect(queryAllByTestId('Posts.title').length).toBe(1)
            expect(queryAllByTestId('Posts.ellipsis').length).toBe(1)
            expect(queryAllByTestId('Posts.username').length).toBe(1)
            expect(queryAllByTestId('Posts.locationCont').length).toBe(1)
            expect(queryAllByTestId('Posts.locationText').length).toBe(1)
            expect(queryAllByTestId('Posts.tag').length).toBe(1)
            expect(queryAllByTestId('Posts.tagLabel').length).toBe(1)
        })
    })

    it('renders default styles', async () => {
        mockAxios.onGet("posts/requestPostsForFeed").reply(200, { o: 1, r: 0 })
        mockAxios.onPost("posts/requestPostsForFeed").reply(200, [offerPosts[0]])

        const { getByTestId } = render(<TestComponent />)
        const offersBtn = getByTestId('Home.offersBtn')

        fireEvent.press(offersBtn)

        await waitFor(() => {
            expect(getByTestId('Posts.btn').parent.parent.props.style[0]).toStrictEqual(styles.container)
            expect(getByTestId('Posts.Img').props.style).toStrictEqual(styles.image)
            expect(getByTestId('Posts.subContainer').props.style).toStrictEqual(styles.subContainer)
            expect(getByTestId('Posts.contentCont').props.style).toStrictEqual({ flexDirection: 'row' })
            expect(getByTestId('Posts.title').props.style).toStrictEqual(globalStyles.H4)
            expect(getByTestId('Posts.ellipsis').parent.parent.props.style[0]).toStrictEqual({ marginLeft: 'auto' })
            expect(getByTestId('Posts.username').props.style).toStrictEqual(globalStyles.Small1)
            expect(getByTestId('Posts.locationCont').props.style).toStrictEqual(styles.locationCont)
            expect(getByTestId('Posts.locationText').props.style).toStrictEqual(globalStyles.Small1)
            expect(getByTestId('Posts.tag').props.style).toStrictEqual(styles.postTag)
            expect(getByTestId('Posts.tagLabel').props.style).toStrictEqual(styles.postTagLabel)
        })
    })
})

