import React, { useContext, useEffect, useState } from "react";
import { GestureResponderEvent, Linking } from "react-native";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { logInUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../../config";
import jwt_decode from "jwt-decode";
import { useAlert } from "../context/Alert";
import { Button } from 'react-native-paper';


export const LoginScreen = ({ navigation }) => {
  const { user, loading, dispatch } = useContext(AuthContext)
  const { dispatch: alert } = useAlert()

  useEffect(() => {
    if (user) {
      navigation.navigate('LandingPageScreenTemp')
    }
  }, [])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const handleLogin = (e: GestureResponderEvent) => {
    e.preventDefault()
    dispatch({ type: "LOGIN_START", payload: null })
    logInUser({ "username": username, "password": password }).then(async res => {
      if (res.msg === "success") {
        await axiosInstance.post("/token/", { "username": username, "password": password }).then(resp => {
          dispatch({
            type: "LOGIN_SUCCESS", payload: {
              "user": jwt_decode(resp.data['access']),
              "token": resp.data
            }
          })
        }).then(() => {
          alert!({ type: 'open', message: 'You are logged in!', alertType: 'success' })
          navigation.navigate('LandingPageScreenTemp')
        })
      } else if (res.msg === "failure") {
        dispatch({ type: "LOGIN_FAILURE", payload: res.res })
        setErrMsg("Invalid credentials")
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: res.res })
        setErrMsg(res.msg)
      }
    })
    setUsername("")
    setPassword("")
  }

  const handlePasswordRecovery = () => {
    Linking.canOpenURL("http://127.0.0.1:8000/password-reset/").then(supported => {
      if (supported) {
        Linking.openURL("http://127.0.0.1:8000/password-reset/");
      } else {
        console.log("Cannot open URL: " + "http://127.0.0.1:8000/password-reset/");
      }
    })  //replace this with actual URL later
  }

  return (
    <View style={styles.container}>
      <Text style={styles.login}>Zero Hunger</Text>
      <Text>{loading && "Loading..."}</Text>
      <View style={styles.inputView}>
        <TextInput
          testID="LogIn.usernameInput"
          value={username}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000000"
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          testID="LogIn.passwordInput"
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity testID="passwordReset.Button" onPress={handlePasswordRecovery}>
        <Text style={styles.forgotBtn}>Forgot password?</Text>
      </TouchableOpacity>
      <Text testID="errMsg" style={{ color: "red" }}>{errMsg && errMsg}</Text>
      <TouchableOpacity testID="LogIn.Button" style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="SignUp.Button" style={styles.signUpBtn} onPress={() => navigation.navigate("CreateAccountScreen")}>
        <Text style={styles.signUpBtnText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="RequestFromNav.Button" style={styles.signUpBtn} onPress={() => navigation.navigate("RequestFormScreen")}>
        <Text style={styles.signUpBtnText}>Add a Request</Text>
      </TouchableOpacity>
      <Button
        onPress={() =>
          alert!({ type: 'open', message: 'Sample', alertType: 'success' })
        }>
        Show Snackbar
      </Button>
    </View>
  );
}
export default LoginScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    backgroundColor: "#D3D3D3",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 10,
    marginTop: 5,
  },
  login: {
    color: "#000000",
    height: 140,
    fontSize: 48
  },
  input: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    fontSize: 15,
  },
  forgotBtn: {
    height: 16,
    marginBottom: 30,
    marginLeft: 150,
    fontSize: 12,
  },
  loginBtn: {
    // title: "Login",
    width: "85%",
    borderRadius: 25,
    marginTop: 30,
    height: 50,
    alignItems: "center",
    backgroundColor: "#6A6A6A",
  },
  loginBtnText: {
    color: "#FFFFFF",
    padding: 15,
    marginLeft: 10,
    fontSize: 15,
  },
  signUpBtn: {
    title: "Sign Up",
    width: "85%",
    borderRadius: 25,
    marginTop: 15,
    height: 50,
    alignItems: "center",
    backgroundColor: "#A9A9A9",
  },
  signUpBtnText: {
    color: "#FFFFFF",
    padding: 15,
    marginLeft: 10,
    fontSize: 15,
  }
});