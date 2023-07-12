import { act, fireEvent, render } from "@testing-library/react-native"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RequestFormScreen } from "../../src/screens/RequestFormScreen";
import * as Utils from "../../src/controllers/post";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../src/context/AuthContext"
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert"
import { mock } from "jest-mock-extended";
import MockAdapter from "axios-mock-adapter";
import styles from "../../styles/screens/postFormStyleSheet"
import datePickerStyles from "../../styles/components/datePickerStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { useFonts } from '@expo-google-fonts/public-sans';
import LoginScreen from "../../src/screens/Loginscreen";


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
const mockEvent = { preventDefault: jest.fn() };
const mockUser = { username: 'test', user_id: '1' }

const spyCreatePost = jest.spyOn(Utils, 'createPost')

afterEach(() => {
    (useFonts as jest.Mock).mockImplementation(() => [true])
    jest.clearAllMocks();
})

const AuthContextValues = { user: "", accessToken: "", refreshToken: "", loading: false, error: "", dispatch: null }

const TestComponent = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={AuthContextValues}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="RequestFormScreen"
                            component={RequestFormScreen}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                        />
                    </Stack.Navigator>
                </AlertContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}
const TestComponentLoggedIn = () => {
    const Stack = createNativeStackNavigator();

    return (
        <AuthContext.Provider value={{ ...AuthContextValues, user: mockUser }}>
            <NavigationContainer>
                <AlertContext.Provider value={mockAlertValue}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="RequestFormScreen"
                            component={RequestFormScreen}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
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

        expect(getAllByText('Loading...').length).toBe(1)
    })

    it('doesn\'t show default elements', () => {
        (useFonts as jest.Mock).mockImplementation(() => [false])
        const { queryAllByText, queryAllByTestId } = render(<TestComponent />)

        expect(queryAllByTestId('Request.cancelBtn').length).toBe(0)
        expect(queryAllByTestId('Request.createBtn').length).toBe(0)
        expect(queryAllByTestId('Request.titleLabel').length).toBe(0)
        expect(queryAllByText('Title *').length).toBe(0)
        expect(queryAllByText('Create a descriptive title for your request').length).toBe(0)
        expect(queryAllByTestId('Request.titleInput').length).toBe(0)
        expect(queryAllByText('Photo').length).toBe(0)
        expect(queryAllByText('Optional: Add photo(s) to help community members understand what you are looking for!').length).toBe(0)
        expect(queryAllByText('Food Category Type *').length).toBe(0)
        expect(queryAllByText('Please select all the food category type that applies').length).toBe(0)
        expect(queryAllByText('Quantity *').length).toBe(0)
        expect(queryAllByText('Please input the desired quantity of the food item you need').length).toBe(0)
        expect(queryAllByText('Need By Date').length).toBe(0)
        expect(queryAllByText('Optional: Please select a date you would need this item by. Your post will expire at the end of this date.').length).toBe(0)
        expect(queryAllByText('Description').length).toBe(0)
        expect(queryAllByText('Optional: Describe your food request in detail').length).toBe(0)
        expect(queryAllByTestId('Request.descInput').length).toBe(0)
    })
})

