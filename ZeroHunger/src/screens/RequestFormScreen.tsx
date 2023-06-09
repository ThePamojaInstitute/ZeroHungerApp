import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import FoodCategories from "../components/FoodCategories";
import Quantity from "../components/Quantity";
import { createPost } from "../controllers/post";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";

export const RequestFormScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()

    const [title, setTitle] = useState("")
    const [images, setImages] = useState("https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600")
    const [desc, setDesc] = useState("")

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
                    <Text testID="createPost.Button" onPress={handlePress} style={{ color: 'blue', fontSize: 18, }}>Post</Text>
                </TouchableOpacity>
            )
        })
    }, [title, images, desc])

    const handlePress = async (e: GestureResponderEvent) => {
        e.preventDefault()
        if (!user || !user['user_id']) {
            alert!({ type: 'open', message: 'You are not logged in!', alertType: 'error' })
            navigation.navigate('LoginScreen')
            return
        }

        try {
            createPost({
                title: title,
                images: images,
                postedBy: user['user_id'],
                postedOn: Math.floor(new Date().getTime() / 1000), // converts time to unix timestamp
                description: desc,
                postType: 'r'
            }).then(res => {
                if (res.msg === "success") {
                    alert!({ type: 'open', message: 'Request posted successfully!', alertType: 'success' })
                    navigation.navigate('LandingPageScreenTemp')
                } else if (res.msg === "failure") {
                    alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
                } else {
                    alert!({ type: 'open', message: res.msg ? res.msg : 'An error occured!', alertType: 'error' })
                }
            })
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text testID="reqTitle" style={styles.titleText}>Title <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Create a descriptive title for your request</Text>
            </View>
            <View style={styles.titleInputView}>
                <TextInput
                    // value={title}
                    nativeID="title"
                    testID="reqTitleInput"
                    placeholder="Enter name of request"
                    placeholderTextColor="#000000"
                    style={styles.inputText}
                    onChangeText={setTitle}
                    maxLength={100}
                />
            </View>
            <View>
                <Text style={styles.titleText}>Photo</Text>
                <Text style={styles.descText}>Optional: Add photo(s) to help community members understand what you are looking for!</Text>
            </View>
            <ImagePicker setImages={setImages} />
            <View>
                <Text style={styles.titleText}>Food Category Type <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Please select all the food category type that applies</Text>
                <FoodCategories />
            </View>
            <View>
                <Text style={styles.titleText}>Quantity <Text style={{ color: 'red' }}>*</Text></Text>
                <Text style={styles.descText}>Please input the desired quantity of the food item you need</Text>
                <Quantity />
            </View>
            <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View>
            <View>
                <Text style={styles.titleText}>Description</Text>
                <Text style={styles.descText}>Optional: Describe your food request in detail</Text>
            </View>
            <View style={styles.descriptionInputView}>
                <TextInput
                    // value={description}
                    nativeID="desc"
                    testID="reqDescInput"
                    placeholder="Enter Description"
                    placeholderTextColor="#000000"
                    style={styles.inputText}
                    multiline={true}
                    onChangeText={setDesc}
                    maxLength={1024}
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
        fontWeight: 'bold',
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