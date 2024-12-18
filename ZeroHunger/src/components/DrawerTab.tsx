import { useContext } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, Image } from "react-native"
import styles from "../../styles/components/drawerTabStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native"
import { DrawerActions } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
    useDrawerStatus
} from "@react-navigation/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { AuthContext } from "../context/AuthContext";
import BottomTab from "./BottomTab";
import { Ionicons } from '@expo/vector-icons';
import { logOutUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { useTranslation } from "react-i18next";


const Drawer = createDrawerNavigator()

const CustomDrawer = (props: DrawerContentComponentProps) => {
    const { user, dispatch } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()
    const status = useDrawerStatus()

    const handleLogOut = (e: GestureResponderEvent) => {
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => {
            alert!({ type: 'open', message: 'Logged out successfully!', alertType: 'success' })
            props.navigation.dispatch(DrawerActions.closeDrawer())
            props.navigation.navigate('LoginScreen')
        }).catch(() => {
            props.navigation.dispatch(DrawerActions.closeDrawer())
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        })
    }
    const { t, i18n } = useTranslation();
    return (
        <DrawerContentScrollView contentContainerStyle={{ height: '100%' }} {...props}>
            <View testID={`Drawer.${status}`} style={styles.drawerContainer}>
                {/* Temporary default profile picture */}
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="person-circle-sharp" color="#B8B8B8" size={64} />
                    <View testID="Drawer.usernameCont" style={{ padding: 4 }}>
                        <Text testID="Drawer.username" style={[globalStyles.H2, { marginBottom: 7, marginLeft: 3.5 }]}>{user ? user['username'] : "User"}</Text>
                        <TouchableOpacity testID="Drawer.accSettBtn" onPress={() => props.navigation.navigate("AccountSettingsScreen")}>
                            <Text testID="Drawer.accSettBtnLabel" style={globalStyles.Body}> {t("menu.side.account.label")} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <TouchableOpacity testID="Drawer.closeBtn" onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}>
                        <Ionicons testID="Drawer.closeIcon" name="close" size={31} />
                    </TouchableOpacity>
                </View>
            </View>

            <DrawerItem
                testID="Drawer.historyBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.history.label")}</Text>}
                icon={() => <Image source={require('../../assets/History.png')} style={styles.Img} />}
                onPress={() => props.navigation.navigate("PostsHistory")}
            />
            <DrawerItem
                testID="Drawer.dietRestBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.preferences.label")}</Text>}
                icon={() => <Image source={require('../../assets/Settings.png')} style={styles.Img} />}
                onPress={() => props.navigation.navigate("Preferences")}
            />
            <DrawerItem
                testID="Drawer.notifSettBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.notifications.label")}</Text>}
                icon={() => <Image source={require('../../assets/Notifications_Settings.png')} style={styles.Img} />}
                onPress={() => { props.navigation.navigate("NotificationsSettingsScreen") }}
            />
            <DrawerItem
                testID="Drawer.FAQBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.faq.label")}</Text>}
                icon={() => <Image source={require('../../assets/Help.png')} style={styles.Img} />}
                onPress={() => { }}
            />
            <DrawerItem
                testID="Drawer.termsBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.terms.label")}</Text>}
                icon={() => <Image source={require('../../assets/Scroll.png')} style={styles.Img} />}
                onPress={() => { }}

            />
            <DrawerItem
                testID="Drawer.policyBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.privacy.label")}</Text>}
                icon={() => <Image source={require('../../assets/Privacy.png')} style={styles.Img} />}
                onPress={() => { }}
            />
            <DrawerItem
                testID="Drawer.helpBtn"
                label={() => <Text style={globalStyles.Body}>{t("menu.side.help.label")}</Text>}
                icon={() => <Image source={require('../../assets/Help.png')} style={styles.Img} />}
                onPress={() => { alert({ type: 'open', message: 'Contact Help at: admin@pamoja.org', alertType: '' }) }}
            />

            <TouchableOpacity
                testID="Drawer.logOutBtn"
                style={styles.logOutBtn}
                onPress={handleLogOut}
            >
                <Image source={require('../../assets/Logout.png')} style={styles.Img} />
                <Text
                    testID="Drawer.logOutBtnText"
                    style={[globalStyles.Body, { marginLeft: 20 }]}
                >{t("menu.side.logout.label")}</Text>
            </TouchableOpacity>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    )
}

const DrawerTab = () => {
    const drawerTabEnabledScreens = ['HomeScreen']

    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                drawerItemStyle: { height: 0 },
                drawerStyle: {
                    width: '85%',
                    maxWidth: 400
                }
            }}
        >
            <Drawer.Screen
                name="BottomTab"
                component={BottomTab}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? ("LoginScreen")
                    
                    if (!drawerTabEnabledScreens.includes(routeName))
                        return ({ swipeEnabled: false, headerShown: false, })
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerTab
