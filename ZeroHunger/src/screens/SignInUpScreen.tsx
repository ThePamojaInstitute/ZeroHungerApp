import React, { useEffect, useContext, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import styles from "../../styles/screens/loginStyleSheet"
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet";
import { useFocusEffect } from "@react-navigation/native";
import { createUser, logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { CreateUserFormData } from "../../types";
import { axiosInstance, setTokens } from "../../config";
import jwt_decode from "jwt-decode";
import NotificationsTest from "./NotificationsTest";

export const SignInUpScreen = ({ navigation }) => {
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
    
      useEffect(() => {
        if (user) {
          navigation.navigate('HomeScreen')
        }
      }, [])

    const { t, i18n } = useTranslation();

    return (
        <KeyboardAvoidingView style={{ backgroundColor: Colors.Background, flexDirection: 'column' }}>
            <View style={[styles.authContainer, Platform.OS === 'web' ? styles.alignWidth : {}]}>
                <View style={[styles.authContainer, Platform.OS === 'web' ? styles.alignWidth : {}]}>
                    {loading && <ActivityIndicator animating size="large" color={Colors.primary} />}
                    <View style={[styles.inputContainer, { marginBottom: 32 }]}>
                        <Text style={[styles.inputLabel, { color: Colors.dark }]}>Email</Text>
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
                                        placeholder={'Enter your email'}
                                        placeholderTextColor={Colors.midDark}
                                        style={[styles.input, { borderColor: Colors.midLight }]}
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
                    {errors.username &&
                        <View style={styles.errorMsgContainer}>
                            <Text style={styles.errorMsg}>{errors.username.message}</Text>
                        </View>
                    }
                    <TouchableOpacity style={globalStyles.defaultBtn} onPress={() => {
                        navigation.navigate("CreateAccountScreen", {email: control._formValues.email})
                    }}>
                        <Text style={globalStyles.defaultBtnLabel}>Create An Account</Text>
                    </TouchableOpacity>
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <View>
                        <Text style={styles.dividerText}> {t("account.signin.or")} </Text>
                        </View>
                        <View style={styles.dividerLine} />
                    </View>
                    <TouchableOpacity style={globalStyles.outlineBtn} onPress={() => {
                        // setErrMsg('')
                        navigation.navigate("LoginScreen", {email: control._formValues.email})
                    }}>
                        <Text style={globalStyles.outlineBtnLabel}> Sign In </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.termsAndConditionsContainer}>
                    <Pressable style={{ width: '100%' }} onPress={
                        // () => {navigation.navigate("PrivacyAndTermsScreen")} 
                        () => {console.log("Please add privacy and terms screen")} //Uncomment line above when privacy and terms complete
                    }>
                        <Text style={styles.forgotPassword}> {"Privacy & Terms"} </Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignInUpScreen