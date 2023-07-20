import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute, useIsFocused } from "@react-navigation/native"
import LoginScreen from '../screens/Loginscreen';
import CreateAccountScreen from '../screens/CreateAccountScreen'
import HomeScreen from '../screens/HomeScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import OfferFormScreen from '../screens/OfferFormScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import NotificationsSettingsScreen from '../screens/NotificationsSettingsScreen';
import Conversations from '../screens/Conversations';
import Chat from './Chat';
import NotificationsScreen from '../screens/NotificationsScreen';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Modal from 'react-native-modal';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStackNavigator = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: "Zero Hunger",
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite
                    },
                    headerLeft: () => (
                        <Ionicons
                            style={{ marginLeft: 12, marginRight: 21 }}
                            name="menu"
                            size={24}
                            onPress={navigation.openDrawer}
                        />
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons
                                style={{ padding: 16 }}
                                name="md-search"
                                size={22}
                                onPress={() => { }}
                            />
                            <Ionicons
                                style={{ padding: 16 }}
                                name="notifications-sharp"
                                size={22}
                                onPress={() => { navigation.navigate("NotificationsScreen") }}
                            />
                        </View>
                    )
                }}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    // headerShown: false,
                    title: "Zero Hunger",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                    headerLeft: () => (<></>),
                }}
            />
            <Stack.Screen
                name="CreateAccountScreen"
                component={CreateAccountScreen}
                options={{
                    // headerShown: false,
                    title: "Zero Hunger",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.Background
                    }
                }}
            />
            <Stack.Screen
                name="RequestFormScreen"
                component={RequestFormScreen}
                options={{
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="RequestDetailsScreen"
                component={RequestDetailsScreen}
                options={{
                    title: "Request",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                    headerRight: () => (
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            style={{ paddingRight: 16 }}
                            onPress={() => { }}
                        />
                    )
                }}
            />
            <Stack.Screen
                name="OfferFormScreen"
                component={OfferFormScreen}
                options={{
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="OfferDetailsScreen"
                component={OfferDetailsScreen}
                options={{
                    title: "Offer",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                    headerRight: () => (
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            style={{ paddingRight: 16 }}
                            onPress={() => { }}
                        />
                    )
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: true,
                    title: "Chat",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                }}
            />
            <Stack.Screen
                name="AccountSettingsScreen"
                component={AccountSettingsScreen}
                options={{
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="NotificationsSettingsScreen"
                component={NotificationsSettingsScreen}
                options={{
                    title: "Notifications Settings",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
                options={{
                    title: "Notifications",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerRight: () => (
                        <View>
                            <Ionicons
                                name="ellipsis-horizontal"
                                size={24}
                                style={{ paddingRight: 16 }}
                                onPress={() => { setModalVisible(!modalVisible) }}
                            />
                            <View>
                                <Modal
                                    isVisible={modalVisible}
                                    animationIn="slideInUp"
                                    backdropOpacity={0.5}
                                    onBackButtonPress={() => setModalVisible(!modalVisible)}
                                    onBackdropPress={() => setModalVisible(!modalVisible)}
                                    onSwipeComplete={() => setModalVisible(!modalVisible)}
                                    swipeDirection={['down']}
                                    style={styles.modal}
                                >
                                    <View style={{ marginBottom: 30, marginTop: 12 }}>
                                        <View style={styles.modalContent}>
                                            <Text style={[globalStyles.H3, { alignSelf: 'center' }]}>Notifications Options</Text>
                                        </View>
                                        <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, marginRight: 10 }} onPress={() => setModalVisible(!modalVisible)}>
                                            <Ionicons name="close" size={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ padding: 12 }}>
                                        {/* TODO: Implement mark all as read */}
                                        <View style={{padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.midLight}}>
                                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => {  }}>
                                                <Ionicons name="checkmark-circle-outline" size={24} style={{paddingRight: 16}}/>
                                                <Text style={[globalStyles.Body, {marginTop: 3}]}>Mark all as read</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ padding: 12 }}>
                                            <TouchableOpacity style={{ flexDirection: "row" }} 
                                                onPress={() => { 
                                                    setModalVisible(!modalVisible)
                                                    navigation.navigate("NotificationsSettingsScreen") 
                                                }}
                                            >
                                                {/* <Ionicons name="md-cog-outline" size={24} style={{ paddingRight: 16 }}/> */}
                                                <Image 
                                                    style={{height: 20, width: 20, marginLeft: 3, marginRight: 16}}
                                                    source={require('../../assets/notifications_settings_icon.png')}
                                                />
                                                <Text style={[globalStyles.Body, {marginTop: 3}]}>Notifications settings</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                        
                    )
                }}
            />
        </Stack.Navigator>
    )
}

