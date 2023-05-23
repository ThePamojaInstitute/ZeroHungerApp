import { FlatList, StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import { useState } from "react";

const FoodCategories = () => {
    //Flatlist data
    const Item = ({ name }) => {
        return (
            <View style={styles.item}>
                <TouchableOpacity>
                    <Text style={{ textAlign: 'center' }}>{name}</Text>
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
        <Item name={item.name} />
    );

    return (
        <View>
            <FlatList
                data={foods}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                horizontal
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 10,
    },
})

export default FoodCategories