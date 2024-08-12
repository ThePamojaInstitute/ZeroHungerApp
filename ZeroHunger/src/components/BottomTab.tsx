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
import PermissionsScreen from "../screens/PermissionsScreen";
import GuidelinesScreen from "../screens/GuidelinesScreen";
import PermissionsScreen2 from "../screens/PermissionsScreen2";
import { HomeCustomHeaderRight } from "./headers/HomeCustomHeaderRight";
import { HomeWebCustomHeader } from "./headers/HomeWebCustomHeader";
import { ChatCustomHeader } from "./headers/ChatCustomHeader";
import { WebCustomHeader } from "./headers/WebCustomHeader";
import { AccSettingsFormCustomHeader } from "./headers/AccSettingsCustomHeader";
import { FormCustomHeader } from "./headers/FormCustomHeader";
import { MainCustomHeader } from "./headers/MainCustomHeader";
import { GuidLinesCustomHeader } from "./headers/GuideLinesCustomHeader";

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
                    headerStyle: {
                        backgroundColor: Colors.offWhite
                    },
                    headerRight: () => (
                        <View style={{ marginRight: 12 }}>
                            <TouchableOpacity onPress={() => { navigation.navigate("PermissionsScreen") }}>
                                <Text style={globalStyles.Body}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            /> */}
            {Platform.OS !== 'web' ?
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
                /> :
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        header: () => (
                            <MainCustomHeader
                                title={t("app.title")}
                                color={Colors.Background}
                            />
                        ),
                        contentStyle: { backgroundColor: Colors.Background }
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                /> :
                <Stack.Screen
                    name="CreateAccountScreen"
                    component={CreateAccountScreen}
                    options={{
                        header: () => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={t("app.title")}
                            />
                        ),
                        contentStyle: { backgroundColor: Colors.Background }
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="PermissionsScreen"
                    component={PermissionsScreen}
                    options={{
                        title: t("app.title"),
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: Colors.offWhite
                        },
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                /> :
                <Stack.Screen
                    name="PermissionsScreen"
                    component={PermissionsScreen}
                    options={{
                        header: () => (
                            <MainCustomHeader
                                title={t("app.title")}
                                color={Colors.offWhite}
                            />
                        ),
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="GuidelinesScreen"
                    component={GuidelinesScreen}
                    options={{
                        title: t("guidelines.header.text"),
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: Colors.offWhite
                        },
                        headerRight: () => (
                            <View style={{ marginRight: 12 }}>
                                <TouchableOpacity onPress={() => { navigation.navigate("PermissionsScreen2") }}>
                                    <Text style={globalStyles.Body}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                        ),
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                /> :
                <Stack.Screen
                    name="GuidelinesScreen"
                    component={GuidelinesScreen}
                    options={{
                        header: () => (
                            <GuidLinesCustomHeader
                                navigation={navigation}
                                title={t("guidelines.header.text")}
                            />
                        ),
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="PermissionsScreen2"
                    component={PermissionsScreen2}
                    options={{
                        title: t("app.title"),
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: Colors.offWhite
                        },
                        headerLeft: () => (<></>),
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                /> :
                <Stack.Screen
                    name="PermissionsScreen2"
                    component={PermissionsScreen2}
                    options={{
                        header: () => (
                            <MainCustomHeader
                                title={t("app.title")}
                                color={Colors.offWhite}
                            />
                        ),
                        contentStyle: { backgroundColor: Colors.offWhite },
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                                style={{
                                    marginLeft: Platform.OS === 'web' ? 12 : 0,
                                    marginRight: 21,
                                }}
                                name="menu"
                                size={24}
                                onPress={navigation.openDrawer}
                                testID="Home.drawerBtn"
                            />
                        ),
                        headerRight: () => (
                            <HomeCustomHeaderRight
                                navigation={navigation}
                                expiringPosts={[]}
                                setExpiringPosts={() => { }}
                            />
                        ),
                    }}
                /> :
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        header: () => (
                            <HomeWebCustomHeader
                                navigation={navigation}
                                updater={() => { }}
                                expiringPosts={[]}
                                setExpiringPosts={() => { }}
                                setShowSearch={() => {}}
                                t={t}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="RequestFormScreen"
                    component={RequestFormScreen}
                    options={{
                        headerShadowVisible: false,
                    }}
                /> :
                <Stack.Screen
                    name="RequestFormScreen"
                    component={RequestFormScreen}
                    options={{
                        header: () => (
                            <FormCustomHeader
                                navigation={navigation}
                                title={t("request.form.heading")}
                                defaultPostalCode={null}
                                setUseDefaultPostal={() => { }}
                                useDefaultPostal={false}
                                handlePress={() => { }}
                                handleSubmit={() => { }}
                                setError={() => { }}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                        // headerRight: () => (
                        //     <Ionicons
                        //         name="ellipsis-horizontal"
                        //         size={24}
                        //         style={{ paddingRight: 16 }}
                        //         onPress={() => { }}
                        //     />
                        // )
                    }}
                /> :
                <Stack.Screen
                    name="RequestDetailsScreen"
                    component={RequestDetailsScreen}
                    options={{
                        title: t("request.form.detailsHeading"),
                        header: () => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={t("request.form.detailsHeading")}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="OfferFormScreen"
                    component={OfferFormScreen}
                    options={{
                        headerShadowVisible: false,
                    }}
                /> :
                <Stack.Screen
                    name="OfferFormScreen"
                    component={OfferFormScreen}
                    options={{
                        header: () => (
                            <FormCustomHeader
                                navigation={navigation}
                                title={t("offer.form.heading")}
                                defaultPostalCode={null}
                                setUseDefaultPostal={() => { }}
                                useDefaultPostal={false}
                                handlePress={() => { }}
                                handleSubmit={() => { }}
                                setError={() => { }}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                        // headerRight: () => (
                        //     <Ionicons
                        //         name="ellipsis-horizontal"
                        //         size={24}
                        //         style={{ paddingRight: 16 }}
                        //         onPress={() => { }}
                        //     />
                        // )
                    }}
                /> :
                <Stack.Screen
                    name="OfferDetailsScreen"
                    component={OfferDetailsScreen}
                    options={{
                        title: t("offer.form.detailsHeading"),
                        header: () => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={t("offer.form.detailsHeading")}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name={'Chat'}
                    component={Chat}
                    options={{
                        headerShown: true,
                        title: t("app.messages.label"),
                        headerTitleAlign: 'center',
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: Colors.offWhite,
                        },
                    }}
                /> :
                <Stack.Screen
                    name={'Chat'}
                    component={Chat}
                    options={{
                        header: ({ navigation }) => (
                            <ChatCustomHeader
                                navigation={navigation}
                                username={"user"}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="AccountSettingsScreen"
                    component={AccountSettingsScreen}
                    options={{
                        title: "Account Settings",
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: Colors.offWhite
                        },
                        headerShadowVisible: false,
                        contentStyle: { backgroundColor: Colors.offWhite },
                        headerLeft: () => (
                            <TouchableOpacity
                                testID="Request.cancelBtn"
                                onPress={() => navigation.navigate('HomeScreen')}
                                style={Platform.OS === 'web' ? { marginLeft: 10 } : {}}
                            >
                                <Text
                                    testID="Request.cancelBtnLabel"
                                    style={styles.cancelBtn}
                                >Cancel</Text>
                            </TouchableOpacity>
                        ),
                    }}
                /> :
                <Stack.Screen
                    name="AccountSettingsScreen"
                    component={AccountSettingsScreen}
                    options={{
                        header: () => (
                            <AccSettingsFormCustomHeader
                                navigation={navigation}
                                title={'Account Settings'}
                                handleModifyUser={() => { }}
                                handleSubmit={() => { }}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="NotificationsSettingsScreen"
                    component={NotificationsSettingsScreen}
                    options={{
                        title: "Notifications Settings",
                        headerTitleAlign: "center",
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: Colors.offWhite,
                        },
                    }}
                /> :
                <Stack.Screen
                    name="NotificationsSettingsScreen"
                    component={NotificationsSettingsScreen}
                    options={{
                        header: () => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={"Notifications Settings"}
                            />
                        )
                    }}
                />
            }
            < Stack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
            />
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="PostsHistory"
                    component={PostsHistory}
                    options={{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerShadowVisible: false,
                        title: "Request and Offer History",
                        headerStyle: {
                            backgroundColor: Colors.offWhite,
                        },
                    }}
                /> :
                <Stack.Screen
                    name="PostsHistory"
                    component={PostsHistory}
                    options={{
                        header: () => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={"Request and Offer History"}
                            />
                        )
                    }}
                />
            }
            <Stack.Screen
                name="Preferences"
                component={Preferences}
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    title: t("menu.side.preferences.label"),
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                }}
            />
        </Stack.Navigator >
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
                    // title: t("messages.heading"),
                    title: t("menu.bottom.messages.label"),
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                    contentStyle: { backgroundColor: Colors.offWhite }
                }}
            />
            {Platform.OS !== 'web' ?
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                        headerShown: true,
                        title: t("app.messages.label"),
                        headerTitleAlign: 'center',
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: Colors.offWhite,
                        },
                    }}
                /> :
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                        header: ({ navigation }) => (
                            <ChatCustomHeader
                                navigation={navigation}
                                username={"user"}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                        // headerRight: () => (
                        //     <Ionicons
                        //         name="ellipsis-horizontal"
                        //         size={24}
                        //         style={{ paddingRight: 16 }}
                        //         onPress={() => { }}
                        //     />
                        // )
                    }}
                /> :
                <Stack.Screen
                    name="RequestDetailsScreen"
                    component={RequestDetailsScreen}
                    options={{
                        title: t("request.form.detailsHeading"),
                        header: ({ navigation }) => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={t("request.form.detailsHeading")}
                            />
                        )
                    }}
                />
            }
            {Platform.OS !== 'web' ?
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
                        // headerRight: () => (
                        //     <Ionicons
                        //         name="ellipsis-horizontal"
                        //         size={24}
                        //         style={{ paddingRight: 16 }}
                        //         onPress={() => { }}
                        //     />
                        // )
                    }}
                /> :
                <Stack.Screen
                    name="OfferDetailsScreen"
                    component={OfferDetailsScreen}
                    options={{
                        title: t("offer.form.detailsHeading"),
                        header: ({ navigation }) => (
                            <WebCustomHeader
                                navigation={navigation}
                                title={t("offer.form.detailsHeading")}
                            />
                        )
                    }}
                />
            }
        </Stack.Navigator>
    )
}

const PostComponent = () => null

const BottomTab = () => {
    const { unreadMessageCount, chatIsOpen } = useContext(NotificationContext);

    const [modalVisible, setModalVisible] = useState(false)
    const [height, setHeight] = useState(0)

    const bottomTabDisabledScreens = [
        'LoginScreen',
        'CreateAccountScreen',
        'Chat',
        'OnboardingScreen',
        'PermissionsScreen',
        'RequestFormScreen',
        'OfferFormScreen',
    ]

    return (
        <Tab.Navigator>
            <Tab.Screen
                name={t("menu.bottom.home.label")}
                component={HomeStackNavigator}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarItemStyle: { marginRight: Platform.OS === 'web' ? 150 : 0 },
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
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "LoginScreen"
                        if (bottomTabDisabledScreens.includes(routeName)) {
                            return { display: "none" }
                        }
                        return styles.bottomBarTab
                    })(route),
                })}
            />
            <Tab.Screen
                name={t("menu.bottom.post.label")}
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
                                    > {t("menu.bottom.post.label")} </Text>
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
                                    style={[styles.modal, Platform.OS === 'web' ? styles.modalAlignWidth : {},
                                    height ? { marginTop: Dimensions.get('window').height - (height + 20) }
                                        : {}]}
                                >
                                    <View
                                        onLayout={(event) => {
                                            const height = event.nativeEvent.layout.height;
                                            setHeight(height)
                                        }}
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
                                                    size={28}
                                                    style={{ marginTop: -2 }}
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
                                                style={[globalStyles.secondaryBtn, { marginTop: 16, marginBottom: 30 }]}
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
                                    </View>
                                </Modal>
                            </View>
                        </View>
                })}
            />
            <Tab.Screen
                // name={t("app.messages.label")}
                name={t("menu.bottom.messages.label")}
                component={ChatStackNavigator}
                options={({ route }) => ({
                    tabBarItemStyle: { marginLeft: Platform.OS === 'web' ? 150 : 0 },
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
