import { Text, View, TouchableOpacity, Platform } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import styles from "../../../styles/screens/postFormStyleSheet"

export const GuidLinesCustomHeader = ({ navigation, title, }) => (
    <View style={{ backgroundColor: Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <TouchableOpacity
                    testID="Request.cancelBtn"
                    onPress={() => navigation.goBack()}
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
                <View style={{ marginRight: 12 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("PermissionsScreen2") }}>
                        <Text style={globalStyles.Body}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
)