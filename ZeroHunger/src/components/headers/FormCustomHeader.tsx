import { Text, View, TouchableOpacity, Platform } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import styles from "../../../styles/screens/postFormStyleSheet"

export const FormCustomHeader = ({ navigation, title, useDefaultPostal, setUseDefaultPostal, defaultPostalCode, setError, handleSubmit, handlePress }) => (
    <View style={{ backgroundColor: Colors.Background }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <TouchableOpacity
                    testID="Request.cancelBtn"
                    onPress={() => navigation.navigate('HomeScreen')}
                    style={Platform.OS === 'web' ? { marginLeft: 10 } : {}}
                >
                    <Text
                        testID="Request.cancelBtnLabel"
                        style={styles.formCancelBtn}
                    >Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={globalStyles.H4}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => {
                        if (useDefaultPostal && !defaultPostalCode) {
                            setError('postalCode', {
                                type: 'validation',
                                message: "You don't have a default postal code. Please enter a valid one"
                            })
                            setUseDefaultPostal(false)
                            return
                        }

                        handleSubmit(handlePress)()
                    }}
                    testID="Request.createBtn"
                    style={globalStyles.navDefaultBtn}
                >
                    <Text
                        testID="Request.createBtnLabel"
                        style={globalStyles.defaultBtnLabel}
                    >Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)