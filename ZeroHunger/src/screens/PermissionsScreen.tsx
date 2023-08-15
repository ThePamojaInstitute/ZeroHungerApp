import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState } from "react";
import styles from "../../styles/screens/permissionsStyleSheet";
import postalStyles from "../../styles/screens/postFormStyleSheet"
import loginStyles from "../../styles/screens/loginStyleSheet"
import { savePreferences } from "../controllers/preferences";

export const PermissionsScreen = ({ navigation }) => {
    const { accessToken } = useContext(AuthContext);

    const [postalCode, setPostalCode] = useState('')
    const [errMsg, setErrMsg] = useState("")

    const savePostalCode = async () => {
        savePreferences(postalCode, null, null, accessToken).then(res => {
            if (res.msg === "success") {
                navigation.navigate('HomeScreen')
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
        <View>
            <View style={styles.view}>
                <Image source={require('../../assets/Placeholder.png')} resizeMode="center" style={styles.image} />
                <Text style={[globalStyles.H2, styles.title]}>
                    Where would you like to exchange food?
                </Text>
                <Text style={[globalStyles.Body, styles.body]}>
                    We'll show you requests and offers based on your location. No other users will see your location.
                </Text>

                <View testID="Request.formInputContainer" style={[postalStyles.formInputContainer, { paddingTop: 12 }]}>
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
                        style={[globalStyles.defaultBtn, { padding: 12 }]}
                        onPress={savePostalCode}
                    >
                        <Text style={globalStyles.defaultBtnLabel}>Continue</Text>
                    </TouchableOpacity>
                    {errMsg && <Text style={loginStyles.errorMsg}>{errMsg}</Text>}
                </View>
            </View>
        </View>
    )
}

export default PermissionsScreen