describe('onload', () => {
    describe('default elements', () => {
        it('renders default elements', () => {
            const { getAllByText, getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('Request.cancelBtn').length).toBe(1)
            expect(getAllByTestId('Request.cancelBtnLabel').length).toBe(1)
            expect(getAllByTestId('Request.createBtn').length).toBe(1)
            expect(getAllByTestId('Request.createBtnLabel').length).toBe(1)
            expect(getAllByTestId('Request.titleLabel').length).toBe(1)
            expect(getAllByText('Title *').length).toBe(1)
            expect(getAllByText('Create a descriptive title for your request').length).toBe(1)
            expect(getAllByTestId('Request.titleInput').length).toBe(1)
            expect(getAllByText('Photo').length).toBe(1)
            expect(getAllByText('Optional: Add photo(s) to help community members understand what you are looking for!').length).toBe(1)
            expect(getAllByText('Food Category Type *').length).toBe(1)
            expect(getAllByText('Please select all the food category type that applies').length).toBe(1)
            expect(getAllByText('Quantity *').length).toBe(1)
            expect(getAllByText('Please input the desired quantity of the food item you need').length).toBe(1)
            expect(getAllByText('Need By Date').length).toBe(1)
            expect(getAllByText('Optional: Please select a date you would need this item by. Your post will expire at the end of this date.').length).toBe(1)
            expect(getAllByText('Description').length).toBe(1)
            expect(getAllByText('Optional: Describe your food request in detail').length).toBe(1)
            expect(getAllByTestId('Request.descInput').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(<TestComponent />)

            expect(getByTestId('Request.cancelBtnLabel').props.style).toBe(styles.formCancelBtn)
            expect(getByTestId('Request.createBtn').parent.parent.props.style[0]).toBe(globalStyles.navDefaultBtn)
            expect(getByTestId('Request.createBtnLabel').props.style).toBe(globalStyles.defaultBtnLabel)
            expect(getByTestId('Request.formContainer').props.style).toBe(styles.formContainer)
            expect(getByTestId('Request.titleLabel').props.style[0]).toBe(styles.formTitleText)
            expect(getByTestId('Request.titleLabel').props.style[1].color).toBe(Colors.dark)
            expect(getByTestId('Request.titleDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.formInputContainer').props.style).toBe(styles.formInputContainer)
            expect(getByTestId('Request.titleInput').props.style[0]).toBe(styles.formInput)
            expect(getByTestId('Request.titleInput').props.style[1].borderColor).toBe(Colors.midLight)
            expect(getByTestId('Request.photoLabel').props.style).toBe(styles.formTitleText)
            expect(getByTestId('Request.photoDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.categoryLabel').props.style).toBe(styles.formTitleText)
            expect(getByTestId('Request.categoryDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.quantityLabel').props.style).toBe(styles.formTitleText)
            expect(getByTestId('Request.quantityDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.dateLabel').props.style).toBe(styles.formTitleText)
            expect(getByTestId('Request.dateDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.descTitle').props.style).toBe(styles.formTitleText)
            expect(getByTestId('Request.descDesc').props.style).toBe(styles.formDescText)
            expect(getByTestId('Request.descInput').props.style).toBe(styles.formInputText)
        })
    })

    describe('ImagePicker', () => {
        it('renders default elements', () => {
            const { getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('ImagePicker.container').length).toBe(1)
            expect(getAllByTestId('ImagePicker.accessButton').length).toBe(1)
            expect(getAllByTestId('ImagePicker.image').length).toBe(1)
            expect(getAllByTestId('ImagePicker.imagesContainer').length).toBe(1)
            expect(getAllByTestId('ImagePicker.imagesList').length).toBe(1)
        })

        // TODO
        // it('renders default styles', () =>{})
    })


    describe('FoodCategories', () => {
        it('renders default elements', () => {
            const { getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('FoodCategories.container').length).toBe(1)
            expect(getAllByTestId('FoodCategories.list').length).toBe(1)
        })

        // TODO
        // it('renders default styles', () =>{})
    })

    describe('Quantity', () => {
        it('renders default elements', () => {
            const { getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('Quantity.container').length).toBe(1)
            expect(getAllByTestId('Quantity.subBtn').length).toBe(1)
            expect(getAllByTestId('Quantity.input').length).toBe(1)
            expect(getAllByTestId('Quantity.addBtn').length).toBe(1)
            expect(getAllByTestId('Quantity.dropDownPicker').length).toBe(1)
        })

        // TODO
        // it('renders default styles', () =>{})
    })

    describe('DatePicker', () => {
        it('renders default elements', () => {
            const { getAllByTestId } = render(<TestComponent />)

            expect(getAllByTestId('DatePicker.container').length).toBe(1)
            expect(getAllByTestId('DatePicker.showBtn').length).toBe(1)
            expect(getAllByTestId('DatePicker.calendarImg').length).toBe(1)
            expect(getAllByTestId('DatePicker.selectedDate').length).toBe(1)
        })

        it('renders default styles', () => {
            const { getByTestId } = render(<TestComponent />)

            expect(getByTestId('DatePicker.showBtn').props.style).toBe(datePickerStyles.datePickerContainer)
            expect(getByTestId('DatePicker.calendarImg').props.style).toBe(datePickerStyles.datePickerImg)
            expect(getByTestId('DatePicker.selectedDate').props.style).toBe(datePickerStyles.datePickerDate)
        })
    })

    // it('renders DatePicker(web)', () => {
    //     Platform.OS = 'web'

    //     const { getAllByTestId } = render(TestComponent)

    //     expect(getAllByTestId('DatePickerWeb.container').length).toBe(1)
    //     expect(getAllByTestId('DatePickerWeb.date').length).toBe(1)
    // })
})

describe('on post submit', () => {
    describe('if user not logged in', () => {
        it('shows alert', async () => {
            const { getByTestId, queryAllByTestId } = render(<TestComponent />)

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(mockAlertDispatch).toBeCalledTimes(1)
            expect(mockAlertDispatch).toBeCalledWith({
                "alertType": "error",
                "message": "You are not logged in!",
                "type": "open"
            })
            expect(queryAllByTestId('Login.container').length).toBe(1)
        })
    })

    describe('on title not entered', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(<TestComponentLoggedIn />)

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            const titleErrMsg = getByTestId('Request.titleErrMsg')

            expect(queryAllByText('Please enter a title to your request').length).toBe(1)
            expect(titleErrMsg.props.style).toBe(styles.formErrorMsg)
        })

        it('changes username label and text input\'s styles', async () => {
            const { getByTestId } = render(<TestComponentLoggedIn />)

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            const titleLabel = getByTestId('Request.titleLabel')
            const titleInput = getByTestId('Request.titleInput')

            expect(titleLabel.props.style[1].color).toBe(Colors.alert2)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and globalStyles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(<TestComponentLoggedIn />)

            const titleLabel = getByTestId('Request.titleLabel')
            const titleInput = getByTestId('Request.titleInput')

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(queryAllByText('Please enter a title to your request').length).toBe(1)
            expect(titleLabel.props.style[1].color).toBe(Colors.alert2)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.alert2)

            fireEvent.changeText(titleInput, 'Lorem ipsum dolor sit amet')

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(queryAllByText('Please enter a title to your request').length).toBe(0)
            expect(titleLabel.props.style[1].color).toBe(Colors.dark)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    describe('on title\'s length entered > 100', () => {
        it('shows error message', async () => {
            const { getByTestId, queryAllByText } = render(<TestComponentLoggedIn />)

            const titleInput = getByTestId('Request.titleInput')

            fireEvent.changeText(titleInput,
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma'
            )

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            const titleErrMsg = getByTestId('Request.titleErrMsg')

            expect(queryAllByText('Title should be at most 100 characters').length).toBe(1)
            expect(titleErrMsg.props.style).toBe(styles.formErrorMsg)
        })

        it('changes username label and text input\'s styles', async () => {
            const { getByTestId } = render(<TestComponentLoggedIn />)

            const titleLabel = getByTestId('Request.titleLabel')
            const titleInput = getByTestId('Request.titleInput')

            fireEvent.changeText(titleInput,
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma'
            )

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(titleLabel.props.style[1].color).toBe(Colors.alert2)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.alert2)
        })

        it('removes error message and globalStyles when input value changes', async () => {
            const { getByTestId, queryAllByText } = render(<TestComponentLoggedIn />)

            const titleLabel = getByTestId('Request.titleLabel')
            const titleInput = getByTestId('Request.titleInput')

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(queryAllByText('Please enter a title to your request').length).toBe(1)
            expect(titleLabel.props.style[1].color).toBe(Colors.alert2)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.alert2)

            fireEvent.changeText(titleInput, 'Lorem ipsum dolor sit amet')

            await act(() => {
                fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
            })

            expect(queryAllByText('Title should be at most 100 characters').length).toBe(0)
            expect(titleLabel.props.style[1].color).toBe(Colors.dark)
            expect(titleInput.props.style[1].borderColor).toBe(Colors.midLight)
        })
    })

    // TODO
    // describe('on category not selected',()=>{})
    // describe('on quantity not entered',()=>{})
    // describe('on quantity not entered',()=>{})
})

