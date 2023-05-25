import React from "react";
import { ScrollView, TextInput } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import FoodCategories from "../components/FoodCategories";
import Quantity from "../components/Quantity";

export const RequestFormScreen = ({ navigation }) => {

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.titleText}>Title <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Create a descriptive title for the food you are offering</Text>
            </View>
            <View style={styles.titleInputView}>
                <TextInput
                    // value={title}
                    placeholder="Enter name of food offering"
                    placeholderTextColor="#000000"
                    style={styles.inputText}
                />
            </View>
            <View>
                <Text style={styles.titleText}>Photo</Text>
                <Text style={styles.descText}>Optional: Add photo(s) to help community members understand what you are sharing</Text>
            </View>
            <ImagePicker />
            <View>
                <Text style={styles.titleText}>Food Category Type <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Please select all the food category type that applies</Text>
                <FoodCategories />
            </View>
            <View>
                <Text style={styles.titleText}>Quantity <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Please input the quantity of the food you are giving away</Text>
                <Quantity />
            </View>
            <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View>
            <View>
                <Text style={styles.titleText}>Description</Text>
                <Text style={styles.descText}>Optional: Describe your offer in detail</Text>
            </View>
            <View style={styles.descriptionInputView}>
                <TextInput
                    // value={description}
                    placeholder="Enter Description"
                    placeholderTextColor="#000000"
                    style={styles.inputText}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    titleText: {
        flex: 1,
        fontSize: 24,
        marginBottom: 5,
        marginTop: 10,
    },
    descText: {
        flex: 1,
        fontSize: 14,
        marginBottom: 5,
        color: "#000000"
    },
    titleInputView: {
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginBottom: 25,
        marginTop: 10,
    },
    descriptionInputView: {
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "100%",
        height: 100,
        marginBottom: 25,
        marginTop: 10,
    },
    inputText: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        fontSize: 15,
        textAlignVertical: "top",
    }
})