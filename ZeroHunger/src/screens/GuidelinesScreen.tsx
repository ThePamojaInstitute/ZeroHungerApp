import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState, useEffect } from "react";
import { storage } from "../../config";
import styles from '../../styles/screens/guidelinesStyleSheet'
import Swiper from 'react-native-web-swiper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

type Props = {
    index?: number
    activeIndex?: number
}

export const GuidelinesScreen = ({ navigation }, props: Props) => {
    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        })
    })

    const { t, i18n } = useTranslation();

    return (
        <Swiper 
            controlsProps={{
                dotsTouchable: true,
                prevTitle: 'Back',
                nextTitle: 'Next',
                prevTitleStyle: styles.backButton,
                nextTitleStyle: styles.nextButton,
                dotsWrapperStyle: styles.dots,
                dotActiveStyle: {backgroundColor: Colors.primary},
                firstPrevElement: 
                    <Text style={[globalStyles.H4, styles.backButton, { opacity: 0.5 }]}>
                        Back
                    </Text>,
                lastNextElement: 
                    <View style={styles.continueButton}>
                        <TouchableOpacity 
                            style={[styles.defaultBtn]}
                            onPress={() => {if(!props.activeIndex) navigation.navigate("PermissionsScreen2")}}
                        >
                            <Text style={globalStyles.defaultBtnLabel}>Continue</Text>
                        </TouchableOpacity>
                    </View>
            }}
        >
            <View style={styles.view}>
                <Text style={globalStyles.H1}>{t("guidelines.content.0.heading")}</Text>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.primary} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.0.listCheck.0.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.primary} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.0.listCheck.1.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.primary} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.0.listCheck.2.text")}</Text>
                </View>
            </View>
            <View style={styles.view}>
                {/* TODO: Figure out how to make "won't" red using translation*/}
                {/* <Text style={globalStyles.H1}>{t("guidelines.content.1.heading")}</Text> */}
                <Text style={globalStyles.H1}>I <Text style={{ color: Colors.alert2 }}>won't</Text></Text>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="close-outline" color={Colors.alert2} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.1.listX.0.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="close-outline" color={Colors.alert2} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.1.listX.1.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="close-outline" color={Colors.alert2} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.1.listX.2.text")}</Text>
                </View>
            </View>
            <View style={styles.view}>
            <Text style={globalStyles.H1}>{t("guidelines.content.2.heading")}</Text>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.dark} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.2.listCheck.0.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.dark} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.2.listCheck.1.text")}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons style={styles.icon} name="checkmark-outline" color={Colors.dark} size={28}/>
                    <Text style={globalStyles.Body}>{t("guidelines.content.2.listCheck.2.text")}</Text>
                </View>
            </View>
        </Swiper>
    )
}

export default GuidelinesScreen