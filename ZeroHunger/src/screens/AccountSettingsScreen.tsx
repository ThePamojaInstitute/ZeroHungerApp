import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/screens/accountSettingsStyleSheet"
import { AuthContext } from "../context/AuthContext";
import { logOutUser, deleteUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { editUser } from "../controllers/auth";

export const AccountSettingsScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const handleDeleteUser = () => {
        deleteUser(user['user_id'], accessToken).then(res => {
            if (res === "success") {
                logOutUser().then(() => {
                    dispatch({ type: "LOGOUT", payload: null })
                    alert!({ type: 'open', message: 'Account deleted successfully!', alertType: 'success' })
                    navigation.navigate('LoginScreen')
                }).catch(() => {
                    alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
                    console.log("log out error");
                })
            } else {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
                console.log(res);
            }
        })
    }

    const handleModifyUser = () => {
        var user = {
            "username": "testuser",
            "email": "test@testtest.com",
            "password": "test1",
            "confPassword": "test1"
        }
        editUser(accessToken, user);
    }

    return (
        <View testID="AccSett.container" style={{ padding: 50 }}>
            <Text>Temporary Account Settings Screen</Text>

            <TouchableOpacity
                testID="AccSett.editUserTestBtn"
                style={styles.deleteUserBtn}
                onPress={handleModifyUser}
            >
                <Text
                    testID="AccSett.deleteUserBtnText"
                    style={styles.deleteUserBtnText}
                >Test Modify User</Text>
            </TouchableOpacity>

            <TouchableOpacity
                testID="AccSett.deleteUserBtn"
                style={styles.deleteUserBtn}
                onPress={handleDeleteUser}
            >
                <Text
                    testID="AccSett.deleteUserBtnText"
                    style={styles.deleteUserBtnText}
                >Delete User</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AccountSettingsScreen
