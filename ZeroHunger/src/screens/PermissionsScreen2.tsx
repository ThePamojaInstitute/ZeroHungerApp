import { View, Text, Image, TouchableOpacity, TextInput, Platform } from "react-native";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import styles from "../../styles/screens/permissionsStyleSheet";
import { updateNotificationsSettings } from "../controllers/notifications";
import { useTranslation } from "react-i18next";
import { storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePreferences } from "../controllers/preferences";


export const PermissionsScreen2 = ({ navigation }) => {
    const { t, i18n } = useTranslation();

    const onPress = async () => {

        if (Platform.OS === "web") {
            const appData = storage.getString("appLaunched")

                storage.set("appLaunched", "true")
                updateNotificationsSettings(true, true)
                navigation.navigate("HomeScreen")

        }
        else {
            const appData = await AsyncStorage.getItem("appLaunched")

                AsyncStorage.setItem("appLaunched", "true")
                updateNotificationsSettings(true, true)
                navigation.navigate("HomeScreen")
        }
    }
    const onSkipPress = async () => {
        
        if (Platform.OS === "web") {
            const appData = storage.getString("appLaunched")

                storage.set("appLaunched", "true")
                navigation.navigate("HomeScreen")

        }
        else {
            const appData = await AsyncStorage.getItem("appLaunched")

                AsyncStorage.setItem("appLaunched", "true")
                navigation.navigate("HomeScreen")
        }
            
        navigation.navigate("HomeScreen")
    }

    return (
        <View style={styles.view2}>
            <Image source={require('../../assets/Permissions2.png')} resizeMode="center" style={styles.image2} />
            <Text style={globalStyles.H2}>{t("permissions.notifications.heading")}</Text>
            <Text style={[globalStyles.Body, { paddingTop: 12, textAlign: "center" }]}>{t("permissions.notifications.text")}</Text>
            <View style={{ paddingTop: 24, paddingLeft: -4, paddingRight: -4 }}>
                <View style={{ marginTop: 48 }}>
                    <TouchableOpacity style={[globalStyles.defaultBtn, { width: 350 }]}
                        onPress={onPress}
                    >
                        <Text style={globalStyles.defaultBtnLabel}>{t("permissions.notifications.submit.label")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignSelf: "center", paddingTop: 24 }}
                        onPress={onSkipPress}
                    >
                        <Text style={[globalStyles.Button, { color: Colors.primaryDark }]}>{t("permissions.notifications.alt.label")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PermissionsScreen2