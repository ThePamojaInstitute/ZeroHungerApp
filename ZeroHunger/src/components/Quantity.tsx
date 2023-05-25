import { StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable } from "react-native";
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

    const Option = ({option}) => {
        const [pressed, setPressed] = useState(false);
        const onPress = () => {
            setPressed(!pressed);
        }

        var btnStyle = { style: pressed ? styles.itemPressed : styles.item}

        return (
            <TouchableOpacity {...btnStyle} onPress={onPress}>
                <Text style={[{color: pressed ? '#FFFFFF' : '#000000'}]}>{option}</Text>
            </TouchableOpacity>
        );
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

            {/* Temporary buttons for dropdown menu */}
            <View style={{ padding: 20 }}/>
            <Option option='Piece'/>
            <Option option='Measurement'/>
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
        width: 35,
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 10,
    },
    itemPressed: {
        backgroundColor: '#000000',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 4,
    }
})

export default Quantity