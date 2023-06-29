import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { logOutUser, deleteUser } from "../controllers/auth";

export const AccountSettingsScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext);

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

    return (
        <View style={{ padding: 50 }}>
            <Text>Temporary Account Settings Screen</Text>
            <TouchableOpacity testID="DeleteUser.Button" style={styles.deleteBtn} onPress={handleDeleteUser}>
                <Text style={styles.deleteBtnText}>Delete User</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AccountSettingsScreen

const styles = StyleSheet.create({
    deleteBtn: {
        title: "Login",
        width: "50%",
        borderRadius: 25,
        marginTop: 20,
        height: 50,
        alignItems: "center",
        backgroundColor: "red",
    },
    deleteBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
})