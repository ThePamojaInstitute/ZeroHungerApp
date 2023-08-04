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
  Keyboard,
  Platform
} from "react-native";
import styles from "../../styles/screens/loginStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { axiosInstance, passwordResetURL, setTokens, storage } from "../../config";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import jwt_decode from "jwt-decode";
import { Ionicons } from '@expo/vector-icons';
import NotificationsTest from "./NotificationsTest";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { LoginUserFormData } from "../../types";

export const LoginScreen = ({ navigation }) => {
  const password_input = useRef<TextInput | null>(null)
  const { user, loading, dispatch } = useContext(AuthContext)
  const { dispatch: alert } = useAlert()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserFormData>();

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

  const [hidePass, setHidePass] = useState(true)
  const [errMsg, setErrMsg] = useState("")
  const [expoPushToken, setExpoPushToken] = useState("");

  const handleErrorMessage = (error: string) => {
    if (error.toLowerCase() === "invalid credentials") {
      setErrMsg(error)
    } else {
      alert!({ type: 'open', message: error, alertType: 'error' })
    }
  }

  const handleLogin = (data: object, e: (GestureResponderEvent |
    NativeSyntheticEvent<TextInputSubmitEditingEventData>)) => {
    e.preventDefault()
    Keyboard.dismiss()
    dispatch({ type: "LOGIN_START", payload: null })
    logInUser({
      "username": data['username'].toLowerCase(),
      "password": data['password'],
      "expo_push_token": expoPushToken
    })
      .then(async res => {
        if (res.msg === "success") {
          await axiosInstance.post("users/token/",
            { "username": data['username'], "password": data['password'] })
            .then(resp => {
              dispatch({
                type: "LOGIN_SUCCESS", payload: {
                  "user": jwt_decode(resp.data['access']),
                  "token": resp.data
                }
              })

              setTokens(resp.data)
            }).then(() => {
              // alert!({ type: 'open', message: 'You are logged in!', alertType: 'success' })
              navigation.navigate('HomeScreen')
            })
        } else if (res.msg === "failure") {
          dispatch({ type: "LOGIN_FAILURE", payload: res.res })
          handleErrorMessage('Invalid credentials')
          // alert!({ type: 'open', message: 'Invalid credentials', alertType: 'error' })
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

  const { t, i18n } = useTranslation();

  return (
    <Suspense>
      <View testID="Login.container" style={styles.authContainer}>
        <Text>{loading && "Loading..."}</Text>
        {errMsg &&
          <View>
            <Text style={[styles.errorMsg, { fontSize: 16 }]}>{errMsg}</Text>
          </View>}
        <View testID="Login.usernameInputContainer" style={styles.inputContainer}>
          <Text testID="Login.usernameLabel" style={[styles.inputLabel,
          { color: errors.username ? Colors.alert2 : Colors.dark }]}>Username</Text>
          <Controller
            defaultValue=""
            control={control}
            rules={{
              required: "Please enter a username",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                nativeID="Login.usernameInput"
                testID="Login.usernameInput"
                value={value}
                style={[styles.input,
                { borderColor: errors.username ? Colors.alert2 : Colors.midLight }]}
                onChangeText={onChange}
                onChange={onChange}
                blurOnSubmit={false}
                onSubmitEditing={() => password_input.current?.focus()}
                onBlur={onBlur}
              />
            )}
            name="username"
          />
        </View>
        {errors.username &&
          <View testID="Login.usernameErrMsgContainer" style={styles.errorMsgContainer}>
            <Text testID="Login.usernameErrMsg" style={styles.errorMsg}>{errors.username.message}</Text>
          </View>}
        <View testID="Login.passwordInputContainer" style={styles.inputContainer}>
          <Text testID="Login.passwordLabel" style={[styles.inputLabel,
          { color: errors.password ? Colors.alert2 : Colors.dark }]}>Password</Text>
          <View testID="Login.innerPasswordInputContainer" style={[styles.passwordInputContainer,
          { borderColor: errors.password ? Colors.alert2 : Colors.midLight }]}>
            <Controller
              defaultValue=""
              control={control}
              rules={{
                required: "Please enter a password",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  nativeID="Login.passwordInput"
                  testID="Login.passwordInput"
                  value={value}
                  style={styles.passwordInput}
                  secureTextEntry={hidePass}
                  onChangeText={onChange}
                  onChange={onChange}
                  ref={password_input}
                  blurOnSubmit={false}
                  onSubmitEditing={handleSubmit(handleLogin)}
                  onBlur={onBlur}
                />
              )}
              name="password"
            />
            <Ionicons testID="eyeIcon"
              name={hidePass ? "eye-off-outline" : "eye-outline"}
              size={22}
              onPress={() => setHidePass(!hidePass)}
              style={{ padding: 9 }} />
          </View>
        </View>
        {errors.password &&
          <View testID="Login.passwordErrMsgContainer" style={styles.errorMsgContainer}>
            <Text testID="Login.passwordErrMsg" style={styles.errorMsg}>{errors.password.message}</Text>
          </View>}
        <Pressable style={{ width: '90%' }} testID="passwordReset.Button" onPress={handlePasswordRecovery}>
          <Text testID="Login.forgotPassword" style={styles.forgotPassword}> {t("account.signin.passForgot.label")} </Text>
        </Pressable>
        <TouchableOpacity testID="Login.Button" style={globalStyles.defaultBtn} onPress={handleSubmit(handleLogin)}>
          <Text testID="Login.ButtonLabel" style={globalStyles.defaultBtnLabel}>Login</Text>
        </TouchableOpacity>
        <View testID="divider" style={styles.divider}>
          <View testID="dividerLine1" style={styles.dividerLine} />
          <View>
            <Text testID="dividerText" style={styles.dividerText}> {t("account.signin.or")} </Text>
          </View>
          <View testID="dividerLine2" style={styles.dividerLine} />
        </View>
        <TouchableOpacity testID="SignUp.Button" style={globalStyles.outlineBtn} onPress={() => {
          setErrMsg('')
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
        {/* <Button
        onPress={() =>
          alert!({ type: 'open', message: 'Sample', alertType: 'success' })
        }>
        Show Snackbar
      </Button> */}
      </View>
    </Suspense>
  );
}

export default LoginScreen