import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/screens/postFormStyleSheet"
import { ScrollView, TextInput, TouchableOpacity, Text, View, GestureResponderEvent } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import Quantity from "../components/Quantity";
import { DIETPREFERENCES, FOODCATEGORIES, createPost, getCategory, getDiet } from "../controllers/post";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { handleImageUpload } from "../controllers/post";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import Logistics from "../components/Logistics";
import AccessNeeds from "../components/AccessNeeds";
import { intitializePreferences } from "../controllers/preferences";
import FoodFilters from "../components/FoodFilters";
import { useTranslation } from "react-i18next";

export const RequestFormScreen = ({ navigation }) => {
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
        intitializePreferences(accessToken, setAccessNeeds, setLogistics, setPostalCode, setDiet)
    }, [])

    const [title, setTitle] = useState("")
    const [images, setImages] = useState([])
    const [desc, setDesc] = useState("")
    const [titleErr, setTitleErr] = useState("")
    const [categoryErr, setCategoryErr] = useState("")
    const [postalErr, setPostalErr] = useState("")
    const [loading, setLoading] = useState(false)
    const [logistics, setLogistics] = useState<number[]>([])
    const [postalCode, setPostalCode] = useState('')
    const [accessNeeds, setAccessNeeds] = useState<number>()
    const [categories, setCategories] = useState<number[]>([])
    const [diet, setDiet] = useState<number[]>([])
    const {t, i18n} = useTranslation();

    useEffect(() => {
        if (!loaded) return
        navigation.setOptions({
            title:t("request.form.heading"),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: Colors.Background
            },
            headerLeft: () => (
                <TouchableOpacity testID="Request.cancelBtn" onPress={() => navigation.navigate('HomeScreen')}>
                    <Text testID="Request.cancelBtnLabel" style={styles.formCancelBtn}> {t("app.strings.cancel")} </Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handlePress} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
                    <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}> {t("app.post.label")} </Text>
                </TouchableOpacity>
            )
        })
    }, [title, images, desc, loading, loaded, logistics, postalCode, accessNeeds, categories, diet])

    useEffect(() => {
        setCategoryErr('')
    }, [categories])

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
                        categories: categories,
                        diet: diet,
                    },
                    postType: 'r'
                }).then(res => {
                    if (res.msg === "success") {
                        alert!({ type: 'open', message: 'Request posted successfully!', alertType: 'success' })
                        navigation.navigate('HomeScreen')
                    } else if (res.msg === "failure") {
                        alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
                    } else {
                        // setErrMsg(res.msg ? res.msg : 'An error occured!')
                        if (res.msg.toLowerCase().includes('title')) {
                            setTitleErr(res.msg)
                        } else if (res.msg.toLowerCase().includes('category')) {
                            setCategoryErr(res.msg)
                        } else if (res.msg.toLowerCase().includes('postal')) {
                            setPostalErr(res.msg)
                        } else {
                            alert!({ type: 'open', message: res.msg ? res.msg : 'An error occured!', alertType: 'error' })
                        }
                    }
                }).finally(() => setLoading(false))
            })

        } catch (error) {
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }
    }

    return (
        <ScrollView testID="Request.formContainer" style={styles.formContainer}>
            {(!loaded || loading) && <Text> {t("app.strings.loading")} </Text>}
            {loaded &&
                <>
                    <View>
                        <Text
                            testID="Request.titleLabel"
                            style={[styles.formTitleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}
                        > {t("request.form.fields.0.label")} <Text style={{ color: Colors.alert2 }}> * </Text>
                        </Text>
                        <Text testID="Request.titleDesc" style={styles.formDescText}>{t("request.form.fields.0.desc")}</Text>
                    </View>
                    <View testID="Request.formInputContainer" style={styles.formInputContainer}>
                        <TextInput
                            value={title}
                            nativeID="title"
                            testID="Request.titleInput"
                            placeholder="Enter name of food"
                            placeholderTextColor="#656565"
                            style={[styles.formInput, { borderColor: titleErr ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={newText => {
                                setTitle(newText)
                                setTitleErr("")
                            }}
                            onChange={() => setTitleErr("")}
                            maxLength={100}
                        />
                    </View>
                    {titleErr && <Text testID="Request.titleErrMsg" style={styles.formErrorMsg}>{titleErr}</Text>}
                    <View>
                        <Text testID="Request.photoLabel" style={styles.formTitleText}> {t("request.form.fields.1.label")} </Text>
                        <Text testID="Request.photoDesc" style={styles.formDescText}>{t("request.form.fields.1.desc")} </Text>
                    </View>
                    <ImagePicker images={images} setImages={setImages} />
                        <Text testID="Request.categoryLabel" style={styles.formTitleText}>{t("request.form.fields.3.label")}  <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Request.categoryDesc" style={styles.formDescText}>{t("request.form.fields.3.desc")} </Text>
                        <FoodFilters state={categories} setState={setCategories} foodType={FOODCATEGORIES} getType={getCategory} />
                    <View>
                    </View>
                    <View>
                        <Text testID="Request.categoryLabel" style={styles.formTitleText}>Dietary preferences</Text>
                        <Text testID="Request.categoryDesc" style={styles.formDescText}>Please indicate any dietary preferences or allergies that need to be respected in your request.</Text>
                        <FoodFilters state={diet} setState={setDiet} foodType={DIETPREFERENCES} getType={getDiet} />
                    </View>
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Request.quantityLabel" style={styles.formTitleText}> {t("request.form.fields.5.label")}  <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Request.quantityDesc" style={styles.formDescText}>{t("request.form.fields.5.desc")} </Text>
                        <Quantity />
                    </View>
                    <View style={{ opacity: 0.5 }}>
                        <Text testID="Request.dateLabel" style={styles.formTitleText}>{t("request.form.fields.6.label")}</Text>
                        <Text testID="Request.dateDesc" style={styles.formDescText}>
                            <Text style={{ fontFamily: 'PublicSans_600SemiBold', color: '#646464' }}> {t("request.form.fields.6.desc")}</Text>
                        </Text>
                        <DatePicker />
                    </View>
                    <View>
                        <Text testID="Request.deliveryPreferencesLabel" style={styles.formTitleText}> {t("request.form.fields.7.label")}</Text>
                        <Text testID="Request.deliveryPreferencesDesc" style={styles.formDescText}>{t("request.form.fields.7.desc")}</Text>
                        <Logistics logistics={logistics} setLogistics={setLogistics} />
                    </View>
                    <View>
                        <Text testID="Request.locationLabel" style={styles.formTitleText}> {t("request.form.fields.8.label")} </Text>
                        <Text testID="Request.locationDesc" style={styles.formDescText}>{t("request.form.fields.8.desc")}</Text>
                        <View testID="Request.formInputContainer" style={styles.formInputContainer}>
                            <TextInput
                                value={postalCode}
                                nativeID="postalCode"
                                testID="Request.postalCodeInput"
                                placeholder="XXX XXX"
                                placeholderTextColor="#656565"
                                style={[styles.formInput, { borderColor: postalErr ? Colors.alert2 : Colors.midLight }]}
                                onChangeText={newText => {
                                    setPostalCode(newText)
                                    setPostalErr("")
                                }}
                                onChange={() => setPostalErr("")}
                                maxLength={7}
                            />
                        </View>
                    </View>
                    {postalErr && <Text testID="Request.titleErrMsg" style={styles.formErrorMsg}>{postalErr}</Text>}
                    <View>
                        <Text testID="Request.accessLabel" style={styles.formTitleText}>{t("request.form.fields.9.label")}</Text>
                        <Text testID="Request.accessDesc" style={styles.formDescText}>{t("request.form.fields.9.desc")}</Text>
                        <AccessNeeds accessNeeds={accessNeeds} setAccessNeeds={setAccessNeeds} />
                    </View>
                    <View>
                        <Text testID="Request.descTitle" style={styles.formTitleText}> {t("request.form.fields.2.label")} </Text>
                        <Text testID="Request.descDesc" style={styles.formDescText}> {t("request.form.fields.2.desc")} </Text>
                    </View>
                    <View style={styles.formDescInputView}>
                        <TextInput
                            value={desc}
                            nativeID="desc"
                            testID="Request.descInput"
                            placeholder="Enter Description"
                            placeholderTextColor="#656565"
                            style={styles.formInputText}
                            multiline={true}
                            onChangeText={newText => {
                                setDesc(newText)
                            }}
                            maxLength={1024}
                        />
                    </View>
                </>
            }
        </ScrollView>
    )
}
export default RequestFormScreen
