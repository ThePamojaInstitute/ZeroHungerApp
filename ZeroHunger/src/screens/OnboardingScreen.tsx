import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState, useEffect } from "react";
import { storage } from "../../config";
import styles from '../../styles/screens/onboardingStyleSheet'
import Swiper from 'react-native-web-swiper';

type Props = {
    index?: number
    activeIndex?: number
}

//TEMP: Show onboarding on first app launch only using AsyncStorage
export const OnboardingScreen = ({ navigation }, props: Props) => {
    useEffect(() => {
        async function setData() {
            if (Platform.OS === "web") {
                // const appData = storage.getString("appLaunched")
                // if (!appData) {
                //     // storage.set("appLaunched", "false")
                // }
                // else {
                //     navigation.navigate("LoginScreen")
                // }
                navigation.navigate("LoginScreen")
            }
            else {
                const appData = await AsyncStorage.getItem("appLaunched")
                if (!appData) {
                    AsyncStorage.setItem("appLaunched", "false")
                }
                else {
                    navigation.navigate("LoginScreen")
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
    })

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
                <Image source={require('../../assets/Onboarding1.jpg')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Respond to Requests</Text>
                    <Text style={styles.text}>
                        Browse through and fulfill requests made by other users who need help with food.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding2.jpg')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Accept Offers</Text>
                    <Text style={styles.text}>
                        Explore and pick-up offers made by other users who want to share food and provide assistance.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding3.jpg')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Make Requests & Offers</Text>
                    <Text style={styles.text}>
                        Create your own requests or offers of food assistance.
                    </Text>
                </View>
            </View>
        </Swiper>
    )
}

export default OnboardingScreen