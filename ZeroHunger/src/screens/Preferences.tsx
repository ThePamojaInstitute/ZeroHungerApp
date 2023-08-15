import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import styles from "../../styles/screens/postFormStyleSheet"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import loginStyles from "../../styles/screens/loginStyleSheet"
import { useAlert } from "../context/Alert";
import { DIETREQUIREMENTS, LOGISTICS, getDietType, getLogisticsType, getPreferences, savePreferences } from "../controllers/preferences";
import { Char } from "../../types";
import Slider from "@react-native-community/slider";
import { getAccessToken } from "../../config";


export const Preferences = ({ navigation }) => {
    const { dispatch: alert } = useAlert()

    const [errMsg, setErrMsg] = useState("")
    const [postalCode, setPostalCode] = useState('')
    const [distance, setDistance] = useState(15)
    const [dietRequirements, setDietRequirements] = useState<Char[]>([])
    const [logistics, setLogistics] = useState<Char[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getAccessToken().then(token => {
            getPreferences(token).then(data => {
                setPostalCode(data['postalCode'])
                setDistance(data['distance'])
                setDietRequirements(data['diet'])
                setLogistics(data['logistics'])
            }).finally(() => setIsLoading(false)).catch(() => setIsLoading(false))
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
    }, [logistics, postalCode, dietRequirements, distance])


    const handleSave = async () => {
        const accessToken = await getAccessToken()

        const res = await savePreferences(postalCode, distance, dietRequirements, logistics, accessToken)
        if (res.msg === "success") {
            alert!({ type: 'open', message: 'Preferences updated successfully!', alertType: 'success' })
            navigation.navigate('HomeScreen', { reload: true })
            return
        } else if (res.res) {
            setErrMsg(res.res)
            return
        } else {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
            return
        }
    }

    const renderItem = (item: Char, state: Char[], setState: React.Dispatch<React.SetStateAction<Char[]>>, getter: (char: Char) => string) => {
        return (
            <View key={item} style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Text style={globalStyles.Body}>{getter(item)}</Text>
                <MaterialCommunityIcons
                    name={state.includes(item) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (state.includes(item)) {
                            setState(state.filter((char: Char) => char != item))
                        } else {
                            setState((oldArray: Char[]) => [...oldArray, item])
                        }
                    }}
                    style={{ position: 'absolute', right: 0 }}
                />
            </View>
        )
    }

    return (
        <ScrollView style={{ padding: 10, flex: 1, backgroundColor: Colors.offWhite }}>
            {!isLoading ?
                <>
                    <Text style={[globalStyles.H3, { marginBottom: 5, color: errMsg ? Colors.alert2 : Colors.dark }]}>Postal code</Text>
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
                    <Text style={[globalStyles.H3, { marginBottom: 5 }]}>Maximum distance away</Text>
                    <Text
                        style={[globalStyles.Small1, { color: Colors.primaryDark, marginBottom: 5 }]}>
                        This will be the default radius used to show requests and offers near you on your home feed.
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Slider
                            value={distance}
                            onValueChange={setDistance}
                            style={{ width: Dimensions.get('window').width * 0.8, height: 40, maxWidth: 500 }}
                            minimumValue={1}
                            maximumValue={30}
                            step={1}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor="#B8B8B8"
                            thumbTintColor="#ffffff"
                        />
                        <Text style={[globalStyles.Body, { marginLeft: 5, marginTop: 8 }]}>{Math.round(distance * 10) / 10} km</Text>
                    </View>
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
                </> :
                <ActivityIndicator animating size="large" color={Colors.primary} />
            }
        </ScrollView>
    )
}

export default Preferences
