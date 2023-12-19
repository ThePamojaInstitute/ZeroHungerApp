import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState, useEffect } from "react";
import { storage } from "../../config";
import styles from '../../styles/screens/onboardingStyleSheet'
import Swiper from 'react-native-web-swiper';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    index?: number
    activeIndex?: number
}

//Show onboarding on first app launch only using AsyncStorage
export const OnboardingScreen = ({ navigation }, props: Props) => {
    useEffect(() => {
        async function setData() {
            if (Platform.OS === "web") {
                const appData = storage.getString("appLaunched")
                if (!appData) {
                    storage.set("appLaunched", "false")
                }
                else {
                    navigation.navigate("SignInUpScreen")
                }
            }
            else {
                const appData = await AsyncStorage.getItem("appLaunched")
                if (!appData) {
                    AsyncStorage.setItem("appLaunched", "false")
                }
                else {
                    navigation.navigate("SignInUpScreen")
                }
            }
        }
        setData()
    }, [])


    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        })
    }, [])

    return (
        // <></>
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
                    <Text style={[globalStyles.H4, styles.backButton, {opacity: 0.5}]}>
                        Back
                    </Text>,
                lastNextElement: 
                    <View style={styles.continueButton}>
                        <TouchableOpacity 
                            style={[globalStyles.defaultBtn, {padding: 18}]}
                            onPress={() => {if(!props.activeIndex) navigation.navigate("LoginScreen")}}
                        >
                            <Text style={globalStyles.defaultBtnLabel}>Continue</Text>
                        </TouchableOpacity>
                    </View>
            }}
        >
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding1.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H2, { paddingBottom: 18 }]}>Share food with your neighbours</Text>
                    <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
                        See <Ionicons name='square' color={Colors.requests}/>
                        <Text style={{ fontWeight: 'bold' }}> Food requests </Text> 
                        from people in your neighbourhood. If you have the food they need, just send them a message.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding2.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H2, { paddingBottom: 18 }]}>Find free food in your area</Text>
                    <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
                       See <Ionicons name='ellipse' color={Colors.offers}/>
                       <Text style={[globalStyles.Body, {fontWeight: 'bold'}]}> Free food </Text> 
                       offered by people in your neighbourhood. If you need the food they offer, just send them a message.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding3.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H2, { paddingBottom: 18 }]}>It's never been easier</Text>
                    <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
                        From choosing a public meeting point to communicating about allergies and disability needs. Zero Hunger makes it easy to share with your neighbours.
                    </Text>
                </View>
            </View>
        </Swiper>
    )
}

export default OnboardingScreen