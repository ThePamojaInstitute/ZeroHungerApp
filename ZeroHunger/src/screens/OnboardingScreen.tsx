import { View, Text, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState, useEffect } from "react";
import styles from '../../styles/screens/onboardingStyleSheet'
import Swiper from 'react-native-web-swiper';
// import Swiper from 'react-native-swiper/src';
// import Onboarding from 'react-native-onboarding-swiper';

export const OnboardingScreen = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    return (
        // <Swiper showsButton={true}>
        //     <View style={styles.view}>
        //         <Image source={require('../../assets/Onboarding1.png')} resizeMode="center" style={styles.image}/>
        //         <View style={styles.view}>
        //             <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Respond to Requests</Text>
        //             <Text style={globalStyles.Body}>
        //                 Browse through and fulfill requests made by other users who need help with food.
        //             </Text>
        //         </View>
        //     </View>
        //     <View style={styles.view}>
        //         <Image source={require('../../assets/Onboarding2.png')} resizeMode="center" style={styles.image}/>
        //         <View style={styles.view}>
        //             <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Accept Offers</Text>
        //             <Text style={globalStyles.Body}>
        //                 Explore and pick-up offers made by other users who want to share food and provide assistance.
        //             </Text>
        //         </View>
        //     </View>
        //     <View style={styles.view}>
        //         <Image source={require('../../assets/Onboarding3.png')} resizeMode="center" style={styles.image}/>
        //         <View style={styles.view}>
        //             <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Make Requests & Offers</Text>
        //             <Text style={globalStyles.Body}>
        //                 Create your own requests or offers of food assistance.
        //             </Text>
        //         </View>
        //     </View>
        // </Swiper>

        <Swiper 
            controlsProps={{
                dotsTouchable: true,
                prevTitle: 'Back',
                nextTitle: 'Next',
                prevTitleStyle: [globalStyles.H4, {color: Colors.primaryDark}],
                nextTitleStyle: [globalStyles.H4, {color: Colors.primaryDark}],
                dotsPos: 'bottom',
                dotsWrapperStyle: {paddingBottom: 100},
                prevPos: 'bottom-left',
                // DotComponent: ({ index, isActive, onPress }) => <Text onPress={onPress}>Your Custom Dot {index+1}</Text>
                cellsContent: {
                    'right': <Text>test</Text>
                }
            }}
        >
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding1.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Respond to Requests</Text>
                    <Text style={globalStyles.Body}>
                        Browse through and fulfill requests made by other users who need help with food.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding2.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Accept Offers</Text>
                    <Text style={globalStyles.Body}>
                        Explore and pick-up offers made by other users who want to share food and provide assistance.
                    </Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image source={require('../../assets/Onboarding3.png')} resizeMode="center" style={styles.image}/>
                <View style={styles.view}>
                    <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Make Requests & Offers</Text>
                    <Text style={globalStyles.Body}>
                        Create your own requests or offers of food assistance.
                    </Text>
                </View>
            </View>
        </Swiper>

        // <Onboarding
        //     pages={[
        //         {
        //             backgroundColor: Colors.Background,
        //             image: <Image source={require('../../assets/Onboarding1.png')} resizeMode="center" style={styles.image}/>,
        //             title: <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Respond to Requests</Text>,
        //             subtitle: 
        //                 <Text style={globalStyles.Body}>
        //                     Browse through and fulfill requests made by other users who need help with food.
        //                 </Text>
        //         },
        //         {
        //             backgroundColor: Colors.Background,
        //             image: <Image source={require('../../assets/Onboarding2.png')} resizeMode="center" style={styles.image}/>,
        //             title: <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Accept Offers</Text>,
        //             subtitle: 
        //                 <Text style={globalStyles.Body}>
        //                     Explore and pick-up offers made by other users who want to share food and provide assistance.
        //                 </Text>
        //         },
        //         {
        //             backgroundColor: Colors.Background,
        //             image: <Image source={require('../../assets/Onboarding3.png')} resizeMode="center" style={styles.image}/>,
        //             title: <Text style={[globalStyles.H1, {paddingBottom: 12}]}>Make Requests & Offers</Text>,
        //             subtitle:
        //                 <Text style={globalStyles.Body}>
        //                     Create your own requests or offers of food assistance.
        //                 </Text>
        //         },
        //     ]}
        // />
    )
}

export default OnboardingScreen