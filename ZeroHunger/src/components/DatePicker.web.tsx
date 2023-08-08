import React, { forwardRef, useState } from "react";
import { View } from "react-native";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { Colors } from "../../styles/globalStyleSheet";
import "react-datepicker/dist/react-datepicker.css";


const DatePicker = ({ setNeedBy, errField }) => {
    const minDate = new Date();
    const maxDate = new Date(minDate);
    maxDate.setMonth(maxDate.getMonth() + 1); // Discuss this

    const [date, setDate] = useState(minDate);
    const [selected, setSelected] = useState(false)

    const handleChange = (date: Date) => {
        setDate(date)
        setSelected(true)
        const oneDayLater = moment(date).add(1, 'day')
        const formattedDate = moment(oneDayLater.toDate(), 'YYYY-MM-DD HH:mm')
        setNeedBy(formattedDate)
    }

    const ReactDatePickerInput = forwardRef<
        HTMLInputElement,
        React.DetailedHTMLProps<
            React.InputHTMLAttributes<HTMLInputElement>,
            HTMLInputElement
        >
    >((props, ref) => (
        <div>
            <div style={{
                backgroundColor: Colors.offWhite,
                display: 'flex',
                width: 130,
                height: 33,
                borderWidth: 5,
                borderColor: 'red',
                borderRadius: 10,
                color: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
                cursor: 'pointer',
                marginTop: 5,
                border: `1px solid ${errField === 'needBy' ? Colors.alert2 : '#D1D1D1'}`
            }} ref={ref} {...props}>
                <img style={{ height: 18, width: 19.5, marginLeft: 10, position: 'absolute', left: 0 }} src={require('../../assets/calendar.png')}></img>
                <p style={{
                    fontFamily: 'PublicSans_400Regular',
                    fontSize: 13,
                    color: '#656565',
                    marginLeft: 30,
                }}>{selected ? props.value : 'MM/DD/YYYY'}</p>
            </div>
        </div>
    ))

    return (
        <View testID="DatePickerWeb.container">
            <ReactDatePicker
                customInput={<ReactDatePickerInput />}
                portalId="id"
                id="datePicker"
                selected={date}
                onChange={handleChange}
                minDate={minDate}
                maxDate={maxDate}
            />
        </View>
    );
};

export default DatePicker