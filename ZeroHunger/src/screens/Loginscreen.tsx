import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  GestureResponderEvent,
  Linking,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Pressable,
  Keyboard
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import jwt_decode from "jwt-decode";
import {
  useFonts,
  PublicSans_600SemiBold,
  PublicSans_500Medium,
  PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Ionicons } from '@expo/vector-icons';
import NotificationsTest from "./NotificationsTest";

export const LoginScreen = ({ navigation }) => {
  const [loaded, setLoaded] = useState(false)
  let [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold
  })

  useEffect(() => {
    setLoaded(fontsLoaded)
  }, [fontsLoaded])

  const password_input = useRef<TextInput | null>(null)

  const { user, loading, dispatch } = useContext(AuthContext)
  const { dispatch: alert } = useAlert()

  useFocusEffect(() => {
    if (user) {
      navigation.navigate('HomeScreen')
    }
  })

  useEffect(() => {
    if (user) {
      navigation.navigate('HomeScreen')
    }
  }, [])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [hidePass, setHidePass] = useState(true)
  const [errMsg, setErrMsg] = useState("")
  const [errField, setErrField] = useState("")
  const [expoPushToken, setExpoPushToken] = useState("");

  const handleErrorMessage = (error: string) => {
    if (error.toLowerCase() === "invalid credentials") {
      setErrField('general')
      setErrMsg(error)
    } else if (error.toLowerCase().includes('username')) {
      setErrField('username')
      setErrMsg(error)
    } else if (error.toLowerCase().includes('password')) {
      setErrField('password')
      setErrMsg(error)
    } else {
      alert!({ type: 'open', message: error, alertType: 'error' })
    }
  }

  const handleLogin = (e: (GestureResponderEvent |
    NativeSyntheticEvent<TextInputSubmitEditingEventData>)) => {
    e.preventDefault()
    Keyboard.dismiss()
    dispatch({ type: "LOGIN_START", payload: null })
    logInUser({ "username": username, "password": password, "expo_push_token": expoPushToken }).then(async res => {
      if (res.msg === "success") {
        await axiosInstance.post("users/token/", { "username": username, "password": password }).then(resp => {
          dispatch({
            type: "LOGIN_SUCCESS", payload: {
              "user": jwt_decode(resp.data['access']),
              "token": resp.data
            }
          })
        }).then(() => {
          setUsername("")
          setPassword("")
          // alert!({ type: 'open', message: 'You are logged in!', alertType: 'success' })
          navigation.navigate('HomeScreen')
        })
      } else if (res.msg === "failure") {
        dispatch({ type: "LOGIN_FAILURE", payload: res.res })
        handleErrorMessage('Invalid credentials')
        // alert!({ type: 'open', message: 'Invalid credentials', alertType: 'error' })
        setUsername("")
        setPassword("")
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: res.res })
        const error = res.msg ? res.msg : "An error occurred"
        handleErrorMessage(error)
      }
    })
  }

  const handlePasswordRecovery = () => {
    Linking.canOpenURL("zh-backend-azure-webapp.azurewebsites.net/users/reset_password/").then(supported => {
      if (supported) {
        Linking.openURL("zh-backend-azure-webapp.azurewebsites.net/users/reset_password/");
      } else {
        console.log("Cannot open URL: " + "zh-backend-azure-webapp.azurewebsites.net/users/password-reset/");
      }
    })  //replace this with actual URL later
  }

  return (
    <View testID="Login.container" style={styles.container}>
      {!loaded && <Text>Loading...</Text>}
      {loaded &&
        <>
          <Text>{loading && "Loading..."}</Text>
          {(errField === 'general') &&
            <View>
              <Text style={[globalStyles.errorMsg, { fontSize: 16 }]}>{errMsg}</Text>
            </View>}
          <View testID="Login.usernameInputContainer" style={globalStyles.inputContainer}>
            <Text testID="Login.usernameLabel" style={[globalStyles.inputLabel,
            { color: `${(errField === 'username') ? Colors.alert2 : Colors.dark}` }]}>Username</Text>
            <TextInput
              nativeID="Login.usernameInput"
              testID="Login.usernameInput"
              value={username}
              style={[globalStyles.input,
              { borderColor: `${(errField === 'username') ? Colors.alert2 : Colors.midLight}` }]}
              onChangeText={newText => {
                setUsername(newText)
                setErrField('')
              }}
              onChange={() => {
                if (errField === 'username' || errField === 'general') {
                  setErrField('')
                }
              }}
              blurOnSubmit={false}
              onSubmitEditing={() => password_input.current?.focus()}
            />
          </View>
          {(errField === 'username') &&
            <View testID="Login.usernameErrMsgContainer" style={globalStyles.errorMsgContainer}>
              <Text testID="Login.usernameErrMsg" style={globalStyles.errorMsg}>{errMsg}</Text>
            </View>}
          <View testID="Login.passwordInputContainer" style={globalStyles.inputContainer}>
            <Text testID="Login.passwordLabel" style={[globalStyles.inputLabel,
            { color: `${(errField === 'password') ? Colors.alert2 : Colors.dark}` }]}>Password</Text>
            <View testID="Login.innerPasswordInputContainer" style={[globalStyles.passwordInputContainer,
            { borderColor: `${(errField === 'password') ? Colors.alert2 : Colors.midLight}` }]}>
              <TextInput
                nativeID="Login.passwordInput"
                testID="Login.passwordInput"
                value={password}
                style={globalStyles.passwordInput}
                secureTextEntry={hidePass}
                onChangeText={newText => {
                  setPassword(newText)
                  setErrField('')
                }}
                onChange={() => {
                  if (errField === 'password' || errField === 'general') {
                    setErrField('')
                  }
                }}
                ref={password_input}
                blurOnSubmit={false}
                onSubmitEditing={handleLogin}
              />
              <Ionicons testID="eyeIcon" name={hidePass ? "eye-off-outline" : "eye-outline"} size={22} onPress={() => setHidePass(!hidePass)} style={{ padding: 9 }} />
            </View>
          </View>
          {(errField === 'password') &&
            <View testID="Login.passwordErrMsgContainer" style={globalStyles.errorMsgContainer}>
              <Text testID="Login.passwordErrMsg" style={globalStyles.errorMsg}>{errMsg}</Text>
            </View>}
          <Pressable style={{ width: '90%' }} testID="passwordReset.Button" onPress={handlePasswordRecovery}>
            <Text testID="Login.forgotPassword" style={globalStyles.forgotPassword}>Forgot password?</Text>
          </Pressable>
          <TouchableOpacity testID="Login.Button" style={globalStyles.defaultBtn} onPress={handleLogin}>
            <Text testID="Login.ButtonLabel" style={globalStyles.defaultBtnLabel}>Login</Text>
          </TouchableOpacity>
          <View testID="divider" style={styles.divider}>
            <View testID="dividerLine1" style={styles.dividerLine} />
            <View>
              <Text testID="dividerText" style={styles.dividerText}>OR</Text>
            </View>
            <View testID="dividerLine2" style={styles.dividerLine} />
          </View>
          <TouchableOpacity testID="SignUp.Button" style={globalStyles.outlineBtn} onPress={() => {
            setErrField('')
            setErrMsg('')
            setUsername('')
            setPassword('')
            navigation.navigate("CreateAccountScreen")
          }}>
            <Text testID="SignUp.ButtonLabel" style={globalStyles.outlineBtnLabel}>Sign Up</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity testID="RequestFromNav.Button" style={globalStyles.secondaryBtn} onPress={() => navigation.navigate("RequestFormScreen")}>
            <Text style={globalStyles.secondaryBtnLabel}>Add a Request</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="RequestFromNav.Button" style={globalStyles.secondaryBtn} onPress={() => navigation.navigate("OfferFormScreen")}>
            <Text style={globalStyles.secondaryBtnLabel}>Add an Offer</Text>
          </TouchableOpacity> */}
          {/* <NotificationsTest setExpoToken={setExpoPushToken} /> */}
        </>
      }
      {/* <Button
        onPress={() =>
          alert!({ type: 'open', message: 'Sample', alertType: 'success' })
        }>
        Show Snackbar
      </Button> */}
    </View>
  );
}
export default LoginScreen


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFF1F7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 0,
    gap: 10,
    marginTop: 20,
    marginBottom: -10
  },
  dividerLine: {
    height: 1,
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B8B8B8',
  },
  dividerText: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    color: Colors.dark
  }
});