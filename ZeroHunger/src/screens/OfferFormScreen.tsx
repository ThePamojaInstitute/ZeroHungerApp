import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, Text, View, GestureResponderEvent } from "react-native";
import styles from "../../styles/screens/postFormStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import FoodCategories from "../components/FoodCategories";
import Quantity from "../components/Quantity";
import { createPost } from "../controllers/post";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { handleImageUpload } from "../controllers/post";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import Logistics from "../components/Logistics";
import AccessNeeds from "../components/AccessNeeds";
import { intitializePreferences } from "../controllers/preferences";

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

    const { user, accessToken } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()

    useEffect(() => {
        intitializePreferences(accessToken, setAccessNeeds, setLogistics, setPostalCode)
    }, [])

    const [title, setTitle] = useState("")
    const [images, setImages] = useState([])
    const [desc, setDesc] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [logistics, setLogistics] = useState<number[]>([])
    const [postalCode, setPostalCode] = useState('')
    const [accessNeeds, setAccessNeeds] = useState<number>()

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
                    <Text testID="Offer.cancelBtnLabel" style={styles.formCancelBtn}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity testID="Offer.createBtn" onPress={handlePress} style={globalStyles.navDefaultBtn}>
                    <Text testID="Offer.createBtnLabel" style={globalStyles.defaultBtnLabel}>Post</Text>
                </TouchableOpacity>
            )
        })
    }, [title, images, desc, loading, loaded, logistics, postalCode, accessNeeds])

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
            handleImageUpload(images).then(imageURL => {
                createPost({
                    postData: {
                        title: title,
                        images: imageURL,
                        postedBy: user['user_id'],
                        description: desc,
                        logistics: logistics,
                        postalCode: postalCode,
                        accessNeeds: accessNeeds,
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
            })

        } catch (error) {
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }
    }

    return (
        <ScrollView testID="Offer.formContainer" style={styles.formContainer}>
            {(!loaded || loading) && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View>
                        <Text
                            testID="Offer.titleLabel"
                            style={[styles.formTitleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}
                        >Title <Text style={{ color: Colors.alert2 }}>*</Text>
                        </Text>
                        <Text testID="Offer.titleDesc" style={styles.formDescText}>Create a descriptive title for your offering.</Text>
                    </View>
                    <View testID="Offer.formInputContainer" style={styles.formInputContainer}>
                        <TextInput
                            value={title}
                            nativeID="title"
                            testID="Offer.titleInput"
                            placeholder="Enter name of food offering"
                            placeholderTextColor="#656565"
                            style={[styles.formInput, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={newText => {
                                setTitle(newText)
                                setErrMsg("")
                            }}
                            onChange={() => setErrMsg("")}
                            maxLength={100}
                        />
                    </View>
                    {errMsg && <Text testID="Offer.titleErrMsg" style={styles.formErrorMsg}>{errMsg}</Text>}
                    <View>
                        <Text testID="Offer.photoLabel" style={styles.formTitleText}>Photo</Text>
                        <Text testID="Offer.photoDesc" style={styles.formDescText}>Add photo(s) to help community members understand what you are offering.</Text>
                    </View>
                    <ImagePicker images={images} setImages={setImages} />
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Offer.categoryLabel" style={styles.formTitleText}>Food Category Type <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.categoryDesc" style={styles.formDescText}>Please select all the food categories that apply.</Text>
                        <FoodCategories />
                    </View>
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Offer.quantityLabel" style={styles.formTitleText}>Quantity <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.quantityDesc" style={styles.formDescText}>Please input the quantity of the food you are offering.</Text>
                        <Quantity />
                    </View>
                    {/* <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View> */}
                    <View>
                        <Text testID="Request.dateLabel" style={styles.formTitleText}>Pick up or delivery preferences</Text>
                        <Text testID="Request.dateDesc" style={styles.formDescText}>Select all that apply.</Text>
                        <Logistics logistics={logistics} setLogistics={setLogistics} />
                    </View>
                    <View>
                        <Text testID="Request.dateLabel" style={styles.formTitleText}>Pick up or delivery location</Text>
                        <Text testID="Request.dateDesc" style={styles.formDescText}>Please indicate the postal code of your desired pick up or delivery location.</Text>
                        <View testID="Request.formInputContainer" style={styles.formInputContainer}>
                            <TextInput
                                value={postalCode}
                                nativeID="postalCode"
                                testID="Request.postalCodeInput"
                                placeholder="XXX XXX"
                                placeholderTextColor="#656565"
                                style={[styles.formInput, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                                onChangeText={newText => {
                                    setPostalCode(newText)
                                    setErrMsg("")
                                }}
                                onChange={() => setErrMsg("")}
                                maxLength={7}
                            />
                        </View>
                    </View>
                    <View>
                        <Text testID="Request.dateLabel" style={styles.formTitleText}>Access needs for pick up or delivery</Text>
                        <Text testID="Request.dateDesc" style={styles.formDescText}>Please indicate if you have any access needs for sharing the food you are offering.</Text>
                        <AccessNeeds accessNeeds={accessNeeds} setAccessNeeds={setAccessNeeds} />
                    </View>
                    <View>
                        <Text testID="Offer.descTitle" style={styles.formTitleText}>Description</Text>
                        <Text testID="Offer.descDesc" style={styles.formDescText}>Describe your offer in detail.</Text>
                    </View>
                    <View style={styles.formDescInputView}>
                        <TextInput
                            value={desc}
                            nativeID="desc"
                            testID="Offer.descInput"
                            placeholder="Enter Description"
                            placeholderTextColor="#656565"
                            style={styles.formInputText}
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
