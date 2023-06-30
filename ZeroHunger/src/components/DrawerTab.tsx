import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect, DrawerActions } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import BottomTab from "./BottomTab";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular,
} from '@expo-google-fonts/public-sans';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { globalStyles, Colors } from "../../styles/globalStyleSheet";
import { logOutUser, deleteUser } from "../controllers/auth";

const Drawer = createDrawerNavigator()

const CustomDrawer = (props) => {
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
                <View style={{flexDirection: "row", marginTop: 12, marginLeft: 12, marginRight: 8, marginBottom: 32, justifyContent: "space-between" }}>
                    {/* Temporary default profile picture */}
                    <Ionicons name="person-circle-sharp" color="#B8B8B8" size={64}/>
                    <View style={{padding: 4, marginLeft: -8}}>
                        <Text style={[globalStyles.H2, {paddingBottom: 8}]}>{user ? user['username'] : "User"}</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate("AccountSettingsScreen")}>
                            <Text style={globalStyles.Body}>Account Settings    </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ }}>
                        <TouchableOpacity onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}>
                            <Ionicons name="close" size={31} />
                        </TouchableOpacity>
                    </View>
                </View>

                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>Request & Offer History</Text>}
                    icon={() => <MaterialCommunityIcons name="history" size={24}/> }
                    onPress={() => {}}
                />
                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>Dietary Restrictions</Text>}
                    icon={() => <MaterialCommunityIcons name="silverware-fork-knife" size={24}/> }
                    onPress={() => {}}
                />  
                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>Notifications Settings</Text>}
                    icon={() => <Ionicons name="md-cog-outline" size={24}/> }
                    onPress={() => {}}
                />     
                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>FAQ</Text>}
                    icon={() => <Ionicons name="help-circle-outline" size={24}/> }
                    onPress={() => {}}
                />  
                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>Terms and Conditions</Text>}
                    icon={() => <Ionicons name="document-text-outline" size={24}/> }
                    onPress={() => {}}
                />              
                <DrawerItem
                    label={() => <Text style={globalStyles.Body}>Privacy Policy</Text>}
                    icon={() => <MaterialCommunityIcons name="shield-lock-outline" size={24}/> }
                    onPress={() => {}}
                />    

                <TouchableOpacity testID="LogOut.Button" style={styles.logOutBtn} onPress={handleLogOut}>
                    <Text style={styles.logOutBtnText}>Log Out</Text>
                </TouchableOpacity>

                <DrawerItemList {...props}/>
            </> }
        </DrawerContentScrollView>
    )
}

const DrawerTab = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>}>
            <Drawer.Screen 
                name="BottomTab" 
                component={BottomTab} 
                options={{
                    headerShown: false,
                    // drawerStyle: { width: "80%" },
                    drawerItemStyle: { height: 0 }
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerTab

const styles = StyleSheet.create({
    logOutBtn: {
        width: "50%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "#6A6A6A",
        marginRight: 10,
        marginLeft: 12
    },
    logOutBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
    deleteBtn: {
        title: "Login",
        width: "50%",
        borderRadius: 25,
        marginTop: 20,
        height: 50,
        alignItems: "center",
        backgroundColor: "red",
    },
    deleteBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
})