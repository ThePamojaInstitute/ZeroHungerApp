import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Colors, Fonts, globalStyles } from '../../styles/globalStyleSheet';
import { useContext, useState, useEffect, useReducer } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import styles from '../../styles/screens/termsAndConditionsStyleSheet'
import Swiper from 'react-native-web-swiper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

type Props = {
    index?: number,
    activeIndex?: number,
}

let accepted
let err

const FinalSlide = ({ navigation }) => {
    const [isAccepted, setIsAccepted] = useState(false)
    accepted = isAccepted
    const [errMsg, setErrMsg] = useState('')
    err = setErrMsg

    // const handleSignUp = () => {
    //     if (!isAccepted) {
    //         setErrMsg("Please accept terms and conditions")
    //         return
    //     }

    //     navigation.navigate("PermissionsScreen")
    // }
    
    return (
    <View style={styles.view}>
        <Text style={globalStyles.H1}>{"Your Rights"}</Text>
        <View style={styles.textView}>
            <Text style={globalStyles.H2}>{"Request your data"}</Text>
            <Text style={styles.text}>
                {'Lorem ipsum dolor sit amet consectetur. Neque in metus leo semper nibh odio. Lorem varius porttitor nisi purus ac ultrices urna magna.'}
            </Text>
        </View>
        <View style={styles.textView}>
            <Text style={globalStyles.H2}>{"Delete your data"}</Text>
            <Text style={styles.text}>
                {'You can delete your data at any time by...lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
            </Text>
        </View>

        <View style={styles.termsAndCondContainer}>
            <Text style={[styles.inputLabel,
            { color: errMsg ? Colors.alert2 : Colors.dark }]}>Terms and Conditions</Text>
            <Text style={styles.termsAndCondText}>Read our full <Text style={{ textDecorationLine: 'underline' }}
                onPress={() => console.log("terms and conditions")}
            >terms and conditions.</Text></Text>
            {errMsg && <Text
                style={{
                    fontFamily: Fonts.PublicSans_Regular,
                    fontWeight: '400',
                    fontSize: 13,
                    color: Colors.alert2
                }}>{errMsg}
            </Text>}
            <View style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcons name={isAccepted ? "checkbox-marked" : "checkbox-blank-outline"} size={22}
                    onPress={() => {
                        setErrMsg('')
                        setIsAccepted(!isAccepted)
                    }} />
                <Text style={styles.termsAndCondAcceptText}>{"I accept"}</Text>
            </View>
        </View>

    </View>
)}

export const GuidelinesScreen = ({ navigation }, props: Props) => {
    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        })
    })

    const { user } = useContext(AuthContext)
    const { t, i18n } = useTranslation();

    useFocusEffect(() => {
        if (user) {
            navigation.navigate('HomeScreen')
        }
    })

    const handleSignUp = () => {
        if (!accepted) {
            err("Please accept terms and conditions")
            return
        }

        navigation.navigate("PermissionsScreen")
    }

    //PLACEHOLDER TEXT
    return (
        <View style={{ height: '100%', backgroundColor: Colors.offWhite }}>
            <View style={[{ height: '100%' }, Platform.OS === 'web' ? styles.alignWidth : {}]}>
                <Swiper
                    controlsProps={{
                        dotsTouchable: true,
                        prevTitle: 'Back',
                        nextTitle: 'Next',
                        prevTitleStyle: styles.backButton,
                        nextTitleStyle: styles.nextButton,
                        dotsWrapperStyle: styles.dots,
                        dotActiveStyle: { backgroundColor: Colors.primary },
                        firstPrevElement:
                            <Text style={[globalStyles.H4, styles.backButton, { opacity: 0.5 }]}>
                                Back
                            </Text>,
                        lastNextElement:
                            <TouchableOpacity
                                style={[styles.defaultBtn]}
                                onPress={handleSignUp}
                            >
                                <Text style={globalStyles.defaultBtnLabel}>Create Account</Text>
                            </TouchableOpacity>
                    }}
                >
                    <View style={styles.view}>
                        <Text style={globalStyles.H1}>{"Your Data"}</Text>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"What we collect"}</Text>
                            <Text style={styles.text}>
                                {'\u2022 Email address for account creation and verification'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Postal code for...'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Analytics for ...ipsum dolor sit amet.'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Device data for ...ipsum dolor sit amet.'}
                            </Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"Where your data is stored"}</Text>
                            <Text style={styles.text}>
                                {'Your data is stored by XYZ Company with servers located in XYZ Location.'}
                            </Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"How we use your information"}</Text>
                            <Text style={styles.text}>
                                {'Lorem ipsum dolor sit amet consectetur. Enim tincidunt senectus tincidunt rhoncus feugiat. Facilisis ut pulvinar sed sit aliquet euismod. '}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.view}>
                        <Text style={globalStyles.H1}>{"Your Safety"}</Text>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"What we collect"}</Text>
                            <Text style={styles.text}>
                                {'\u2022 Email address for account creation and verification'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Postal code for...'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Analytics for ...ipsum dolor sit amet.'}
                            </Text>
                            <Text style={styles.text}>
                                {'\u2022 Device data for ...ipsum dolor sit amet.'}
                            </Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"Where your data is stored"}</Text>
                            <Text style={styles.text}>
                                {'Your data is stored by XYZ Company with servers located in XYZ Location.'}
                            </Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={globalStyles.H2}>{"How we use your information"}</Text>
                            <Text style={styles.text}>
                                {'Lorem ipsum dolor sit amet consectetur. Enim tincidunt senectus tincidunt rhoncus feugiat. Facilisis ut pulvinar sed sit aliquet euismod. '}
                            </Text>
                        </View>
                    </View>

                    <FinalSlide navigation={navigation} />
                    
                </Swiper>
            </View>
        </View>
    )
}

export default GuidelinesScreen