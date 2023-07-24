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
import { axiosInstance } from "../../config";
import { handleImageUpload } from "../controllers/post";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import Logistics from "../components/Logistics";
import AccessNeeds from "../components/AccessNeeds";
import { useTranslation } from "react-i18next";

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
    const [images, setImages] = useState([])
    const [desc, setDesc] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [logistics, setLogistics] = useState<number[]>([])
    const [postalCode, setPostalCode] = useState('')
    const [accessNeeds, setAccessNeeds] = useState<number>()
    const {t, i18n} = useTranslation();


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
                    <Text testID="Offer.cancelBtnLabel" style={styles.formCancelBtn}> {t("app.strings.cancel")} </Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity testID="Offer.createBtn" onPress={handlePress} style={globalStyles.navDefaultBtn}>
                    <Text testID="Offer.createBtnLabel" style={globalStyles.defaultBtnLabel}>  {t("app.post.label")} </Text>
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
            {(!loaded || loading) && <Text> {t("app.strings.loading")} </Text>}
            {loaded &&
                <>
                    <View>
                        <Text
                            testID="Offer.titleLabel"
                            style={[styles.formTitleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}
                        > {t("offer.form.fields.0.label")} <Text style={{ color: Colors.alert2 }}>*</Text>
                        </Text>
                        <Text testID="Offer.titleDesc" style={styles.formDescText}>{t("offer.form.fields.0.desc")}</Text>
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
                        <Text testID="Offer.photoLabel" style={styles.formTitleText}>{t("offer.form.fields.1.label")}</Text>
                        <Text testID="Offer.photoDesc" style={styles.formDescText}> {t("offer.form.fields.1.desc")}</Text>
                    </View>
                    <ImagePicker images={images} setImages={setImages} />
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Offer.categoryLabel" style={styles.formTitleText}> {t("offer.form.fields.3.label")} <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.categoryDesc" style={styles.formDescText}>{t("offer.form.fields.3.desc")}</Text>
                        <FoodCategories />
                    </View>
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Offer.quantityLabel" style={styles.formTitleText}> {t("offer.form.fields.5.label")}  <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Offer.quantityDesc" style={styles.formDescText}>{t("offer.form.fields.5.desc")}</Text>
                        <Quantity />
                    </View>
                    {/* <View>
                <Text style={styles.titleText}>Need By Date</Text>
                <Text style={styles.descText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                <DatePicker />
            </View> */}
                    <View>
                        <Text testID="Request.deliveryPreferenceLabel" style={styles.formTitleText}> {t("offer.form.fields.6.label")}</Text>
                        <Text testID="Request.deliveryPreferenceDesc" style={styles.formDescText}>{t("offer.form.fields.6.label")}</Text>
                        <Logistics logistics={logistics} setLogistics={setLogistics} />
                    </View>
                    <View>
                        <Text testID="Request.locationLabel" style={styles.formTitleText}>{t("offer.form.fields.7.label")}</Text>
                        <Text testID="Request.locationDesc" style={styles.formDescText}>{t("offer.form.fields.7.desc")}</Text>
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
                        <Text testID="Request.accessLabel" style={styles.formTitleText}>{t("offer.form.fields.8.label")}</Text>
                        <Text testID="Request.accessDesc" style={styles.formDescText}>{t("offer.form.fields.8.desc")}</Text>
                        <AccessNeeds accessNeeds={accessNeeds} setAccessNeeds={setAccessNeeds} />
                    </View>
                    <View>
                        <Text testID="Offer.descTitle" style={styles.formTitleText}>{t("offer.form.fields.2.label")}</Text>
                        <Text testID="Offer.descDesc" style={styles.formDescText}>{t("offer.form.fields.2.label")}</Text>
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
