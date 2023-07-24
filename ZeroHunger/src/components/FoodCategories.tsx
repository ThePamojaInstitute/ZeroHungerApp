import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Pressable } from "react-native";
import styles from "../../styles/components/FoodCategoriesStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";

const FoodCategories = () => {
    //Flatlist data
    const Item = ({ name }) => {
        const [pressed, setPressed] = useState(false)
        const onPress = () => {
            setPressed(!pressed)
        }

        const [yesBtnPressed, setYesBtnPressed] = useState(false)
        const yesBtnOnPress = () => {
            if (noBtnPressed) {
                setYesBtnPressed(!yesBtnPressed)
                setNoBtnPressed(!noBtnPressed)
            }
            else {
                setYesBtnPressed(!yesBtnPressed)
            }
        }

        const [noBtnPressed, setNoBtnPressed] = useState(false)
        const noBtnOnPress = () => {
            if (yesBtnPressed) {
                setYesBtnPressed(!yesBtnPressed)
                setNoBtnPressed(!noBtnPressed)
            }
            else {
                setNoBtnPressed(!noBtnPressed)
            }
        }

        var btnStyle = { style: pressed ? styles.btnPressed : styles.btn }

        if (name == 'Meat / Poultry' && pressed) {
            return (
                <View>
                    <View style={styles.item}>
                        <TouchableOpacity {...btnStyle} onPress={onPress}>
                            <Text style={[{ color: pressed ? '#FFFFFF' : '#000000' }]}>{name}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.titleText}>Is it Halal? <Text style={{ color: 'red' }}>*</Text></Text>
                    <Text style={styles.descText}>Please indicate if the meat in your food is halal</Text>
                    <View style={styles.btnItem}>
                        <Text style={{ fontSize: 24, marginRight: 18, }}>Yes</Text>
                        <TouchableOpacity
                            style={[{ backgroundColor: yesBtnPressed ? '#000000' : '#FFFFFF' }, styles.halalBtn]}

                            onPress={yesBtnOnPress}>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 8 }}></View>
                    <View style={styles.btnItem}>
                        <Text style={{ fontSize: 24, marginRight: 26, }}>No</Text>
                        <TouchableOpacity
                            style={[{ backgroundColor: noBtnPressed ? '#000000' : '#FFFFFF' }, styles.halalBtn]}
                            onPress={noBtnOnPress}>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.item}>
                <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: pressed ? Colors.primaryMid : Colors.primaryLight }]} onPress={onPress}>
                    <Text style={[styles.secondaryBtnLabel]}>{name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //Food categories placeholder
    const foods = [
        { name: 'Fruits' },
        { name: 'Vegetables' },
        { name: 'Grains' },
        { name: 'Dairy' },
        { name: 'Dairy Alternatives' },
        { name: 'Meat / Poultry' },
        { name: 'Legumes' },
        { name: 'Food8' },
        { name: 'Food9' },
        { name: 'Food10' },
    ]

    const renderItem = ({ item }) => (
        <View>
            <Item name={item.name} />
        </View>
    );

    return (
        <View testID="FoodCategories.container">
            <FlatList
                testID="FoodCategories.list"
                data={foods}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                horizontal
            />
        </View>
    )
}

export default FoodCategories
