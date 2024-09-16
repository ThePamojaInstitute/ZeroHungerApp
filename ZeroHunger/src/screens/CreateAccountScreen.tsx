import React, { useContext, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Keyboard,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import styles from "../../styles/screens/createAccountStyleSheet"
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet";
import { useFocusEffect } from "@react-navigation/native";
import { createUser, logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { CreateUserFormData } from "../../types";
import { axiosInstance, setTokens } from "../../config";
import jwt_decode from "jwt-decode";
import NotificationsTest from "./NotificationsTest";
import { handleNewKeys, getPrivateKey1 } from "../controllers/publickey";

export const CreateAccountScreen = ({ navigation }) => {
  const email_input = useRef<TextInput | null>(null)
  const password_input = useRef<TextInput | null>(null)
  const confPassword_input = useRef<TextInput | null>(null)

  const { user, loading, dispatch } = useContext(AuthContext)
  const { dispatch: alert } = useAlert()
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateUserFormData>();

  useFocusEffect(() => {
    if (user) {
      navigation.navigate('HomeScreen')
    }
  })

  const [hidePass, setHidePass] = useState(true)
  const [hideConfPass, setHideConfPass] = useState(true)
  const [isAccepted, setIsAccepted] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const { t, i18n } = useTranslation()
  const [expoPushToken, setExpoPushToken] = useState("");

  const handleLogin = (credentials: object) => {
    dispatch({ type: "LOGIN_START", payload: null })
    logInUser({
      "username": credentials['username'],
      "password": credentials['password'],
      "expo_push_token": expoPushToken,
      "Platform": Platform.OS
    })
      .then(async res => {
        if (res.msg === "success") {
          console.log(`TESTING SPACE 1`)
          await axiosInstance.post("users/token/",
            { "username": credentials['username'], "password": credentials['password'] })
            .then(resp => {
              // handleNewKeys(credentials['username'].toLowerCase())
              console.log(`TESTING SPACE 2`)
              dispatch({
                type: "LOGIN_SUCCESS", payload: {
                  "user": jwt_decode(resp.data['access']),
                  "token": resp.data
                }
              })
              console.log(`TESTING SPACE 3`)

              setTokens(resp.data)

              console.log(`TESTING SPACE 4`)

              handleNewKeys(credentials['username'].toLowerCase(), resp.data['access']).then(() => {
                console.log(`TESTING SPACE 5`)

                console.log(`CREATING ACCOUNT WITH KEY: ${getPrivateKey1(credentials['username'].toLowerCase())}`)

                dispatch({
                  type: "PRIVATEKEY", payload: {
                    "privkey": getPrivateKey1(credentials['username'].toLowerCase())
                  }
                })
              })

              // console.log(`TESTING SPACE 5`)


              // console.log(`CREATING ACCOUNT WITH KEY: ${getPrivateKey1(credentials['username'].toLowerCase())}`)

              // dispatch({
              //   type: "PRIVATEKEY", payload: {
              //     "privkey": getPrivateKey1(credentials['username'].toLowerCase())
              //   }
              // })
            }).then(() => {
              // navigation.navigate('PermissionsScreen')
              // handleNewKeys(credentials['username'])
                
            })
        } else {
          dispatch({ type: "LOGIN_FAILURE", payload: res.res })
          navigation.navigate('LoginScreen')
        }
      })
  }

  const handleSignUp = (data: object, e: (GestureResponderEvent |
    NativeSyntheticEvent<TextInputSubmitEditingEventData>)) => {
    e.preventDefault()
    Keyboard.dismiss()

    if (!isAccepted) {
      setErrMsg("Please accept terms and conditions")
      return
    }

    dispatch({ type: "SIGNUP_START", payload: null })
    createUser({
      "username": data['username'].toLowerCase(),
      "email": data['email'].toLowerCase(),
      "password": data['password'],
      "confPassword": data['confPass']
    }).then(res => {
      if (res.msg === "success") {
        // handleNewKeys(data['username'].toLowerCase())
        navigation.navigate("PermissionsScreen")
        dispatch({ type: "SIGNUP_SUCCESS", payload: res.res })
        // alert!({ type: 'open', message: 'Account created successfully!', alertType: 'success' })
        // navigation.navigate('LoginScreen')
        const credentials = {
          "username": data['username'].toLowerCase(),
          "password": data['password'],
          "expo_push_token": expoPushToken
        }
        console.log(`TESTING SPACE 7`)
        handleLogin(credentials)
        navigation.navigate("PermissionsScreen")
      } else {
        if (!res.res['username'] && !res.res['email']) {
          alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        }

        if (res.res['username']) {
          setError('username', {
            type: "server",
            message: res.res['username']
          })
        }
        if (res.res['email']) {
          setError('email', {
            type: "server",
            message: res.res['email']
          })
        }

        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
      }
    })
  }

  return (
    <KeyboardAvoidingView style={{ backgroundColor: Colors.Background }}>
      <View
        testID="SignUp.container"
        style={[styles.authContainer, Platform.OS === 'web' ? styles.alignWidth : {}]}
      >
        <NotificationsTest setExpoToken={setExpoPushToken} />
        {loading &&
          <ActivityIndicator animating size="large" color={Colors.primary} />}
        <View testID="SignUp.usernameInputContainer" style={[styles.inputContainer]}>
          <Text testID="SignUp.usernameLabel" style={[styles.inputLabel,
          { color: errors.username ? Colors.alert2 : Colors.dark }]}
          >Username</Text>
          {errors.username &&
            <View testID="SignUp.usernameErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.usernameErrMsg" style={styles.errorMsg}>{errors.username.message}</Text>
            </View>}
          <View style={{ height: 41 }}>
            <Controller
              defaultValue=""
              control={control}
              rules={{
                required: "Please enter a username",
                minLength: {
                  value: 5,
                  message: "Username length should be at least 5 characters"
                },
                maxLength: {
                  value: 50,
                  message: "Username length should be at most 50 characters"
                },
                validate: {
                  containsUnderscore: (str) => /^(?!.*__).*$/.test(str) || "Username shouldn't include \"__\"",
                  NotAlphanum: (str) => /^[a-zA-Z0-9_\.\-]*$/.test(str) || "Username should only include alphanumeric characters, underscores, or periods"
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  nativeID="SignUp.usernameInput"
                  testID="SignUp.usernameInput"
                  style={[styles.input,
                  { borderColor: errors.username ? Colors.alert2 : Colors.midLight }]}
                  onChangeText={onChange}
                  onChange={onChange}
                  blurOnSubmit={false}
                  onSubmitEditing={() => email_input.current?.focus()}
                  maxLength={50}
                  onBlur={onBlur}
                />
              )}
              name="username"
            />
          </View>
        </View>
        <View testID="SignUp.emailInputContainer" style={styles.inputContainer}>
          <Text testID="SignUp.emailLabel" style={[styles.inputLabel,
          { color: errors.email ? Colors.alert2 : Colors.dark }]}
          >Email Address</Text>
          {errors.email &&
            <View testID="SignUp.emailErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.emailErrMsg" style={styles.errorMsg}>{errors.email.message}</Text>
            </View>}
          <View style={{ height: 41 }}>
            <Controller
              defaultValue=""
              control={control}
              rules={{
                required: "Please enter an email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  nativeID="SignUp.emailInput"
                  testID="SignUp.emailInput"
                  style={[styles.input, { borderColor: errors.email ? Colors.alert2 : Colors.midLight }]}
                  secureTextEntry={false}
                  onChangeText={onChange}
                  onChange={onChange}
                  ref={email_input}
                  blurOnSubmit={false}
                  onSubmitEditing={() => password_input.current?.focus()}
                  onBlur={onBlur}
                  maxLength={256}
                />
              )}
              name="email"
            />
          </View>
        </View>
        <View testID="SignUp.passwordInputContainer" style={styles.inputContainer}>
          <Text testID="SignUp.passwordLabel" style={[styles.inputLabel,
          { color: errors.password ? Colors.alert2 : Colors.dark }]}
          >Password</Text>
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>{'\u2022'}  </Text>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>Must be at least 6 characters long</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>{'\u2022'}  </Text>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>Must contain an uppercase letter and a lower case letter (A, z)</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>{'\u2022'}  </Text>
              <Text style={[globalStyles.Small1, { color: '#656565' }]}>Must contain a number</Text>
            </View>
          </View>
          {errors.password &&
            <View testID="SignUp.passwordErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.passwordErrMsg" style={styles.errorMsg}>{errors.password.message}</Text>
            </View>}
          <View testID="SignUp.innerPasswordInputContainer" style={[styles.passwordInputContainer,
          { borderColor: errors.password ? Colors.alert2 : Colors.midLight }]}>
            <Controller
              defaultValue=""
              control={control}
              rules={{
                required: "Please enter a password",
                minLength: {
                  value: 6,
                  message: "The password you entered is too short"
                },
                maxLength: {
                  value: 64,
                  message: "The password you entered is too long"
                },
                validate: {
                  // this regex checks if the password contains an uppercase, a lower case, and a number
                  meetsRequirements: (str) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(str) || "The password you entered does not meet the requirements above",
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  nativeID="SignUp.passwordInput"
                  testID="SignUp.passwordInput"
                  style={styles.passwordInput}
                  secureTextEntry={hidePass}
                  onChangeText={onChange}
                  onChange={onChange}
                  ref={password_input}
                  blurOnSubmit={false}
                  onSubmitEditing={() => confPassword_input.current?.focus()}
                  maxLength={64}
                  onBlur={onBlur}
                />
              )}
              name="password"
            />
            <Ionicons
              testID="eyeIcon"
              name={hidePass ? "eye-off-outline" : "eye-outline"}
              size={22}
              onPress={() => setHidePass(!hidePass)}
              style={{ padding: 9 }} />
          </View>
        </View>
        <View testID="SignUp.confPasswordInputContainer" style={styles.inputContainer}>
          <Text testID="SignUp.confPasswordLabel" style={[styles.inputLabel,
          { color: errors.confPass ? Colors.alert2 : Colors.dark }]}
          >Confirm Password</Text>
          {errors.confPass &&
            <View testID="SignUp.confPasswordErrMsgContainer" style={styles.errorMsgContainer}>
              <Text testID="SignUp.confPasswordErrMsg" style={styles.errorMsg}>{errors.confPass.message}</Text>
            </View>}
          <View testID="SignUp.innerconfPasswordInputContainer" style={[styles.passwordInputContainer,
          { borderColor: errors.confPass ? Colors.alert2 : Colors.midLight }]}>
            <Controller
              defaultValue=""
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "Your passwords do no match";
                  }
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  nativeID="SignUp.confPasswordInput"
                  testID="SignUp.confPasswordInput"
                  style={styles.passwordInput}
                  secureTextEntry={hideConfPass}
                  onChangeText={onChange}
                  onChange={onChange}
                  ref={confPassword_input}
                  blurOnSubmit={false}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  maxLength={64}
                  onBlur={onBlur}
                />
              )}
              name="confPass"
            />
            <Ionicons
              testID="confEyeIcon"
              name={hideConfPass ? "eye-off-outline" : "eye-outline"}
              size={22}
              onPress={() => setHideConfPass(!hideConfPass)}
              style={{ padding: 9 }} />
          </View>
        </View>
        <View testID="SignUp.termsAndCondContainer" style={styles.termsAndCondContainer}>
          <Text testID="SignUp.termsInputLabel" style={[styles.inputLabel,
          { color: errMsg ? Colors.alert2 : Colors.dark }]}>Terms and Conditions</Text>
          <Text testID="SignUp.termsAndCondText" style={styles.termsAndCondText}>Read our <Text testID="SignUp.termsAndCondLink" style={{ textDecorationLine: 'underline' }}
            onPress={() => console.log("terms and conditions")}
          >terms and conditions.</Text></Text>
          {errMsg &&
            <Text
              testID="SignUp.termsAndCondErrMsg"
              style={{
                fontFamily: Fonts.PublicSans_Regular,
                fontWeight: '400',
                fontSize: 13,
                color: Colors.alert2
              }}>{errMsg}</Text>}
          <View testID="SignUp.checkboxContainer" style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons testID="SignUp.checkbox" name={isAccepted ? "checkbox-marked" : "checkbox-blank-outline"} size={22}
              onPress={() => {
                setErrMsg('')
                setIsAccepted(!isAccepted)
              }} />
            <Text testID="SignUp.termsAndCondAcceptText" style={styles.termsAndCondAcceptText}>{t("account.signup.terms.accept.label")}</Text>
          </View>
        </View>
        <TouchableOpacity testID="SignUp.Button" style={globalStyles.defaultBtn} onPress={handleSubmit(handleSignUp)}>
          <Text style={globalStyles.defaultBtnLabel}>Sign Up</Text>
        </TouchableOpacity>
      </View >
    </KeyboardAvoidingView>
  );
}

export default CreateAccountScreen
