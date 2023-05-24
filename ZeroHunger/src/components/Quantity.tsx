import { StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { useState } from "react";

const Quantity = () => {
    const [count, setCount] = useState(0);

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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPressSub}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                keyboardType='numeric'
                inputMode="numeric"
                value={count.toString()}
                onChangeText={value => handleChange(value)}
            />
            <TouchableOpacity style={styles.button} onPress={onPressAdd}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 40,
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#099999",
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    input: {
        // flex: 1,
        padding: 10,
        marginLeft: 10,
        fontSize: 15,
    },
})
export default Quantity