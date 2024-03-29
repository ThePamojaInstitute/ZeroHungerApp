import { View, Text, Image, TouchableOpacity, TextInput, Platform } from "react-native";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState } from "react";
import styles from "../../styles/screens/permissionsStyleSheet";
import postalStyles from "../../styles/screens/postFormStyleSheet"
import loginStyles from "../../styles/screens/loginStyleSheet"
import { savePreferences } from "../controllers/preferences";
import { useAlert } from "../context/Alert";

export const PermissionsScreen = ({ navigation }) => {
    const { dispatch: alert } = useAlert()

    const [postalCode, setPostalCode] = useState('')
    const [errMsg, setErrMsg] = useState("")

    const savePostalCode = async () => {
        savePreferences(postalCode, null, null, null).then(res => {
            if (res.msg === "success") {
                navigation.navigate('GuidelinesScreen')
                return
            } else if (res.res) {
                setErrMsg(res.res)
                return
            } else {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
                return
            }
        })
    }

    return (
        <View style={{ backgroundColor: Colors.offWhite }}>
            <View style={[styles.view, Platform.OS === 'web' ? styles.alignWidth : {}]}>
                <Image source={require('../../assets/Permissions.png')} resizeMode="center" style={styles.image} />
                <Text style={[globalStyles.H2, { textAlign: 'center' }]}>See food offers and requests in your area</Text>
                <Text style={[globalStyles.Body, { paddingTop: 12, textAlign: 'center' }]}>We'll show you requests and offers based on your postal code.</Text>
                <View style={{ paddingTop: 24, paddingLeft: -4, paddingRight: -4 }}>
                    <Text style={[globalStyles.H4, { color: !!errMsg ? Colors.alert2 : Colors.dark }]}>Your postal code</Text>
                    <Text style={[globalStyles.Small1, { color: Colors.midDark, paddingTop: 8 }]}>
                        Other people will only see an estimate of how far away your postal code is from theirs {'('}i.e., 5 km away{')'}
                    </Text>
                    {errMsg && <Text style={[loginStyles.errorMsg, { paddingTop: 8 }]}>{errMsg}</Text>}
                    <View testID="Request.formInputContainer" style={[postalStyles.formInputContainer, { paddingTop: 12, height: 50 }]}>
                        <TextInput
                            value={postalCode}
                            nativeID="postalCode"
                            testID="Request.postalCodeInput"
                            placeholder="XXX XXX"
                            placeholderTextColor="#656565"
                            style={[postalStyles.formInput, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                            onChangeText={newText => {
                                setPostalCode(newText)
                                setErrMsg("")
                            }}
                            onChange={() => setErrMsg("")}
                            maxLength={7}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={[globalStyles.defaultBtn, { width: "100%" }]}
                            onPress={savePostalCode}
                        >
                            <Text style={globalStyles.defaultBtnLabel}>Save my postal code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignSelf: "center", paddingTop: 24 }} onPress={() => navigation.navigate("GuidelinesScreen")}>
                            <Text style={[globalStyles.Button, { color: Colors.primaryDark }]}>Not right now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PermissionsScreen