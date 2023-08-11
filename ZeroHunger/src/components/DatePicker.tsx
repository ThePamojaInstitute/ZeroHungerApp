import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import styles from "../../styles/components/datePickerStyleSheet"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors } from "../../styles/globalStyleSheet";
import moment from "moment";


const DatePicker = ({ setNeedBy, errField }) => {
    const minDate = new Date();
    const maxDate = new Date(minDate);
    maxDate.setMonth(maxDate.getMonth() + 1); // Discuss this

    const [date, setDate] = useState(minDate);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(false)

    const handleChange = (event: DateTimePickerEvent, selectedDate: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(new Date(currentDate));
        setSelected(true)
        const oneDayLater = moment(currentDate).add(1, 'day')
        const formattedDate = moment(oneDayLater.toDate(), 'YYYY-MM-DD HH:mm')

        setNeedBy(formattedDate)
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
            <Pressable
                testID="DatePicker.showBtn"
                style={[styles.datePickerContainer,
                { borderColor: errField === 'needBy' ? Colors.alert2 : '#D1D1D1' }]}
                onPress={() => setShow(true)}
            >
                <Image
                    testID="DatePicker.calendarImg"
                    style={styles.datePickerImg}
                    source={require('../../assets/calendar.png')}
                />
                <Text
                    testID="DatePicker.selectedDate"
                    style={styles.datePickerDate}
                >{selected ? toStringDate(date) : 'MM/DD/YYYY'}</Text>
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
