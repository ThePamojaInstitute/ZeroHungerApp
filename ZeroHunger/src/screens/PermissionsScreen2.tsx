import { View, Text, Image, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import styles from "../../styles/screens/permissionsStyleSheet";
import { updateNotificationsSettings } from "../controllers/notifications";
import { useTranslation } from "react-i18next";
import { storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePreferences } from "../controllers/preferences";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


export const PermissionsScreen2 = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { user, loading, dispatch } = useContext(AuthContext)
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function waitForUserSkip(totalTime, increment, currentTime)
    {
        console.log("delaying until user")
        dispatch;
        if (!user)
        {
            await delay(increment);
            currentTime += increment;
            if (totalTime >= currentTime)
            {
                waitForUserSkip(totalTime, increment, currentTime)
            }
            else
            {
                console.log("Done delaying, user now exists properly")
                navigation.navigate("HomeScreen")
                return;
            }
        }
        else
        {
            console.log("no delay, user already exists")
            navigation.navigate("HomeScreen")
            return;
        }


    }

    async function waitForUserSaved(totalTime, increment, currentTime)
    {
        console.log("delaying until user")
        dispatch;
        if (!user)
        {
            await delay(increment);
            currentTime += increment;
            if (totalTime >= currentTime)
            {
                waitForUserSkip(totalTime, increment, currentTime)
            }
            else
            {
                console.log("Done delaying, user now exists properly")
                updateNotificationsSettings(true, true)
                navigation.navigate("HomeScreen")
                return;
            }
        }
        else
        {
            console.log("no delay, user already exists")
            updateNotificationsSettings(true, true)
            navigation.navigate("HomeScreen")
            return;
        }


    }

    const onPress = async () => {
                //check user here
        if (Platform.OS === "web") {
            const appData = storage.getString("appLaunched")

                storage.set("appLaunched", "true")

                // updateNotificationsSettings(true, true)
              
                // if (user)
                //     {
                //         navigation.navigate("HomeScreen")
                //     }
                //     else
                //     {
                //         await delay(5000)
                //         navigation.navigate("HomeScreen")
                //     }
                    
                waitForUserSaved(15000, 100, 0)
        }
        else {
            const appData = await AsyncStorage.getItem("appLaunched")

                AsyncStorage.setItem("appLaunched", "true")
                // updateNotificationsSettings(true, true)
                // if (user)
                //     {
                //         navigation.navigate("HomeScreen")
                //     }
                //     else
                //     {
                //         await delay(5000)
                //         navigation.navigate("HomeScreen")
                //     }
                waitForUserSaved(15000, 100, 0)
        }
    }
    const onSkipPress = async () => {
        
        if (Platform.OS === "web") {
            const appData = storage.getString("appLaunched")

                storage.set("appLaunched", "true")
            //    //fix delays here
            //    if (user)
            //     {
            //         navigation.navigate("HomeScreen")
            //     }
            //     else
            //     {
            //         await delay(5000)
            //         navigation.navigate("HomeScreen")
            //     }
            waitForUserSkip(15000, 100, 0)
                
        }
        else {
            const appData = await AsyncStorage.getItem("appLaunched")

                AsyncStorage.setItem("appLaunched", "true")
                // if (user)
                //     {
                //         navigation.navigate("HomeScreen")
                //     }
                //     else
                //     {
                //         await delay(5000)
                //         navigation.navigate("HomeScreen")
                //     }
                waitForUserSkip(15000, 100, 0)
        }
      
        // if (user)
        //     {
        //         navigation.navigate("HomeScreen")
        //     }
        //     else
        //     {
        //         await delay(5000)
        //         navigation.navigate("HomeScreen")
        //     }
    }

    return (
        <View style={styles.view2}>
            
            <Image source={require('../../assets/Permissions2.png')} resizeMode="center" style={styles.image2} />
            <Text style={globalStyles.H2}>{t("permissions.notifications.heading")}</Text>
            <Text style={[globalStyles.Body, { paddingTop: 12, textAlign: "center" }]}>{t("permissions.notifications.text")}</Text>
            <View style={{ paddingTop: 24, paddingLeft: -4, paddingRight: -4 }}>
                <View style={{ marginTop: 48 }}>
                {loading &&
                            <><ActivityIndicator animating size="large" color={Colors.primary} />
                        <Text style={[globalStyles.Small1, { color: '#656565' }]}> Please wait a moment, we're getting things ready </Text></>
                        }   
                
                {!loading &&
                    <TouchableOpacity style={[globalStyles.defaultBtn, { width: 350 }]}
                        onPress={onPress}
                    >
                        <Text style={globalStyles.defaultBtnLabel}>{t("permissions.notifications.submit.label")}</Text>
                    </TouchableOpacity>
                }
                {!loading &&
                    <TouchableOpacity style={{ alignSelf: "center", paddingTop: 24 }}
                    onPress={onSkipPress}
                    >
                        <Text style={[globalStyles.Button, { color: Colors.primaryDark }]}>{t("permissions.notifications.alt.label")}</Text>
                    </TouchableOpacity>
                }   
                </View>
            </View>
        </View>
    )
}

export default PermissionsScreen2