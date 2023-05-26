import { act, fireEvent, render } from "@testing-library/react-native"
import ImagePicker from "../../src/components/ImagePicker"
import * as ExpoImagePicker from 'expo-image-picker';
import '@testing-library/jest-dom'

const spyLaunchCamera = jest.spyOn(ExpoImagePicker, 'launchImageLibraryAsync')

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

        expect(spyLaunchCamera).toBeCalled()
    })
})

describe('pickImages function on web', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'web',
        select: () => null
    }));

    it('shows image when only one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("No Images").length).toBe(0)
        getByTestId('image1')
    })

    it('shows images when more than one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }] })

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

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("The limit is 5 images per post").length).toBe(0)
    })

    it('shows limit message when more than 5 images are selected', async () => {
        const { getByTestId, getByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }, { uri: 'image6' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        getByText("The limit is 5 images per post")
    })

    it('shows only 5 images when more than 5 images are selected', async () => {
        const { getByTestId, getByText, queryByTestId } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }, { uri: 'image6' }] })

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

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        fireEvent.press(getByTestId("image3.DeleteButton"))
        expect(queryByTestId('image3')).not.toBeInTheDocument()
    })
})

describe('pickImages function on android', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'android',
        select: () => null
    }));

    it('shows image when only one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("No Images").length).toBe(0)
        getByTestId('image1')
    })

    it('shows images when more than one image is selected', async () => {
        const { getByTestId, queryAllByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }] })

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

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        expect(queryAllByText("The limit is 5 images per post").length).toBe(0)
    })

    it('shows limit message when more than 5 images are selected', async () => {
        const { getByTestId, getByText } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }, { uri: 'image6' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        getByText("The limit is 5 images per post")
    })

    it('shows only 5 images when more than 5 images are selected', async () => {
        const { getByTestId, getByText, queryByTestId } = render(<ImagePicker />)

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }, { uri: 'image5' }, { uri: 'image6' }] })

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

        spyLaunchCamera.mockResolvedValue({ cancelled: false, selected: [{ uri: 'image1' }, { uri: 'image2' }, { uri: 'image3' }, { uri: 'image4' }] })

        await act(() => {
            fireEvent.press(getByTestId("AccessCameraRoll.Button"))
        })

        fireEvent.press(getByTestId("image3.DeleteButton"))
        expect(queryByTestId('image3')).not.toBeInTheDocument()
    })
})

// TODO
// describe('pickImages function on ios', () => {})