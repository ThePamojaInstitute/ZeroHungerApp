import { useContext, useState, useEffect  } from "react";
import {   Text,
    View,
    TextInput,
    TouchableOpacity,
    GestureResponderEvent,
    NativeSyntheticEvent,
    TextInputSubmitEditingEventData,
    Keyboard } from "react-native";
import styles from "../../styles/screens/accountSettingsStyleSheet"
import { AuthContext } from "../context/AuthContext";
import { logOutUser, deleteUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { editUser } from "../controllers/auth";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { useTranslation } from "react-i18next";


export const AccountSettingsScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [errField, setErrField] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const {t, i18n} = useTranslation();
    
    //copied from account creation screen
    const handleErrorMessage = (error: string) => {
        if (error.toLowerCase().includes('username')) {
          setErrField('username')
          setErrMsg("Invalid username")
          if (error.toLowerCase().includes('unique'))  {
            setErrField('username')
            setErrMsg("This username is already in use")
          }
        } else if (error.toLowerCase().includes('email')) {
          setErrField('email')
          setErrMsg("Invalid email")
          if (error.toLowerCase().includes('unique'))  {
            setErrField('email')
            setErrMsg("This email is already in use")
          }

        } else {
          alert!({ type: 'open', message: error, alertType: 'error' })
        }
      }

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

    const handleModifyUser = ()  => {
        console.log("Trying to modify user")
        var user = {
            "username": username,
            "email": email,
        }
        editUser(accessToken, user).then(res => {
          if (res.msg === "success") {
            dispatch({ type: "CHANGEPROFILE_SUCCESS", payload: res.res })
            alert!({ type: 'open', message: 'Modified Profile Successfully!', alertType: 'success' })
          } else if (res.msg === "failure") {
            dispatch({ type: "CHANGEPROFILE_FAILURE", payload: res.res })
            const error = res.res;
            handleErrorMessage(error)
          } else {
            dispatch({ type: "CHANGEPROFILE_FAILURE", payload: res.res })
            const error = res.msg ? res.msg : "An error occurred"
            handleErrorMessage(error)
          }
        })
      }


    useEffect(() => {

        var uname = user ? user['username'] : "username"
     //   console.log(uname)
        setUsername(uname)

    }, [])
   

    return (
        // <View testID="AccSett.container" style={{ padding: 50 }}>
        //     <Text>Temporary Account Settings Screen</Text>
        //     <Text> Change your account's email</Text>
        //     <TextInput
        //       nativeID="accountSetting.emailInput"
        //       testID="accountSetting.emailInput"
        //       secureTextEntry={false}
        //       onChangeText={newText => {
        //         setEmail(newText)}}
        //     />
        //      <Text> Change your account's username </Text>
        //      <TextInput
        //       nativeID="accountSetting.usernameInput"
        //       testID="accountSetting.usernameInput"
        //       secureTextEntry={false}
        //       onChangeText={newText => {
        //         setUsername(newText)}}
        //       defaultValue= {user ? user['username'] : "User"}
        //     />


        // </View>
    

    <View>
        {(errField === 'username') &&
            <View testID="SignUp.usernameErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.usernameErrMsg" style={styles.errorMsg}>{errMsg}</Text>
            </View>}
        <View testID="SignUp.usernameInputContainer" style={styles.inputContainer}>
        <Text testID="SignUp.usernameLabel" style={[styles.inputLabel,
        { color: `${(errField === 'username') ? Colors.alert2 : Colors.dark}` }]}
        > {t("account.signup.user.label")} </Text>
        <TextInput
          nativeID="SignUp.usernameInput"
          testID="SignUp.usernameInput"
          style={[styles.input,
          { borderColor: `${(errField === 'username') ? Colors.alert2 : Colors.midLight}` }]}
          onChangeText={newText => {
            setUsername(newText)
            setErrField('')
          }}
          onChange={() => { if (errField === 'username') setErrField('') }}
          blurOnSubmit={false}
          maxLength={64}
          defaultValue= {user ? user['username'] : "User"}
          
        />
        </View>
        {(errField === 'email') &&
            <View testID="SignUp.emailErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.emailErrMsg" style={styles.errorMsg}>{errMsg}</Text>
            </View>}
      <View testID="SignUp.emailInputContainer" style={styles.inputContainer}>
        <Text testID="SignUp.emailLabel" style={[styles.inputLabel,
        { color: `${(errField === 'email') ? Colors.alert2 : Colors.dark}` }]}
        > {t("account.signup.email.label")} </Text>
        <TextInput
          nativeID="SignUp.emailInput"
          testID="SignUp.emailInput"
          style={[styles.input, { borderColor: `${(errField === 'email') ? Colors.alert2 : Colors.midLight}` }]}
          secureTextEntry={false}
          onChangeText={newText => {
            setEmail(newText)
            setErrField('')
          }}
          onChange={() => { if (errField === 'email') setErrField('') }}
          blurOnSubmit={false}
        />
      </View>
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
