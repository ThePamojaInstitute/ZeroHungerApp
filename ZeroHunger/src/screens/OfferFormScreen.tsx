import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import FoodCategories from "../components/FoodCategories";
import Quantity from "../components/Quantity";
import { createPost } from "../controllers/post";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';

export const OfferFormScreen = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const { user } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()

    const [title, setTitle] = useState("")
    const [images, setImages] = useState("")
    const [desc, setDesc] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            title: "Offer Food",
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: Colors.Background
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={styles.cancelBtn}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={globalStyles.navDefaultBtn}>
                    <Text testID="createPost.Button" onPress={handlePress} style={globalStyles.defaultBtnLabel}>Post</Text>
                </TouchableOpacity>
            )
        })
    }, [title, images, desc, loading])

    const handlePress = async (e: GestureResponderEvent) => {
        e.preventDefault()
        if (!user || !user['user_id']) {
            alert!({ type: 'open', message: 'You are not logged in!', alertType: 'error' })
            navigation.navigate('LoginScreen')
            return
        } else if (loading) {
            return
        }

        setLoading(true)
        try {
            createPost({
                postData: {
                    title: title,
                    images: images,
                    postedBy: user['user_id'],
                    postedOn: Math.floor(new Date().getTime() / 1000), // converts time to unix timestamp
                    description: desc,
                },
                postType: 'o'
            }).then(res => {
                if (res.msg === "success") {
                    alert!({ type: 'open', message: 'Request posted successfully!', alertType: 'success' })
                    navigation.navigate('HomeScreen')
                } else if (res.msg === "failure") {
                    alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
                } else {
                    // alert!({ type: 'open', message: res.msg ? res.msg : 'An error occured!', alertType: 'error' })
                    setErrMsg(res.msg ? res.msg : 'An error occured!')
                }
            }).finally(() => setLoading(false))
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }
    }

    return (
        <ScrollView style={styles.container}>
            {(!loaded || loading) && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View>
                        <Text testID="offerTitle" style={[styles.titleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}>Title <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text style={styles.descText}>Create a descriptive title for the food you are offering</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            // value={title}
                            nativeID="title"
                            testID="offerTitleInput"
                            placeholder="Enter name of food offering"
                            placeholderTextColor="#656565"
                            style={[styles.input, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={setTitle}
                            onChange={() => setErrMsg("")}
                            maxLength={100}
                        />
                    </View>
                    {errMsg && <Text style={styles.errorMsg}>{errMsg}</Text>}
                    <View>
                        <Text style={styles.titleText}>Photo</Text>
                        <Text style={styles.descText}>Optional: Add photo(s) to help community members understand what you are sharing</Text>
                    </View>
                    <ImagePicker setImages={setImages} />
                    <View>
                        <Text style={styles.titleText}>Food Category Type <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text style={styles.descText}>Please select all the food category type that applies</Text>
                        <FoodCategories />
                    </View>
                    <View>
                        <Text style={styles.titleText}>Quantity <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text style={styles.descText}>Please input the quantity of the food you are giving away</Text>
                        <Quantity />
                    </View>
                    {/* <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View> */}
                    <View>
                        <Text style={styles.titleText}>Description</Text>
                        <Text style={styles.descText}>Optional: Describe your offer in detail</Text>
                    </View>
                    <View style={styles.descriptionInputView}>
                        <TextInput
                            // value={description}
                            nativeID="desc"
                            testID="offerDescInput"
                            placeholder="Enter Description"
                            placeholderTextColor="#656565"
                            style={styles.inputText}
                            multiline={true}
                            onChangeText={setDesc}
                            maxLength={1024}
                        />
                    </View>
                </>
            }
        </ScrollView>
    )
}

export default OfferFormScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
        backgroundColor: Colors.Background
    },
    titleText: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 18,
        color: Colors.dark,
        marginBottom: 3
    },
    descText: {
        marginBottom: 5,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: '#656565'
    },
    descriptionInputView: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        width: "100%",
        height: 120,
        marginBottom: 25,
        marginTop: 10,
    },
    inputText: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        fontSize: 16,
        textAlignVertical: "top",
        fontFamily: 'PublicSans_400Regular'
    },
    cancelBtn: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: '#656565'
    },
    Label: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 18,
        color: Colors.dark
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        // width: "90%",
        height: 40,
        marginBottom: 10,
        marginTop: 5,
    },
    input: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: 10,
        gap: 10,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderRadius: 10,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        paddingLeft: 10
    },
    errorMsg: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
        marginBottom: 10
    }
})