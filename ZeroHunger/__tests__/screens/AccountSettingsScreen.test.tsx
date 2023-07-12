import styles from "../../styles/screens/accountSettingsStyleSheet"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import DrawerTab from "../../src/components/DrawerTab";
import { mock } from "jest-mock-extended";
import { act, fireEvent, render } from "@testing-library/react-native";
import { axiosInstance } from "../../config";
import * as Utils from "../../src/controllers/auth";
import MockAdapter from "axios-mock-adapter";

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

mockAxios.onGet("posts/requestPostsForFeed").reply(200, {})
mockAxios.onPost("posts/requestPostsForFeed").reply(200, {})

const spyDeleteUser = jest.spyOn(Utils, 'deleteUser')
const spyLogOutUser = jest.spyOn(Utils, 'logOutUser')

afterEach(() => {
    jest.clearAllMocks()
    spyLogOutUser.mockReset()
    mockAxios.resetHistory()
})

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

describe('onload', () => {
    describe('default elements', () => {
        it('renders default elements', async () => {
            const { getAllByText, getAllByTestId, getByTestId } = render(<TestComponent />)
            const button = getByTestId('Drawer.accSettBtn')
            await act(() => {
                fireEvent.press(button)
            })

            expect(getAllByTestId('AccSett.container').length).toBe(1)
            expect(getAllByTestId('AccSett.deleteUserBtn').length).toBe(1)
            expect(getAllByTestId('AccSett.deleteUserBtnText').length).toBe(1)
            expect(getAllByText('Delete User').length).toBe(1)
        })

        // TODO
        // it('renders default styles', () => {
        //     const { getByTestId } = render(<TestComponent />)
        // })
    })
})

describe('deleteUser function', () => {
    it('returns success message if delete request status is 200', async () => {
        mockAxios.onDelete('users/deleteUser').reply(200, {})
        const res = await Utils.deleteUser("101", "token")
        expect(res).toBe("success")
    })

    it('returns error message if delete request status is not 200', async () => {
        mockAxios.onDelete('users/deleteUser').reply(204, {})
        const res = await Utils.deleteUser("101", "token")
        expect(res).toBe("An error occured")
    })
})

describe('handleDeleteUser', () => {
    it('calls deleteUser function when button is pressed', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(spyDeleteUser).toBeCalledWith("1", "access_token")
    })

    it('calls logOutUser when delete request resolves', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        mockAxios.onDelete('users/deleteUser').reply(200, {})
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(spyLogOutUser).toBeCalled()
    })

    it('calls dispatch to LOGOUT when logOutUser resolves', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        mockAxios.onDelete('users/deleteUser').reply(200, {})
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(mockDispatch).toBeCalledWith({ type: "LOGOUT", payload: null })
    })

    it('gives success alert when logOutUser resolves', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        mockAxios.onDelete('users/deleteUser').reply(200, {})
        spyLogOutUser.mockResolvedValue()

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(mockAlertDispatch).toBeCalledWith({ "alertType": "success", "message": "Account deleted successfully!", "type": "open" })
    })

    // it('navigates to login screen when logOutUser resolves', async () => {
    //     const { getByTestId } = render(<TestComponent />)

    //     const accSettBtn = getByTestId('Drawer.accSettBtn')
    //     await act(() => {
    //         fireEvent.press(accSettBtn)
    //     })
    //     const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

    //     mockAxios.onDelete('users/deleteUser').reply(200, {})
    //     spyLogOutUser.mockResolvedValue()

    //     await act(() => {
    //         fireEvent.press(deleteUserBtn)
    //     })

    //     getByTestId('Login.container')
    //     // expect(mockNavigation.navigate).toBeCalledWith("LoginScreen")
    // })

    it('doesnt call dispatch when logOutUser rejects', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        mockAxios.onDelete('users/deleteUser').reply(200, {})
        spyLogOutUser.mockRejectedValue({})

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(mockDispatch).not.toBeCalled()
    })

    // it('doesnt navigate to login screen when logOutUser rejects', async () => {
    //     const { getByTestId } = render(<TestComponent />)

    //     const accSettBtn = getByTestId('Drawer.accSettBtn')
    //     await act(() => {
    //         fireEvent.press(accSettBtn)
    //     })
    //     const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

    //     mockAxios.onDelete('users/deleteUser').reply(200, {})
    //     spyLogOutUser.mockRejectedValue({})

    //     await act(() => {
    //         fireEvent.press(deleteUserBtn)
    //     })

    //     expect(mockNavigation.navigate).not.toBeCalled()
    // })

    it('doesnt call logOutUser when delete request rejects', async () => {
        const { getByTestId } = render(<TestComponent />)

        const accSettBtn = getByTestId('Drawer.accSettBtn')
        await act(() => {
            fireEvent.press(accSettBtn)
        })
        const deleteUserBtn = getByTestId("AccSett.deleteUserBtn")

        mockAxios.onDelete('users/deleteUser').reply(204, {})

        await act(() => {
            fireEvent.press(deleteUserBtn)
        })

        expect(spyLogOutUser).not.toBeCalled()
    })
})
