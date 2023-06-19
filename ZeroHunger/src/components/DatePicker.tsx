import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../../styles/globalStyleSheet";


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
        <View>
            {/* <Button style={styles.logOutBtn} onPress={() => setShow(true)} title="Show date picker!" /> */}
            {/* <Ionicons name="calendar-outline" size={50} onPress={() => setShow(true)} title="Show date picker!" testID="ShowDatePicker.Button" />
            <Text>{selected && `selected: ${date.toLocaleDateString()}`}</Text> */}
            <Pressable
                style={styles.container}
                onPress={() => setShow(true)}
            >
                <Image style={styles.img} source={require('../../assets/calendar.png')} />
                <Text style={styles.date}>{selected ? toStringDate(date) : 'MM/DD/YYYY'}</Text>
            </Pressable>
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
    container: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        width: '38%',
        padding: 5,
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 10
    },
    img: {
        marginLeft: -5,
        marginRight: 4,
        marginTop: 0,
        marginVertical: 2,
        width: '30%',
        height: '100%',
        resizeMode: 'contain'
    },
    date: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: '#656565',
        marginTop: 2
    }
})