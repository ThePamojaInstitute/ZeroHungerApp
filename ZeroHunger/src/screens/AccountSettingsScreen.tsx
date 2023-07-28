import { useContext, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styles from "../../styles/screens/accountSettingsStyleSheet"
import { AuthContext } from "../context/AuthContext";
import { logOutUser, deleteUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { editUser } from "../controllers/auth";

export const AccountSettingsScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    

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
            "username": username,
            "email": email,
        }
        editUser(accessToken, user);
    }

    return (
        <View testID="AccSett.container" style={{ padding: 50 }}>
            <Text>Temporary Account Settings Screen</Text>
            <Text> Change your account's email</Text>
            <TextInput
              nativeID="accountSetting.emailInput"
              testID="accountSetting.emailInput"
              secureTextEntry={false}
              onChangeText={newText => {
                setEmail(newText)}}
            />
             <Text> Change your account's username </Text>
             <TextInput
              nativeID="accountSetting.usernameInput"
              testID="accountSetting.usernameInput"
              secureTextEntry={false}
              onChangeText={newText => {
                setUsername(newText)}}
                placeholder={user ? user['username'] : "User"}
            />

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
