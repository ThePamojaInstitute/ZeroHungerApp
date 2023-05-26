import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';


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

    // for iOS, add a button that closes the picker
    // const showDatepicker = () => {
    //     setShow(true);
    // };

    return (
        <View>
            {/* <Button style={styles.logOutBtn} onPress={() => setShow(true)} title="Show date picker!" /> */}
            <Ionicons name="calendar-outline" size={50} onPress={() => setShow(true)} title="Show date picker!" testID="ShowDatePicker.Button" />
            <Text>{selected && `selected: ${date.toLocaleDateString()}`}</Text>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
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

const styles = StyleSheet.create({
    logOutBtn: {
        title: "Login",
        width: "25%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "#6A6A6A",
    },
})