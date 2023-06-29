import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";


const DatePicker = () => {
    const minDate = new Date();
    const maxDate = new Date(minDate);
    maxDate.setMonth(maxDate.getMonth() + 3); // Discuss this

    const [date, setDate] = useState(minDate);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(false)

    const handleChange = (event: DateTimePickerEvent, selectedDate: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(new Date(currentDate));
        setSelected(true)
    };

    const toStringDate = (date: Date) => {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        if (day < 10 && month < 10) {
            return `0${month}/0${day}/${year}`
        } else if (day < 10) {
            return `${month}/0${day}/${year}`
        } else if (month < 10) {
            return `0${month}/${day}/${year}`
        } else {
            return `${month}/${day}/${year}`
        }
    }

    return (
        <View testID="DatePicker.container">
            {/* <Button style={styles.logOutBtn} onPress={() => setShow(true)} title="Show date picker!" /> */}
            {/* <Ionicons name="calendar-outline" size={50} onPress={() => setShow(true)} title="Show date picker!" testID="ShowDatePicker.Button" />
            <Text>{selected && `selected: ${date.toLocaleDateString()}`}</Text> */}
            <Pressable
                testID="DatePicker.showBtn"
                style={globalStyles.datePickerContainer}
                onPress={() => setShow(true)}
            >
                <Image testID="DatePicker.calendarImg" style={globalStyles.datePickerImg} source={require('../../assets/calendar.png')} />
                <Text testID="DatePicker.selectedDate" style={globalStyles.datePickerDate}>{selected ? toStringDate(date) : 'MM/DD/YYYY'}</Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="DatePicker.dateTimePicker"
                    value={date}
                    mode={"date"}
                    onChange={handleChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                />
            )}
        </View>
    );
};

export default DatePicker
