import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/screens/postFormStyleSheet"
import { ScrollView, TextInput, TouchableOpacity, Text, View } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"
import Quantity from "../components/Quantity";
import {
    DIETPREFERENCES,
    FOODCATEGORIES,
    createPost,
    getCategory,
    getDiet
} from "../controllers/post";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { handleImageUpload } from "../controllers/post";
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet";
import Logistics from "../components/Logistics";
import { intitializePreferences } from "../controllers/preferences";
import FoodFilters from "../components/FoodFilters";
import { useTranslation } from "react-i18next";
import { Char, PostFromData } from "../../types";
import { useForm, Controller } from "react-hook-form"
import { MaterialCommunityIcons } from "@expo/vector-icons";


export const RequestFormScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()
    const { t, i18n } = useTranslation();
    const {
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
        clearErrors,
    } = useForm<PostFromData>();

    const [imagesURIs, setImagesURIs] = useState([])
    const [base64Images, setBase64Images] = useState([])
    const [desc, setDesc] = useState("")
    const [loading, setLoading] = useState(false)
    const [logistics, setLogistics] = useState<Char[]>([])
    const [defaultPostalCode, setDefaultPostalCode] = useState('')
    const [useDefaultPostal, setUseDefaultPostal] = useState(false)
    const [accessNeeds, setAccessNeeds] = useState('')
    const [categories, setCategories] = useState<Char[]>([])
    const [diet, setDiet] = useState<Char[]>([])
    const [needBy, setNeedBy] = useState<string>()
    const [dataSourceCords, setDataSourceCords] = useState([]);
    const [errField, setErrField] = useState<'' | 'categories' | 'needBy'>("")

    const scrollView = useRef(null)

    const scrollTo = (viewName: string) => {
        scrollView.current.scrollTo({
            x: 0,
            y: dataSourceCords[viewName],
            animated: true,
        })
    }

    useEffect(() => {
        intitializePreferences(setLogistics, setDefaultPostalCode, setDiet)
    }, [])

    useEffect(() => {
        if (errors.title) scrollTo('title')
    }, [errors.title])

    useEffect(() => {
        if (errors.postalCode && !errors.title) {
            scrollTo('postalCode')
        }
    }, [errors.postalCode])


    useEffect(() => {
        navigation.setOptions({
            title: t("request.form.heading"),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: Colors.Background
            },
            headerLeft: () => (
                <TouchableOpacity
                    testID="Request.cancelBtn"
                    onPress={() => navigation.navigate('HomeScreen')}
                >
                    <Text
                        testID="Request.cancelBtnLabel"
                        style={styles.formCancelBtn}
                    >Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        if (useDefaultPostal && !defaultPostalCode) {
                            setError('postalCode', {
                                type: 'validation',
                                message: "You don't have a default postal code. Please enter a valid one"
                            })
                            setUseDefaultPostal(false)
                            return
                        }

                        handleSubmit(handlePress)()
                    }}
                    testID="Request.createBtn"
                    style={globalStyles.navDefaultBtn}
                >
                    <Text
                        testID="Request.createBtnLabel"
                        style={globalStyles.defaultBtnLabel}
                    >Post</Text>
                </TouchableOpacity>
            )
        })
    }, [imagesURIs, base64Images, desc, logistics, defaultPostalCode, useDefaultPostal, accessNeeds, categories, diet, needBy])

    useEffect(() => {
        if (errField === 'categories') {
            setErrField('')
        }
    }, [categories])

    useEffect(() => {
        if (errField === 'needBy') {
            setErrField('')
        }
    }, [needBy])

    useEffect(() => {
        if (useDefaultPostal) {
            setValue('postalCode', defaultPostalCode)
        } else {
            setValue('postalCode', '')
        }
    }, [useDefaultPostal])

    const submitPost = async (data: object) => {
        logistics.sort()
        categories.sort()
        diet.sort()

        const imageURL = await handleImageUpload(base64Images)
        const res = await createPost({
            postData: {
                title: data['title'],
                images: imageURL,
                postedBy: user['user_id'],
                description: desc,
                logistics: logistics,
                postalCode: data['postalCode'],
                accessNeeds: accessNeeds,
                categories: categories,
                diet: diet,
                expiryDate: needBy
            },
            postType: 'r'
        })

        if (res.msg === "success") {
            alert!({ type: 'open', message: 'Request posted successfully!', alertType: 'success' })
            navigation.navigate('HomeScreen')
        } else if (res.msg === "failure") {
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        } else {
            if (res.msg === 'Please enter a valid postal code') {
                setError('postalCode', {
                    type: "server",
                    message: res.msg
                })
            } else {
                alert!({ type: 'open', message: res.msg ? res.msg : 'An error occured!', alertType: 'error' })
            }
        }
    }

    const handlePress = async (data: object) => {
        if (!user || !user['user_id']) {
            alert!({ type: 'open', message: 'You are not logged in!', alertType: 'error' })
            navigation.navigate('LoginScreen')
            return
        } else if (loading) {
            return
        }

        if (categories.length === 0) {
            setErrField('categories')
            scrollTo('categories')
            return
        } else if (!needBy) {
            setErrField('needBy')
            scrollTo('needBy')
            return
        }

        setLoading(true)
        try {
            await submitPost(data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }
    }

    return (
        <ScrollView testID="Request.formContainer" style={styles.formContainer} ref={scrollView}>
            <View>
                <Text
                    testID="Request.titleLabel"
                    style={[styles.formTitleText, { color: errors.title ? Colors.alert2 : Colors.dark }]}
                >Title <Text style={{ color: Colors.alert2 }}>*</Text>
                </Text>
                <Text
                    testID="Request.titleDesc"
                    style={styles.formDescText}
                >Create a descriptive title for your request.</Text>
            </View>
            <View
                testID="Request.formInputContainer"
                style={styles.formInputContainer}
                onLayout={() => {
                    dataSourceCords['title'] = 0;
                    setDataSourceCords(dataSourceCords);
                }}
            >
                <Controller
                    defaultValue=""
                    control={control}
                    rules={{
                        required: "Please enter a title to your request",
                        maxLength: {
                            value: 100,
                            message: "Title should be at most 100 characters"
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            value={value}
                            nativeID="title"
                            testID="Request.titleInput"
                            placeholder="Enter name of food"
                            placeholderTextColor="#656565"
                            style={[styles.formInput,
                            { borderColor: errors.title ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={onChange}
                            onChange={onChange}
                            maxLength={100}
                            onBlur={onBlur}
                        />
                    )}
                    name="title"
                />
            </View>
            {errors.title &&
                <Text testID="Request.titleErrMsg" style={styles.formErrorMsg}>{errors.title.message}</Text>}
            <View>
                <Text testID="Request.photoLabel" style={styles.formTitleText}>Photo</Text>
                <Text
                    testID="Request.photoDesc"
                    style={styles.formDescText}
                >Add photo(s) to help community members understand what you are looking for.</Text>
            </View>
            <ImagePicker imagesURIs={imagesURIs} base64Images={base64Images} setImagesURIs={setImagesURIs} setBase64Images={setBase64Images} />
            <View
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dataSourceCords['categories'] = layout.y;
                    setDataSourceCords(dataSourceCords);
                }}
            >
                <Text
                    testID="Request.categoryLabel"
                    style={[styles.formTitleText, { color: errField === 'categories' ? Colors.alert2 : Colors.dark }]}
                >Food Category Type <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                <Text
                    testID="Request.categoryDesc"
                    style={styles.formDescText}
                >Please select all the food categories that apply.</Text>
                <FoodFilters
                    state={categories}
                    setState={setCategories}
                    foodType={FOODCATEGORIES}
                    getType={getCategory}
                    name={'categories'}
                />
            </View>
            <View>
                <Text
                    testID="Request.categoryLabel"
                    style={styles.formTitleText}
                >Dietary preferences</Text>
                <Text
                    testID="Request.categoryDesc"
                    style={styles.formDescText}
                >Please indicate any dietary preferences or allergies that need to be respected in your request.</Text>
                <FoodFilters
                    state={diet}
                    setState={setDiet}
                    foodType={DIETPREFERENCES}
                    getType={getDiet}
                    name={'diet'}
                />
            </View>
            {/* <View style={{ opacity: 0.5 }}>
                        <Text testID="Request.quantityLabel" style={styles.formTitleText}>Quantity <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Request.quantityDesc" style={styles.formDescText}>Please input the desired quantity of the food item you need.</Text>
                        <Quantity />
                    </View> */}
            <View
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dataSourceCords['needBy'] = layout.y;
                    setDataSourceCords(dataSourceCords);
                }}
            >
                <Text
                    testID="Request.dateLabel"
                    style={[styles.formTitleText, { color: errField === 'needBy' ? Colors.alert2 : Colors.dark }]}
                >Need By Date <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                <Text
                    testID="Request.dateDesc"
                    style={styles.formDescText}
                >Please select a date you would need this item by.
                    <Text
                        style={{ fontFamily: Fonts.PublicSans_SemiBold, fontWeight: '600', color: '#646464' }}
                    > Your post will expire at the end of this date.</Text>
                </Text>
                <DatePicker setNeedBy={setNeedBy} errField={errField} />
            </View>
            <View
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dataSourceCords['postalCode'] = layout.y;
                    setDataSourceCords(dataSourceCords);
                }}
            >
                <Text
                    testID="Request.dateLabel"
                    style={[styles.formTitleText, { color: errors.postalCode ? Colors.alert2 : Colors.dark }]}
                >Pick up or delivery location <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                <Text
                    testID="Request.dateDesc"
                    style={styles.formDescText}
                >Please indicate the postal code of your desired pick up or delivery location. No one else will see your postal code.</Text>
                <View style={styles.choiceContainer}>
                    <MaterialCommunityIcons
                        name={useDefaultPostal ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={22}
                        onPress={() => {
                            clearErrors('postalCode')
                            setUseDefaultPostal(!useDefaultPostal)
                        }}
                        style={styles.icon}
                    />
                    <Text style={globalStyles.Body}>Use my default postal code</Text>
                </View>
                {!useDefaultPostal &&
                    <View
                        testID="Request.formInputContainer"
                        style={[styles.formInputContainer, { marginBottom: 20 }]}
                    >
                        <Controller
                            defaultValue=""
                            control={control}
                            rules={{
                                required: "Please enter a postal code to your request",
                                pattern: {
                                    value: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
                                    message: "Please enter a valid postal code"
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    nativeID="postalCode"
                                    testID="Request.postalCodeInput"
                                    placeholder="XXX XXX"
                                    placeholderTextColor="#656565"
                                    style={[styles.formInput,
                                    { borderColor: errors.postalCode ? Colors.alert2 : Colors.midLight }]}
                                    onChangeText={onChange}
                                    onChange={onChange}
                                    maxLength={7}
                                    onBlur={onBlur}
                                />
                            )}
                            name="postalCode"
                        />
                    </View>
                }
            </View>
            {errors.postalCode &&
                <Text testID="Request.titleErrMsg" style={styles.formErrorMsg}>{errors.postalCode.message}</Text>}
            <View style={{ marginBottom: 10 }}>
                <Text
                    testID="Request.dateLabel"
                    style={styles.formTitleText}
                >Pick up or delivery preferences</Text>
                <Text
                    testID="Request.dateDesc"
                    style={styles.formDescText}
                >Select all that apply.</Text>
                <Logistics logistics={logistics} setLogistics={setLogistics} />
            </View>
            <View>
                <Text testID="Offer.descTitle" style={styles.formTitleText}>Access needs for pick up or delivery</Text>
                <Text testID="Offer.descDesc" style={styles.formDescText}>Please indicate if you have any access needs for receiving your requested food.</Text>
            </View>
            <View style={styles.formDescInputView}>
                <TextInput
                    value={accessNeeds}
                    nativeID="desc"
                    testID="Offer.descInput"
                    placeholder="Enter access needs"
                    placeholderTextColor="#656565"
                    style={styles.formInputText}
                    multiline={true}
                    onChangeText={setAccessNeeds}
                    maxLength={128}
                />
            </View>
            {/* <View
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dataSourceCords['accessNeeds'] = layout.y;
                    setDataSourceCords(dataSourceCords);
                }}
            >
                <Text
                    testID="Request.dateLabel"
                    style={[styles.formTitleText, { color: errField === 'accessNeeds' ? Colors.alert2 : Colors.dark }]}
                >Access needs for pick up or delivery <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                <Text
                    testID="Request.dateDesc"
                    style={styles.formDescText}
                >Please indicate if you have any access needs for receiving your requested food.</Text>
                <AccessNeeds accessNeeds={accessNeeds} setAccessNeeds={setAccessNeeds} postType={"r"} />
            </View> */}
            <View>
                <Text
                    testID="Request.descTitle"
                    style={styles.formTitleText}
                >Description</Text>
                <Text
                    testID="Request.descDesc"
                    style={styles.formDescText}
                >Describe your food request in detail.</Text>
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
                    onChangeText={setDesc}
                    maxLength={1024}
                />
            </View>
        </ScrollView>
    )
}
export default RequestFormScreen
