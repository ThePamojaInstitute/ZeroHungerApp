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
        if (!loaded) return
        navigation.setOptions({
            title: "Offer Food",
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: Colors.Background
            },
            headerLeft: () => (
                <TouchableOpacity testID="Offer.cancelBtn" onPress={() => navigation.navigate('HomeScreen')}>
                    <Text testID="Offer.cancelBtnLabel" style={globalStyles.formCancelBtn}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity testID="Offer.createBtn" onPress={handlePress} style={globalStyles.navDefaultBtn}>
                    <Text testID="Offer.createBtnLabel" style={globalStyles.defaultBtnLabel}>Post</Text>
                </TouchableOpacity>
            )
        })
    }, [title, images, desc, loading, loaded])

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
                    alert!({ type: 'open', message: 'Offer posted successfully!', alertType: 'success' })
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
        <ScrollView testID="Offer.formContainer" style={globalStyles.formContainer}>
            {(!loaded || loading) && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View>
                        <Text testID="Offer.titleLabel" style={[globalStyles.formTitleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}>Title <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.titleDesc" style={globalStyles.formDescText}>Create a descriptive title for the food you are offering</Text>
                    </View>
                    <View testID="Offer.formInputContainer" style={globalStyles.formInputContainer}>
                        <TextInput
                            value={title}
                            nativeID="title"
                            testID="Offer.titleInput"
                            placeholder="Enter name of food offering"
                            placeholderTextColor="#656565"
                            style={[globalStyles.formInput, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={newText => {
                                setTitle(newText)
                                setErrMsg("")
                            }}
                            onChange={() => setErrMsg("")}
                            maxLength={100}
                        />
                    </View>
                    {errMsg && <Text testID="Offer.titleErrMsg" style={globalStyles.formErrorMsg}>{errMsg}</Text>}
                    <View>
                        <Text testID="Offer.photoLabel" style={globalStyles.formTitleText}>Photo</Text>
                        <Text testID="Offer.photoDesc" style={globalStyles.formDescText}>Optional: Add photo(s) to help community members understand what you are sharing</Text>
                    </View>
                    <ImagePicker setImages={setImages} />
                    <View>
                        <Text testID="Offer.categoryLabel" style={globalStyles.formTitleText}>Food Category Type <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.categoryDesc" style={globalStyles.formDescText}>Please select all the food category type that applies</Text>
                        <FoodCategories />
                    </View>
                    <View>
                        <Text testID="Offer.quantityLabel" style={globalStyles.formTitleText}>Quantity <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.quantityDesc" style={globalStyles.formDescText}>Please input the quantity of the food you are giving away</Text>
                        <Quantity />
                    </View>
                    {/* <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View> */}
                    <View>
                        <Text testID="Offer.descTitle" style={globalStyles.formTitleText}>Description</Text>
                        <Text testID="Offer.descDesc" style={globalStyles.formDescText}>Optional: Describe your offer in detail</Text>
                    </View>
                    <View style={globalStyles.formDescInputView}>
                        <TextInput
                            value={desc}
                            nativeID="desc"
                            testID="Offer.descInput"
                            placeholder="Enter Description"
                            placeholderTextColor="#656565"
                            style={globalStyles.formInputText}
                            multiline={true}
                            onChangeText={newText => {
                                setDesc(newText)
                                setErrMsg("")
                            }}
                            maxLength={1024}
                        />
                    </View>
                </>
            }
        </ScrollView>
    )
}

export default OfferFormScreen
