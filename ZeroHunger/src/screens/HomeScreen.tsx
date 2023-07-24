import React, { useContext, useEffect, useState } from "react";
import {
    Text,
    View,
    Pressable,
} from "react-native";
import styles from "../../styles/screens/homeStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { NotificationContext } from "../context/ChatNotificationContext";
import FeedPostRenderer from "../components/FeedPostRenderer";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';

export const HomeScreen = ({ navigation }) => {
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
    const { unreadMessageCount, chatIsOpen, setChatIsOpen } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [showRequests, setShowRequests] = useState(true)

    // on navigation change
    useFocusEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    })

    // on mount
    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    }, [])

    useEffect(() => {
        if (unreadMessageCount > 0 && !chatIsOpen) {
            alert!({
                type: 'open', message: `You have ${unreadMessageCount} new ${unreadMessageCount > 1
                    ? 'messages' : 'message'}`, alertType: 'info'
            })
        }
    }, [unreadMessageCount])

    return (
        <>
            {user && <View testID="Home.container" style={styles.container}>
                {!loaded && <Text>Loading...</Text>}
                {loaded &&
                    <>
                        <View testID="Home.subContainer" style={styles.subContainer}>
                            <View testID="Home.requestsContainer" style={[
                                {
                                    borderBottomColor: showRequests ?
                                        'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                                },
                                styles.pressable
                            ]}>
                                <Pressable
                                    style={styles.pressableText}
                                    onPress={() => setShowRequests(true)}
                                    testID="Home.requestsBtn"
                                >
                                    <Text testID="Home.requestsLabel" style={globalStyles.H3}>Requests</Text>
                                </Pressable>
                            </View>
                            <View testID="Home.offersContainer" style={[
                                {
                                    borderBottomColor: !showRequests ?
                                        'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                                },
                                styles.pressable
                            ]}>
                                <Pressable
                                    style={styles.pressableText}
                                    onPress={() => setShowRequests(false)}
                                    testID="Home.offersBtn"
                                >
                                    <Text testID="Home.offersLabel" style={globalStyles.H3}>Offers</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View testID="Home.categoriesContainer" style={styles.categoriesContainer}>
                            {/* <FoodCategories /> */}
                        </View>
                        {showRequests &&
                            <FeedPostRenderer
                                type={"r"}
                                navigation={navigation}
                                setShowRequests={setShowRequests}
                            />}
                        {!showRequests &&
                            <FeedPostRenderer
                                type={"o"}
                                navigation={navigation}
                                setShowRequests={setShowRequests}
                            />}
                    </>
                }
            </View>}
        </>
    )
}

export default HomeScreen
