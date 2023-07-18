import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, Image } from "react-native"
import styles from "../../styles/components/drawerTabStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet";
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
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular,
} from '@expo-google-fonts/public-sans';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { logOutUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";


const Drawer = createDrawerNavigator()

const CustomDrawer = (props: DrawerContentComponentProps) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const { user, dispatch } = useContext(AuthContext)
    const { dispatch: alert } = useAlert()
    const status = useDrawerStatus()

    const handleLogOut = (e: GestureResponderEvent) => {
        props.navigation.dispatch(DrawerActions.closeDrawer())
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => {
            alert!({ type: 'open', message: 'Logged out successfully!', alertType: 'success' })
            props.navigation.navigate('LoginScreen')
        }).catch(() => {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        })
    }

    return (
        <DrawerContentScrollView {...props}>
            {!loaded && <Text>Loading...</Text>}
            {loaded && <>
                <View testID={`Drawer.${status}`} style={styles.drawerContainer}>
                    {/* Temporary default profile picture */}
                    <Ionicons name="person-circle-sharp" color="#B8B8B8" size={64} />
                    <View testID="Drawer.usernameCont" style={{ padding: 4, marginLeft: -25 }}>
                        <Text testID="Drawer.username" style={[globalStyles.H2, { paddingBottom: 8 }]}>{user ? user['username'] : "User"}</Text>
                        <TouchableOpacity testID="Drawer.accSettBtn" onPress={() => props.navigation.navigate("AccountSettingsScreen")}>
                            <Text testID="Drawer.accSettBtnLabel" style={globalStyles.Body}>Account Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity testID="Drawer.closeBtn" onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}>
                            <Ionicons testID="Drawer.closeIcon" name="close" size={31} />
                        </TouchableOpacity>
                    </View>
                </View>

                <DrawerItem
                    testID="Drawer.historyBtn"
                    label={() => <Text style={globalStyles.Body}>Request & Offer History</Text>}
                    icon={() => <Image source={require('../../assets/History.png')} style={styles.Img} />}
                    onPress={() => props.navigation.navigate("PostsHistory")}
                />
                <DrawerItem
                    testID="Drawer.dietRestBtn"
                    label={() => <Text style={globalStyles.Body}>Preferences</Text>}
                    icon={() => <Image source={require('../../assets/Settings.png')} style={styles.Img} />}
                    onPress={() => { }}
                />
                <DrawerItem
                    testID="Drawer.notifSettBtn"
                    label={() => <Text style={globalStyles.Body}>Notifications Settings</Text>}
                    icon={() => <Image source={require('../../assets/Notifications_Settings.png')} style={styles.Img} />}
                    onPress={() => { }}
                />
                <DrawerItem
                    testID="Drawer.FAQBtn"
                    label={() => <Text style={globalStyles.Body}>FAQs</Text>}
                    icon={() => <Image source={require('../../assets/Help.png')} style={styles.Img} />}
                    onPress={() => { }}
                />
                <DrawerItem
                    testID="Drawer.termsBtn"
                    label={() => <Text style={globalStyles.Body}>Terms and Conditions</Text>}
                    icon={() => <Image source={require('../../assets/Scroll.png')} style={styles.Img} />}
                    onPress={() => { }}
                />
                <DrawerItem
                    testID="Drawer.policyBtn"
                    label={() => <Text style={globalStyles.Body}>Privacy Policy</Text>}
                    icon={() => <Image source={require('../../assets/Privacy.png')} style={styles.Img} />}
                    onPress={() => { }}
                />

                <TouchableOpacity testID="Drawer.logOutBtn" style={[globalStyles.secondaryBtn, { width: '85%', marginLeft: 10 }]} onPress={handleLogOut}>
                    <Text testID="Drawer.logOutBtnText" style={globalStyles.secondaryBtnLabel}>Log Out</Text>
                </TouchableOpacity>

                <DrawerItemList {...props} />
            </>}
        </DrawerContentScrollView>
    )
}

const DrawerTab = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
            <Drawer.Screen
                name="BottomTab"
                component={BottomTab}
                options={{
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerTab
