import { StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "../../styles/globalStyleSheet";
import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

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
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { opacity: min ? 0.2 : 1 }]} onPress={onPressSub}>
                <Ionicons name="remove-outline" size={26} color="black" />
                {/* <Text style={styles.buttonText}>-</Text> */}
            </TouchableOpacity>
            <TextInput
                nativeID="quantity"
                style={styles.input}
                keyboardType='numeric'
                inputMode="numeric"
                value={count.toString()}
                onChangeText={value => handleChange(value)}
            />
            <TouchableOpacity style={[styles.button, { opacity: max ? 0.2 : 1 }]} onPress={onPressAdd}>
                <Ionicons name="add-outline" size={26} color="black" />
                {/* <Text style={styles.buttonText}>+</Text> */}
            </TouchableOpacity>

            {/* Temporary buttons for dropdown menu */}
            {/* <View style={{ padding: 20 }} />
            <Option option='Piece' />
            <Option option='Measurement' /> */}
            <DropDownPicker
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
                    fontFamily: 'PublicSans_400Regular',
                    fontSize: 13,
                    color: '#656565'
                }}
                listItemLabelStyle={{
                    fontFamily: 'PublicSans_400Regular',
                    fontSize: 13,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 15
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 25,
        backgroundColor: Colors.primaryLight,
    },
    buttonText: {
        color: Colors.dark,
        fontWeight: '300',
        fontSize: 30,
    },
    input: {
        // flex: 1,
        padding: 9.2,
        marginLeft: 10,
        fontSize: 15,
        width: 35,
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        // marginVertical: 15,
        marginTop: 5,
        // marginBottom: 15,
        marginHorizontal: 4,
        borderRadius: 10,
    },
    itemPressed: {
        backgroundColor: '#000000',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 4,
    },
    picker: {
        marginLeft: 40,
        height: 0,
        width: '45%',
        borderRadius: 10,
        borderColor: '#D1D1D1'
    },
    arrowIconContainer: {
        backgroundColor: Colors.primaryLight,
        paddingVertical: 15,
        marginRight: -10,
        borderTopRightRadius: 10,
        paddingHorizontal: 8
    }
})

export default Quantity