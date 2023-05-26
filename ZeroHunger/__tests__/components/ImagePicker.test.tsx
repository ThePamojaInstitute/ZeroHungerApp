import { act, fireEvent, render } from "@testing-library/react-native"
import ImagePicker from "../../src/components/ImagePicker"
import * as ExpoImagePicker from 'expo-image-picker';
import '@testing-library/jest-dom'

const spyLaunchImageLibrary = jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync')

afterEach(() => {
    jest.clearAllMocks();
})

describe('onload', () => {
    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<ImagePicker />)

        getByTestId("AccessCameraRoll.Button")
        getByText("No Images")
    })
})

describe("Access Camera Roll button", () => {
    it('calls pickImages when pressed', async () => {
        const { getByTestId } = render(<ImagePicker />)

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(spyLaunchImageLibrary).toBeCalled()
    })
})

describe('pickImages function on web', () => {
    it('shows image when only one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("No Images").length).toBe(0)
        getByTestId('image1')
    })

    it('shows images when more than one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets:
                [{ height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' }]
        })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("No Images").length).toBe(0)
        getByTestId('image1')
        getByTestId('image2')
        getByTestId('image3')
    })

    it('doesnt show limit message when 5 images are selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

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
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("The limit is 5 images per post").length).toBe(0)
    })

    it('shows limit message when more than 5 images are selected', async () => {
        const { getByTestId, getByText } = render(<ImagePicker />)

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
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        getByText("The limit is 5 images per post")
    })

    it('shows only 5 images when more than 5 images are selected', async () => {
        const { getByTestId, getByText, queryByTestId } = render(<ImagePicker />)

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
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        getByText("The limit is 5 images per post")
        getByTestId('image1')
        getByTestId('image2')
        getByTestId('image3')
        getByTestId('image4')
        getByTestId('image5')
        expect(queryByTestId('image6')).not.toBeInTheDocument()
    })

    it('deletes an image when the delete button is pressed', async () => {
        const { getByTestId, queryByTestId } = render(<ImagePicker />)

        spyLaunchImageLibrary.mockResolvedValue({
            canceled: false, assets: [
                { height: 1080, width: 1920, uri: 'image1' },
                { height: 1080, width: 1920, uri: 'image2' },
                { height: 1080, width: 1920, uri: 'image3' },
                { height: 1080, width: 1920, uri: 'image4' }
            ]
        })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        fireEvent.press(getByTestId("image3.DeleteButton"))
        expect(queryByTestId('image3')).not.toBeInTheDocument()
    })
})