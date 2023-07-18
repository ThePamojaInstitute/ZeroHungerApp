import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/screens/postFormStyleSheet"
import { ScrollView, TextInput, TouchableOpacity, Text, View, GestureResponderEvent } from "react-native";
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
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { axiosInstance } from "../../config";

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

    const { user } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()

    const [title, setTitle] = useState("")
    const [images, setImages] = useState([])
    const [imgStr, setImageStrs] = useState("")
    const [desc, setDesc] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!loaded) return
        navigation.setOptions({
            title: "Request Food",
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: Colors.Background
            },
            headerLeft: () => (
                <TouchableOpacity testID="Request.cancelBtn" onPress={() => navigation.navigate('HomeScreen')}>
                    <Text testID="Request.cancelBtnLabel" style={styles.formCancelBtn}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={handlePress} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
                    <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}>Post</Text>
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
            handleImageUpload(images).then(imageURL => {
                console.log(imageURL);

                createPost({
                    postData: {
                        title: title,
                        images: imageURL,
                        postedBy: user['user_id'],
                        description: desc,
                    },
                    postType: 'r'
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


    //https://stackoverflow.com/questions/42521679/how-can-i-upload-a-photo-with-expo
    // function handleImageUpload()
    // { //test function for image uploads

    //     imageString = imageString.substring(imageString.indexOf(",") + 1);
    //     axiosInstance.post("posts/testBlobImage", { "IMAGE":imageString}).then((response) => {
    //      return (response.data).toString()
    //      })
    //    //  return "FailedUpload"
    // }


    return (
        <ScrollView testID="Request.formContainer" style={styles.formContainer}>
            {(!loaded || loading) && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View>
                        <Text
                            testID="Request.titleLabel"
                            style={[styles.formTitleText, { color: errMsg ? Colors.alert2 : Colors.dark }]}
                        >Title <Text style={{ color: Colors.alert2 }}>*</Text>
                        </Text>
                        <Text testID="Request.titleDesc" style={styles.formDescText}>Create a descriptive title for your request</Text>
                    </View>
                    <View testID="Request.formInputContainer" style={styles.formInputContainer}>
                        <TextInput
                            value={title}
                            nativeID="title"
                            testID="Request.titleInput"
                            placeholder="Enter name of food"
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
                    {errMsg && <Text testID="Request.titleErrMsg" style={styles.formErrorMsg}>{errMsg}</Text>}
                    <View>
                        <Text testID="Request.photoLabel" style={styles.formTitleText}>Photo</Text>
                        <Text testID="Request.photoDesc" style={styles.formDescText}>Optional: Add photo(s) to help community members understand what you are looking for!</Text>
                    </View>
                    <ImagePicker images={images} setImages={setImages} />
                    <View>
                        <Text testID="Request.categoryLabel" style={styles.formTitleText}>Food Category Type <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Request.categoryDesc" style={styles.formDescText}>Please select all the food category type that applies</Text>
                        <FoodCategories />
                    </View>
                    <View>
                        <Text testID="Request.quantityLabel" style={styles.formTitleText}>Quantity <Text style={{ color: Colors.alert2 }}>*</Text></Text>
                        <Text testID="Request.quantityDesc" style={styles.formDescText}>Please input the desired quantity of the food item you need</Text>
                        <Quantity />
                    </View>
                    <View>
                        <Text testID="Request.dateLabel" style={styles.formTitleText}>Need By Date</Text>
                        <Text testID="Request.dateDesc" style={styles.formDescText}>Optional: Please select a date you would need this item by. Your post will expire at the end of this date.</Text>
                        <DatePicker />
                    </View>
                    <View>
                        <Text testID="Request.descTitle" style={styles.formTitleText}>Description</Text>
                        <Text testID="Request.descDesc" style={styles.formDescText}>Optional: Describe your food request in detail</Text>
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
export default RequestFormScreen
