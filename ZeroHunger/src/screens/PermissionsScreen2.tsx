import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import styles from "../../styles/screens/permissionsStyleSheet";
import { updateNotificationsSettings } from "../controllers/notifications";
import { useTranslation } from "react-i18next";

export const PermissionsScreen2 = ({ navigation }) => {
    const { t, i18n } = useTranslation();

    const onPress = () => {
        updateNotificationsSettings(true, true)
        navigation.navigate("HomeScreen")
    }

    return (
        <View style={styles.view}>
            <Image source={require('../../assets/Permissions2.jpg')} resizeMode="center" style={styles.image}/>
            <Text style={globalStyles.H2}>{t("permissions.notifications.heading")}</Text>
            <Text style={[globalStyles.Body, { paddingTop: 12, textAlign: "center" }]}>{t("permissions.notifications.text")}</Text>
            <View style={{ paddingTop: 24, paddingLeft: -4, paddingRight: -4 }}>
                <View style={{ marginTop: 48 }}>
                    <TouchableOpacity style={[globalStyles.defaultBtn, { width: 350, padding: 12 }]}
                        onPress={onPress}
                    >
                        <Text style={globalStyles.defaultBtnLabel}>{t("permissions.notifications.submit.label")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignSelf: "center", paddingTop: 24 }} 
                        onPress={() => navigation.navigate("HomeScreen")}
                    >
                        <Text style={[globalStyles.Button, { color: Colors.primaryDark }]}>{t("permissions.notifications.alt.label")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PermissionsScreen2