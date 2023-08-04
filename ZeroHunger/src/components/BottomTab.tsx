import { useContext, useState } from "react";
import { View, TouchableOpacity, Text, Dimensions, Image, Platform } from "react-native";
import styles from "../../styles/components/bottomTabStyleSheet"
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native"
import LoginScreen from '../screens/Loginscreen';
import CreateAccountScreen from '../screens/CreateAccountScreen'
import HomeScreen from '../screens/HomeScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import OfferFormScreen from '../screens/OfferFormScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import NotificationsSettingsScreen from '../screens/NotificationsSettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import Conversations from '../screens/Conversations';
import Chat from './Chat';
import NotificationsScreen from '../screens/NotificationsScreen';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Modal from 'react-native-modal';
import PostsHistory from "../screens/PostsHistory";
import Preferences from "../screens/Preferences";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { NotificationContext } from "../context/ChatNotificationContext";

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStackNavigator = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    return (
        <Stack.Navigator>
            {/* <Stack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
                options={({ route }) => ({
                    title: t("app.title"),
                    // headerTitleStyle: globalStyles.H4,
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerRight: () => (
                        <View style={{ marginRight: 24 }}>
                            <TouchableOpacity onPress={() => { navigation.navigate("LoginScreen") }}>
                                <Text style={globalStyles.Body}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            /> */}
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    title: t("app.title"),
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                    headerLeft: () => (<></>),
                    contentStyle: { backgroundColor: Colors.Background }
                }}
            />
            <Stack.Screen
                name="CreateAccountScreen"
                component={CreateAccountScreen}
                options={{
                    title: t("app.title"),
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.Background
                    },
                    contentStyle: { backgroundColor: Colors.Background }
                }}
            />
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: t("app.title"),
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
                            testID="Home.drawerBtn"
                        />
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            {Platform.OS === "web" &&
                                <MaterialIcons
                                    style={{ padding: 16 }}
                                    name="refresh"
                                    size={26}
                                    color="black"
                                />
                            }
                            <Ionicons
                                style={{ padding: 16 }}
                                name="notifications-sharp"
                                size={22}
                                onPress={() => { navigation.navigate("NotificationsScreen") }}
                            />
                            <Ionicons
                                style={{ padding: 16 }}
                                name="md-search"
                                size={22}
                                onPress={() => { }}
                                testID="Home.searchBtn"
                            />
                        </View>
                    )
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
                    title: t("request.form.detailsHeading"),
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
                    title: t("offer.form.detailsHeading"),
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
                name={t("app.messages.label")}
                component={Chat}
                options={{
                    headerShown: true,
                    title: t("app.messages.label"),
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
                    title: "Account Settings",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background
                    },
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: Colors.Background },
                    headerLeft: () => (
                        <TouchableOpacity
                            testID="Request.cancelBtn"
                            onPress={() => navigation.navigate('HomeScreen')}
                        >
                            <Text
                                testID="Request.cancelBtnLabel"
                                style={styles.cancelBtn}
                            >Cancel</Text>
                        </TouchableOpacity>
                    ),
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
            />
            <Stack.Screen
                name="PostsHistory"
                component={PostsHistory}
                options={{
                    headerShown: true,
                    title: t("menu.history.label"),
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                }}
            />
            <Stack.Screen
                name="Preferences"
                component={Preferences}
                options={{
                    headerShown: true,
                    title: t("menu.preferences.label"),
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
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
                    title: t("app.messages.label"),
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
                    title: t("app.messages.label"),
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
                    title: t("request.form.detailsHeading"),
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
                    title: t("offer.form.detailsHeading"),
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
    const { unreadMessageCount, chatIsOpen } = useContext(NotificationContext);

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <Tab.Navigator>
            <Tab.Screen
                name={t("app.home.label")}
                component={HomeStackNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View testID="Bottom.homeNav" style={styles.homeButton}>
                            {focused
                                ? <Image
                                    source={require('../../assets/Home.png')}
                                    style={styles.icon}
                                />
                                : <Image
                                    source={require('../../assets/Home-outline.png')}
                                    style={styles.icon}
                                />
                            }
                        </View>
                    ),
                    tabBarLabelPosition: "below-icon",
                    tabBarLabelStyle: styles.bottomBarText,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                        if (routeName === 'LoginScreen' ||
                            routeName === 'CreateAccountScreen' ||
                            routeName === 'Chat' ||
                            routeName === 'OnboardingScreen') {
                            return { display: "none" }
                        }
                        return styles.bottomBarTab
                    })(route),
                })}
            />
            <Tab.Screen
                name={t("app.post.label")}
                component={PostComponent}
                //Post button + modal
                options={({ navigation }) => ({
                    tabBarButton: () =>
                        <View testID="Bottom.postNav">
                            <View>
                                <TouchableOpacity
                                    testID="Bottom.postNavButton"
                                    style={styles.postButton}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Image
                                        source={require('../../assets/Group.png')}
                                        style={[styles.icon, { marginBottom: 5 }]}
                                    />
                                    <Text
                                        testID="Bottom.postNavLabel"
                                        style={styles.bottomBarText}
                                    > {t("app.post.label")} </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Modal
                                    testID="Bottom.postNavModal"
                                    isVisible={modalVisible}
                                    animationIn="slideInUp"
                                    backdropOpacity={0.5}
                                    onBackButtonPress={() => setModalVisible(!modalVisible)}
                                    onBackdropPress={() => setModalVisible(!modalVisible)}
                                    onSwipeComplete={() => setModalVisible(!modalVisible)}
                                    swipeDirection={['down']}
                                    style={[styles.modal,
                                    { marginTop: Dimensions.get('window').height * 0.69 }]}
                                >
                                    <View style={{ marginBottom: 30, marginTop: 12 }}>
                                        <View style={styles.modalContent}>
                                            <Text style={[globalStyles.H3, { alignSelf: 'center' }]}>What would you like to post?</Text>
                                        </View>
                                        <TouchableOpacity
                                            testID="Bottom.postNavModalClose"
                                            style={styles.modalClose}
                                            onPress={() => setModalVisible(!modalVisible)}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={30}
                                                style={{ marginTop: -15 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={[globalStyles.secondaryBtn, { marginTop: 10 }]}
                                            onPress={() => {
                                                setModalVisible(false)
                                                navigation.navigate("RequestFormScreen")
                                            }}
                                            testID="Bottom.postNavModalReqBtn"
                                        >
                                            <Text
                                                testID="Bottom.postNavModalReqLabel"
                                                style={[globalStyles.secondaryBtnLabel]}
                                            > A Request for Food </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[globalStyles.secondaryBtn, { marginTop: 16, marginBottom: 15 }]}
                                            onPress={() => {
                                                setModalVisible(false)
                                                navigation.navigate("OfferFormScreen")
                                            }}
                                            testID="Bottom.postNavModalOffBtn"
                                        >
                                            <Text
                                                testID="Bottom.postNavModalOffLabel"
                                                style={[globalStyles.secondaryBtnLabel]}
                                            >An Offering of Food</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                })}
            />
            <Tab.Screen
                name={t("app.messages.label")}
                component={ChatStackNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View
                            testID="Bottom.messagesNav"
                            style={styles.messagesButton}
                        >
                            {focused
                                ? <Image
                                    source={require('../../assets/Messages.png')}
                                    style={styles.icon}
                                />
                                : <Image
                                    source={require('../../assets/Messages-outline.png')}
                                    style={styles.icon}
                                />
                            }
                            {!!unreadMessageCount &&
                                <View style={[styles.circle, { right: unreadMessageCount > 99 ? -15 : unreadMessageCount > 9 ? -8 : -5 }]}>
                                    <Text style={styles.unreadCount}>{unreadMessageCount > 99 ? '99+' : unreadMessageCount}</Text>
                                </View>
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
