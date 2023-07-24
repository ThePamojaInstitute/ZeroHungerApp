import { useState } from "react";
import { View, Text } from "react-native";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DatePicker = () => {
    const minDate = new Date();
    const maxDate = new Date(minDate);
    maxDate.setMonth(maxDate.getMonth() + 3); // Discuss this

    const [date, setDate] = useState(minDate);
    const [selected, setSelected] = useState(false)

    const handleChange = (date: Date) => {
        setDate(date)
        setSelected(true)
    }

    return (
        <View testID="DatePickerWeb.container" style={{ marginBottom: 15 }}>
            <ReactDatePicker
                portalId="id"
                id="datePicker"
                selected={date}
                onChange={handleChange}
                minDate={minDate}
                maxDate={maxDate}
            />
            <Text testID="DatePickerWeb.date">{selected && `selected: ${date.toLocaleDateString()}`}</Text>
        </View>
    );
};

export default DatePicker