import { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import styles from "../../styles/screens/postFormStyleSheet"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import loginStyles from "../../styles/screens/loginStyleSheet"
import { useAlert } from "../context/Alert";
import { DIETREQUIREMENTS, LOGISTICS, getDietType, getLogisticsType, getPreferences, savePreferences } from "../controllers/preferences";

export const Preferences = ({ navigation }) => {
    const { user, accessToken } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const [errMsg, setErrMsg] = useState("")
    const [postalCode, setPostalCode] = useState('')
    const [dietRequirements, setDietRequirements] = useState<number[]>([])
    const [logistics, setLogistics] = useState<number[]>([])

    useEffect(() => {
        getPreferences(accessToken).then(data => {
            setPostalCode(data['postalCode'])
            setDietRequirements(data['diet'])
            setLogistics(data['logistics'])
        })
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
                    <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}>Save</Text>
                </TouchableOpacity>
            )
        })
    }, [logistics, postalCode, dietRequirements])


    const handleSave = async () => {
        savePreferences(postalCode, dietRequirements, logistics, accessToken).then(res => {
            if (res.msg === "success") {
                alert!({ type: 'open', message: 'Preferences updated successfully!', alertType: 'success' })
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

    const renderItem = (item: number, state: number[], setState: React.Dispatch<React.SetStateAction<number[]>>, getter: (num: number) => string) => {
        return (
            <View key={item} style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Text style={globalStyles.Body}>{getter(item)}</Text>
                <MaterialCommunityIcons
                    name={state.includes(item) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (state.includes(item)) {
                            setState(state.filter((num: number) => num != item))
                        } else {
                            setState((oldArray: number[]) => [...oldArray, item])
                        }
                    }}
                    style={{ position: 'absolute', right: 0 }}
                />
            </View>
        )
    }

    return (
        <ScrollView style={{ padding: 10, flex: 1, backgroundColor: Colors.offWhite }}>
            <Text style={[globalStyles.H3, { marginBottom: 5 }]}>Postal code</Text>
            <Text
                style={[globalStyles.Small1, { color: Colors.primaryDark, marginBottom: 5 }]}>
                This will be your default postal code when you make a new offer or request.{"\n\n"}
                It will also be used to show requests and offers near you on your home feed, if you have opted out of using your current location.
            </Text>
            <View testID="Request.formInputContainer" style={styles.formInputContainer}>
                <TextInput
                    value={postalCode}
                    nativeID="postalCode"
                    testID="Request.postalCodeInput"
                    placeholder="XXX XXX"
                    placeholderTextColor="#656565"
                    style={[styles.formInput, { borderColor: errMsg ? Colors.alert2 : Colors.midLight }]}
                    onChangeText={newText => {
                        setPostalCode(newText)
                        setErrMsg("")
                    }}
                    onChange={() => setErrMsg("")}
                    maxLength={7}
                />
            </View>
            {errMsg && <Text style={loginStyles.errorMsg}>{errMsg}</Text>}
            <Text style={[globalStyles.H3, { marginBottom: 5, marginTop: 10 }]}>Dietary requirements</Text>
            <Text
                style={[globalStyles.Small1, { color: Colors.primaryDark, marginBottom: 5 }]}>
                These will be applied by as a default filter on your home feed, and as the default settings when you make a new offer or request.
            </Text>
            <View>
                {Object.keys(DIETREQUIREMENTS).map(value => {
                    return renderItem(DIETREQUIREMENTS[value], dietRequirements, setDietRequirements, getDietType)
                })}
            </View>
            <Text style={[globalStyles.H3, { marginBottom: 5, marginTop: 10 }]}>Pick up / Delivery</Text>
            <Text
                style={[globalStyles.Small1, { color: Colors.primaryDark, marginBottom: 5 }]}>
                These will be applied by as a default filter on your home feed, and as the default settings when you make a new offer or request.
            </Text>
            <View style={{ marginBottom: 25 }}>
                {Object.keys(LOGISTICS).map(value => {
                    return renderItem(LOGISTICS[value], logistics, setLogistics, getLogisticsType)
                })}
            </View>
        </ScrollView>
    )
}

export default Preferences
