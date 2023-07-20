import React, { useContext, useEffect, useRef, useState, Suspense } from "react";

import {
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
import styles from "../../styles/screens/loginStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { axiosInstance, passwordResetURL } from "../../config";
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
import { useTranslation } from "react-i18next";
import { any } from "jest-mock-extended";

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
    logInUser({
      "username": username,
      "password": password,
      "expo_push_token": expoPushToken
    })
      .then(async res => {
        if (res.msg === "success") {
          await axiosInstance.post("users/token/",
            { "username": username, "password": password })
            .then(resp => {
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
    Linking.canOpenURL(passwordResetURL).then(supported => {
      if (supported) {
        Linking.openURL(passwordResetURL);
      } else {
        console.log(`Cannot open URL: ${passwordResetURL}`);
      }
    })  //replace this with actual URL later
  }
  
  const {t, i18n} = useTranslation();
  console.log( )

  return (
    <View testID="Login.container" style={styles.authContainer}>
      {!loaded && <Text>Loading...</Text>}
      {loaded &&
        <>
          <Text>{loading && "Loading..."}</Text>
          {(errField === 'general') &&
            <View>
              <Text style={[styles.errorMsg, { fontSize: 16 }]}>{errMsg}</Text>
            </View>}
          <View testID="Login.usernameInputContainer" style={styles.inputContainer}>
            <Text testID="Login.usernameLabel" style={[styles.inputLabel,
            { color: `${(errField === 'username') ? Colors.alert2 : Colors.dark}` }]}>{t("account.signin.username.label")} </Text>
            <TextInput
              nativeID="Login.usernameInput"
              testID="Login.usernameInput"
              value={username}
              style={[styles.input,
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
            <View testID="Login.usernameErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="Login.usernameErrMsg" style={styles.errorMsg}>{errMsg}</Text>
            </View>}
          <View testID="Login.passwordInputContainer" style={styles.inputContainer}>
            <Text testID="Login.passwordLabel" style={[styles.inputLabel,
            { color: `${(errField === 'password') ? Colors.alert2 : Colors.dark}` }]}> {t("account.signin.pass.label")} </Text>
            <View testID="Login.innerPasswordInputContainer" style={[styles.passwordInputContainer,
            { borderColor: `${(errField === 'password') ? Colors.alert2 : Colors.midLight}` }]}>
              <TextInput
                nativeID="Login.passwordInput"
                testID="Login.passwordInput"
                value={password}
                style={styles.passwordInput}
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
              <Ionicons testID="eyeIcon"
                name={hidePass ? "eye-off-outline" : "eye-outline"}
                size={22}
                onPress={() => setHidePass(!hidePass)}
                style={{ padding: 9 }} />
            </View>
          </View>
          {(errField === 'password') &&
            <View testID="Login.passwordErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="Login.passwordErrMsg" style={styles.errorMsg}>{errMsg}</Text>
            </View>}
          <Pressable style={{ width: '90%' }} testID="passwordReset.Button" onPress={handlePasswordRecovery}>
            <Text testID="Login.forgotPassword" style={styles.forgotPassword}> {t("account.signin.passForgot.label")} </Text>
          </Pressable>
          <TouchableOpacity testID="Login.Button" style={globalStyles.defaultBtn} onPress={handleLogin}>
            <Text testID="Login.ButtonLabel" style={globalStyles.defaultBtnLabel}> {t("account.signin.submit.label")} </Text>
          </TouchableOpacity>
          <View testID="divider" style={styles.divider}>
            <View testID="dividerLine1" style={styles.dividerLine} />
            <View>
              <Text testID="dividerText" style={styles.dividerText}> { t("account.signin.or") } </Text>
            </View>
            <View testID="dividerLine2" style={styles.dividerLine} />
          </View>
          <TouchableOpacity testID="SignUp.Button" style={globalStyles.outlineBtn} onPress={() => {
            setErrField('')
            setErrMsg('')
            setUsername('')
            setPassword('')
            console.log(navigation)
            navigation.navigate("CreateAccountScreen")
          }}>
            <Text testID="SignUp.ButtonLabel" style={globalStyles.outlineBtnLabel}> Sign up </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity testID="RequestFromNav.Button" style={globalStyles.secondaryBtn} onPress={() => navigation.navigate("RequestFormScreen")}>
            <Text style={globalStyles.secondaryBtnLabel}>Add a Request</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="RequestFromNav.Button" style={globalStyles.secondaryBtn} onPress={() => navigation.navigate("OfferFormScreen")}>
            <Text style={globalStyles.secondaryBtnLabel}>Add an Offer</Text>
          </TouchableOpacity> */}
          <NotificationsTest setExpoToken={setExpoPushToken} />

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

export default function WrappedLoginScreen()
{
  return (
    <Suspense fallback="Loading">
      <LoginScreen navigation={any} />
    </Suspense>
  )
}
