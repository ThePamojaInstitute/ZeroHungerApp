import { Text, View, TouchableOpacity } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import styles from "../../../styles/screens/postFormStyleSheet"

export const AccSettingsFormCustomHeader = ({ navigation, title, handleModifyUser, handleSubmit }) => (
    <View style={{ backgroundColor: Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <TouchableOpacity
                    testID="Request.cancelBtn"
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: 10 }}
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
                <TouchableOpacity onPress={handleSubmit(handleModifyUser)} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
                    <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)