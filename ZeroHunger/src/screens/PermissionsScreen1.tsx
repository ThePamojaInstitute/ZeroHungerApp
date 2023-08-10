import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { useState, useEffect } from "react";
import styles from "../../styles/screens/permissionsStyleSheet";
import postalStyles from "../../styles/screens/postFormStyleSheet"

export const PermissionsScreen1 = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        })
    })

    const [postalCode, setPostalCode] = useState('')
    const [errMsg, setErrMsg] = useState("")

    return (
        <View>
            {loaded && <>
                <View style={styles.view}>
                    <Image source={require('../../assets/Placeholder.png')} resizeMode="center" style={styles.image}/>
                    <Text style={[globalStyles.H2, styles.title]}>
                        Where would you like to exchange food?
                    </Text>
                    <Text style={[globalStyles.Body, styles.body]}>
                        We'll show you requests and offers based on your location. No other users will see your location.
                    </Text>
                    
                    <View testID="Request.formInputContainer" style={[postalStyles.formInputContainer, {paddingTop: 12}]}>
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

                    <TouchableOpacity>
                        
                    </TouchableOpacity>
                </View>
            </>}
        </View>
    )
}

export default PermissionsScreen1