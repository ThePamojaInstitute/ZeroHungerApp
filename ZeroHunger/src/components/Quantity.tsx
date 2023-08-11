import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, Pressable } from "react-native";
import styles from "../../styles/components/quantityStyleSheet"
import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Fonts } from "../../styles/globalStyleSheet";

const Quantity = () => {
    const [count, setCount] = useState(0);
    const [min, setMin] = useState(true)
    const [max, setMax] = useState(false)
    const [open, setOpen] = useState(false);
    const [measurement, setMeasurement] = useState('')

    const [measurements, setMeasurements] = useState([
        { label: 'measurement1', value: '1' },
        { label: 'measurement2', value: '2' },
        { label: 'measurement3', value: '3' },
        { label: 'measurement4', value: '4' },
        { label: 'measurement5', value: '5' },
    ]);

    useEffect(() => {
        if (count < 1) {
            setMin(true)
            setMax(false)
        } else if (count > 99) {
            setMax(true)
            setMin(false)
        } else {
            setMax(false)
            setMin(false)
        }
    }, [count])

    const onPressSub = () => {
        if (count > 0) {
            setCount(prevCount => prevCount - 1);
        }
    }
    const onPressAdd = () => {
        if (count <= 99) {
            setCount(prevCount => prevCount + 1)
        }
    }

    const handleChange = (value: string) => {
        if (parseInt(value) && parseInt(value) <= 100) {
            setCount(parseInt(value))
        } else if (!parseInt(value)) {
            setCount(0)
        }
    }

    // const Option = ({ option }) => {
    //     const [pressed, setPressed] = useState(false);
    //     const onPress = () => {
    //         setPressed(!pressed);
    //     }

    //     var btnStyle = { style: pressed ? styles.itemPressed : styles.item }

    //     return (
    //         <TouchableOpacity {...btnStyle} onPress={onPress}>
    //             <Text style={[{ color: pressed ? '#FFFFFF' : '#000000' }]}>{option}</Text>
    //         </TouchableOpacity>
    //     );
    // }

    return (
        <View testID="Quantity.container" style={styles.container}>
            <TouchableOpacity testID="Quantity.subBtn" style={[styles.button, { opacity: min ? 0.2 : 1 }]} onPress={onPressSub}>
                <Ionicons name="remove-outline" size={26} color="black" />
                {/* <Text style={styles.buttonText}>-</Text> */}
            </TouchableOpacity>
            <TextInput
                testID="Quantity.input"
                nativeID="quantity"
                style={styles.input}
                keyboardType='numeric'
                inputMode="numeric"
                value={count.toString()}
                onChangeText={value => handleChange(value)}
            />
            <TouchableOpacity testID="Quantity.addBtn" style={[styles.button, { opacity: max ? 0.2 : 1 }]} onPress={onPressAdd}>
                <Ionicons name="add-outline" size={26} color="black" />
                {/* <Text style={styles.buttonText}>+</Text> */}
            </TouchableOpacity>

            {/* Temporary buttons for dropdown menu */}
            {/* <View style={{ padding: 20 }} />
            <Option option='Piece' />
            <Option option='Measurement' /> */}
            <DropDownPicker
                testID="Quantity.dropDownPicker"
                open={open}
                value={measurement}
                items={measurements}
                setOpen={setOpen}
                setValue={setMeasurement}
                style={styles.picker}
                arrowIconContainerStyle={styles.arrowIconContainer}
                listMode="SCROLLVIEW"
                dropDownDirection="TOP"
                placeholder="Measurements"
                placeholderStyle={{
                    fontFamily: Fonts.PublicSans_Regular,
                    fontWeight: '400',
                    fontSize: 13,
                    color: '#656565'
                }}
                listItemLabelStyle={{
                    fontFamily: Fonts.PublicSans_Regular,
                    fontWeight: '400',
                    fontSize: 13,
                }}
            />
        </View>
    )
}

export default Quantity