const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ConversationsNav"
                component={Conversations}
                options={{
                    headerShown: true,
                    title: "Messages",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                    contentStyle: { backgroundColor: Colors.Background }
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: true,
                    title: "Chat",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                }}
            />
            <Stack.Screen
                name="RequestDetailsScreen"
                component={RequestDetailsScreen}
                options={{
                    title: "Request",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                    headerRight: () => (
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            style={{ paddingRight: 16 }}
                            onPress={() => { }}
                        />
                    )
                }}
            />
            <Stack.Screen
                name="OfferDetailsScreen"
                component={OfferDetailsScreen}
                options={{
                    title: "Offer",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                    headerRight: () => (
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            style={{ paddingRight: 16 }}
                            onPress={() => { }}
                        />
                    )
                }}
            />
        </Stack.Navigator>
    )
}

const PostComponent = () => null

const BottomTab = () => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
                            {focused
                                ? <Ionicons name="home" size={24} color={Colors.primary} style={{ marginBottom: -10 }} />
                                : <Ionicons name="home-outline" size={24} color={Colors.primary} style={{ marginBottom: -10 }} />
                            }
                        </View>
                    ),
                    tabBarLabelPosition: "below-icon",
                    tabBarLabelStyle: styles.bottomBarText,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                        if (routeName === 'LoginScreen' ||
                            routeName === 'CreateAccountScreen' ||
                            routeName === 'Chat') {

                            return { display: "none" }
                        }
                        return styles.bottomBarTab
                    })(route),
                })}
            />
            <Tab.Screen
                name="Post"
                component={PostComponent}
                //Post button + modal
                options={({ navigation }) => ({
                    tabBarButton: () =>
                        <View>
                            <View>
                                <TouchableOpacity style={styles.postButton} onPress={() => setModalVisible(!modalVisible)}>
                                    <Ionicons name="add-circle-outline" size={28} color={Colors.primary} style={{ marginLeft: 3 }} />
                                    <Text style={styles.bottomBarText}>Post</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Modal
                                    isVisible={modalVisible}
                                    animationIn="slideInUp"
                                    backdropOpacity={0.5}
                                    onBackButtonPress={() => setModalVisible(!modalVisible)}
                                    onBackdropPress={() => setModalVisible(!modalVisible)}
                                    onSwipeComplete={() => setModalVisible(!modalVisible)}
                                    swipeDirection={['down']}
                                    style={styles.modal}
                                >
                                    <View style={{ marginBottom: 30, marginTop: 12 }}>
                                        <View style={styles.modalContent}>
                                            <Text style={[globalStyles.H3, { alignSelf: 'center' }]}>What would you like to post?</Text>
                                        </View>
                                        <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, marginRight: 10 }} onPress={() => setModalVisible(!modalVisible)}>
                                            <Ionicons name="close" size={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={[globalStyles.defaultBtn, { marginTop: 10 }]}
                                            onPress={() => {
                                                setModalVisible(false)
                                                navigation.navigate("RequestFormScreen")
                                            }}
                                        >
                                            <Text style={[globalStyles.defaultBtnLabel, { color: '#E8E3D9' }]}>A Request for Food</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[globalStyles.secondaryBtn, { marginTop: 16 }]}
                                            onPress={() => {
                                                setModalVisible(false)
                                                navigation.navigate("OfferFormScreen")
                                            }}
                                        >
                                            <Text style={[globalStyles.secondaryBtnLabel, { color: Colors.primaryDark }]}>An Offering of Food</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                })}
            />
            <Tab.Screen
                name="Messages"
                component={ChatStackNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            {focused
                                ? <Ionicons name="chatbox-ellipses" size={24} color={Colors.primary} style={{ marginBottom: -10 }} />
                                : <Ionicons name="chatbox-ellipses-outline" size={24} color={Colors.primary} style={{ marginBottom: -10 }} />
                            }
                        </View>
                    ),
                    tabBarLabelPosition: "below-icon",
                    tabBarLabelStyle: styles.bottomBarText,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                        if (routeName === 'Chat') {
                            return { display: "none" }
                        }
                        return styles.bottomBarTab
                    })(route),
                    headerShown: false
                })}
            />
        </Tab.Navigator>
    )
}

export default BottomTab

const styles = StyleSheet.create({
    bottomBarText: {
        // marginBottom: 14,
        fontSize: 11,
        color: Colors.primary,
        marginBottom: 14,
        textAlign: "center"
    },
    bottomBarTab: {
        height: 69,
        backgroundColor: Colors.offWhite,
        borderTopWidth: 0,
    },
    postButton: {
        marginTop: 9,
        alignItems: "center",
        justifyContent: "center",
        // position: "absolute",
        // zIndex: 100,
        // width: "70%"
        paddingHorizontal: 40,
    },
    modal: {
        margin: 0,
        marginTop: Dimensions.get('window').height * 0.70,
        backgroundColor: Colors.offWhite,
        borderRadius: 10,
        elevation: 0,
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    }
})