describe('createPost', () => {
    it('calls createPost when all required inputs are inputed', async () => {
        const { getByTestId } = render(<TestComponentLoggedIn />)

        const titleInput = getByTestId("Request.titleInput")
        const descInput = getByTestId("Request.descInput")

        fireEvent.changeText(titleInput, 'test title')
        fireEvent.changeText(descInput, 'test desc')

        await act(() => {
            fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
        })

        expect(spyCreatePost).toBeCalledTimes(1)
        expect(spyCreatePost).toBeCalledWith({
            "postData": {
                "description": "test desc",
                "images": "",
                "postedBy": "1",
                "postedOn": Math.floor(new Date().getTime() / 1000) || Math.floor(new Date().getTime() / 1000) + 1,
                "title": "test title"
            },
            "postType": "r",
        })
    })

    it('return failure message when request fails', async () => {
        const { getByTestId } = render(<TestComponentLoggedIn />)

        mockAxios.onPost('/posts/createPost').reply(500)

        const titleInput = getByTestId("Request.titleInput")
        const descInput = getByTestId("Request.descInput")

        fireEvent.changeText(titleInput, 'test title')
        fireEvent.changeText(descInput, 'test desc')

        await act(() => {
            fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledTimes(1)
        expect(mockAlertDispatch).toBeCalledWith({
            type: 'open',
            message: 'An error occured!',
            alertType: 'error'
        })
    })

    it('return success message when request succeeds', async () => {
        const { getByTestId } = render(<TestComponentLoggedIn />)

        mockAxios.onPost('/posts/createPost').reply(201)

        const titleInput = getByTestId("Request.titleInput")
        const descInput = getByTestId("Request.descInput")

        fireEvent.changeText(titleInput, 'test title')
        fireEvent.changeText(descInput, 'test desc')

        await act(() => {
            fireEvent.press(getByTestId("Request.createBtn"), mockEvent)
        })

        expect(mockAlertDispatch).toBeCalledTimes(1)
        expect(mockAlertDispatch).toBeCalledWith({
            type: 'open',
            message: 'Request posted successfully!',
            alertType: 'success'
        })
    })
})