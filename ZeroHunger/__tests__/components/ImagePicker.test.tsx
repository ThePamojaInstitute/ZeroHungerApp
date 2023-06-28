import { act, fireEvent, render } from "@testing-library/react-native"
import ImagePicker from "../../src/components/ImagePicker"
import * as ExpoImagePicker from 'expo-image-picker';
import '@testing-library/jest-dom'
import { AlertContext, AlertContextFields, AlertContextType } from "../../src/context/Alert";
import { mock } from "jest-mock-extended";

const mockSetImages = jest.fn()
const mockAlert = mock<AlertContextFields>()
const mockAlertDispatch: React.Dispatch<any> = jest.fn()
const mockAlertValue: AlertContextType = {
    alert: mockAlert,
    dispatch: mockAlertDispatch
}

const spyLaunchImageLibrary = jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync')

afterEach(() => {
    jest.clearAllMocks();
})

const TestComponent = (
    <AlertContext.Provider value={mockAlertValue}>
        <ImagePicker setImages={mockSetImages} />
    </AlertContext.Provider>
)

describe('onload', () => {
    it('renders correctly', () => {
        const { getByText, getByTestId } = render(TestComponent)

        getByTestId("ImagePicker.accessButton")
    })
})

describe("Access Camera Roll button", () => {
    it('calls pickImages when pressed', async () => {
        const { getByTestId } = render(TestComponent)

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        expect(spyLaunchImageLibrary).toBeCalled()
    })
})

describe('pickImages function on web', () => {
    it('shows image when only one image is selected', async () => {
        const { queryAllByText, getByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        getByTestId('image1')
    })

    it('shows images when more than one image is selected', async () => {
        const { queryAllByText, getByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets:
                [{ height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' }]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        getByTestId('image1')
        getByTestId('image2')
        getByTestId('image3')
    })

    it('doesnt show limit message when 5 images are selected', async () => {
        const { getByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' },
                { height: 1080, width: 1920, uri: 'image4' },
                { height: 1080, width: 1920, uri: 'image5' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        expect(mockAlertDispatch).not.toBeCalled()
    })

    it('shows limit message when more than 5 images are selected', async () => {
        const { getByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' },
                { height: 1080, width: 1920, uri: 'image4' },
                { height: 1080, width: 1920, uri: 'image5' },
                { height: 1080, width: 1920, uri: 'image6' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "The limit is 5 images per post",
            "type": "open"
        })
    })

    it('shows only 5 images when more than 5 images are selected', async () => {
        const { getByText, getByTestId, queryByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' },
                { height: 1080, width: 1920, uri: 'image4' },
                { height: 1080, width: 1920, uri: 'image5' },
                { height: 1080, width: 1920, uri: 'image6' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        getByTestId('image1')
        getByTestId('image2')
        getByTestId('image3')
        getByTestId('image4')
        getByTestId('image5')
        expect(queryByTestId('image6')).not.toBeInTheDocument()
        expect(mockAlertDispatch).toBeCalledWith({
            "alertType": "error",
            "message": "The limit is 5 images per post",
            "type": "open"
        })
    })

    it('deletes an image when the delete button is pressed', async () => {
        const { queryByTestId, getByTestId } = render(TestComponent)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' },
                { height: 1080, width: 1920, uri: 'image4' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("ImagePicker.accessButton"))
        })

        fireEvent.press(getByTestId("image3.DeleteButton"))
        expect(queryByTestId('image3')).not.toBeInTheDocument()
    })
})