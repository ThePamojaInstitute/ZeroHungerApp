import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import DatePicker from "../../src/components/DatePicker"


describe('on component load', () => {
    it('renders show date picker button', () => {
        const { getByTestId } = render(<DatePicker />)

        getByTestId("ShowDatePicker.Button")
    })
})

describe('on show date picker', () => {
    it('shows date picker when button is pressed', async () => {
        const { getByTestId } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        getByTestId("dateTimePicker")
    })
})

describe('on date picker load', () => {
    it('initializes the date to todays date', async () => {
        const { getByTestId } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        const picker = getByTestId("dateTimePicker")

        expect(picker.props.value.toLocaleDateString()).toBe(new Date().toLocaleDateString())
    })

    it('initializes the mode to date', async () => {
        const { getByTestId } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        const picker = getByTestId("dateTimePicker")

        expect(picker.props.mode).toBe("date")
    })

    it('initializes minDate to todays date', async () => {
        const { getByTestId } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        const picker = getByTestId("dateTimePicker")

        expect(picker.props.minimumDate.toLocaleDateString()).toBe(new Date().toLocaleDateString())
    })

    it('initializes maxDate to 3 months after today', async () => {
        const { getByTestId } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        const picker = getByTestId("dateTimePicker")

        const maxDate = new Date(new Date());
        maxDate.setMonth(maxDate.getMonth() + 3);

        expect(picker.props.maximumDate.toLocaleDateString()).toEqual(maxDate.toLocaleDateString())
    })
})

describe('onChange', () => {
    it('changes the date pickers value', async () => {
        const { getByTestId, getByText } = render(<DatePicker />)

        await act(() => {
            fireEvent.press(getByTestId("ShowDatePicker.Button"))
        })

        const picker = getByTestId("dateTimePicker")

        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const selectedDate = new Date(date)

        await act(() => {
            fireEvent(picker, 'onChange', {
                nativeEvent: { timestamp: selectedDate.getTime() },
            }, selectedDate.getTime());
        })

        getByText("selected: " + selectedDate.toLocaleDateString())
    })
})