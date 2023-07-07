import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Pressable,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { NotificationContext } from "../context/ChatNotificationContext";
import PostRenderer from "../components/PostRenderer";
import FoodCategories from "../components/FoodCategories";
import { Colors, globalStyles } from "../../styles/globalStyleSheet"
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

        <View testID="Home.container" style={styles.container}>
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
                        <FoodCategories />
                    </View>
                    {showRequests &&
                        <PostRenderer
                            type={"r"}
                            navigation={navigation}
                            setShowRequests={setShowRequests}
                        />}
                    {!showRequests &&
                        <PostRenderer
                            type={"o"}
                            navigation={navigation}
                            setShowRequests={setShowRequests}
                        />}
                </>
            }
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    subContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginRight: 16,
        marginBottom: 4,
        marginLeft: 16
    },
    categoriesContainer: {
        marginTop: 8,
        marginBottom: 4,
        marginHorizontal: 16
    },
    landingPageText: {
        marginTop: 10,
        marginLeft: 25,
        marginBottom: 60,
    },
    pressable: {
        flexDirection: 'row',
        marginLeft: 4,
        marginRight: 25,
        borderBottomWidth: 4,
    },
    pressableText: {
        fontSize: 30,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
})