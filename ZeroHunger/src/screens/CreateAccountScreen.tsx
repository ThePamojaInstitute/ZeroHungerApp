import React, { useContext, useRef, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, GestureResponderEvent, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { createUser, logOutUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";

export const CreateAccountScreen = ({ navigation }) => {
  const email_input = useRef<TextInput | null>(null)
  const password_input = useRef<TextInput | null>(null)
  const confPassword_input = useRef<TextInput | null>(null)

  const { user, loading, dispatch } = useContext(AuthContext)
  const { dispatch: alert } = useAlert()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPass, setConfPass] = useState("")
  // const [errMsg, setErrMsg] = useState("")

  const handleSignUp = (e: (GestureResponderEvent |
    NativeSyntheticEvent<TextInputSubmitEditingEventData>)) => {
    e.preventDefault()
    dispatch({ type: "SIGNUP_START", payload: null })
    createUser({
      "username": username,
      "email": email,
      "password": password,
      "confPassword": confPass
    }).then(res => {
      if (res.msg === "success") {
        dispatch({ type: "SIGNUP_SUCCESS", payload: res.res })
        // setErrMsg("")
        alert!({ type: 'open', message: 'Account created successfully!', alertType: 'success' })
        navigation.navigate('LoginScreen')
      } else if (res.msg === "failure") {
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
        alert!({
          type: 'open',
          message: res.res[Object.keys(res.res)[0]] ? res.res[Object.keys(res.res)[0]] : "An error occurred",
          alertType: 'error'
        })
        // setErrMsg(res.res[Object.keys(res.res)[0]] ? res.res[Object.keys(res.res)[0]] : "An error occurred")
      } else {
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
        alert!({ type: 'open', message: res.msg, alertType: 'error' })
        // setErrMsg(res.msg)
      }
    })
  }

  const handleLogOut = (e: GestureResponderEvent) => {
    logOutUser().then(() => {
      dispatch({ type: "LOGOUT", payload: null })
    }).then(() => { navigation.navigate('LoginScreen') })
  }

  return (
    <View style={styles.container}>
      {user && <Text>Hello {user['username']}</Text>}
      {user &&
        <TouchableOpacity style={styles.createBtn} onPress={handleLogOut}>
          <Text style={styles.createBtnText}>Log Out</Text>
        </TouchableOpacity>}
      <Text style={styles.create}>Create Account</Text>
      <Text>{loading && "Loading..."}</Text>
      <View style={styles.inputView}>
        <TextInput
          nativeID="SignUp.usernameInput"
          testID="SignUp.usernameInput"
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000000"
          onChangeText={setUsername}
          blurOnSubmit={false}
          onSubmitEditing={() => email_input.current?.focus()}
          maxLength={64}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          nativeID="SignUp.emailInput"
          testID="SignUp.emailInput"
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#000000"
          secureTextEntry={false}
          onChangeText={setEmail}
          ref={email_input}
          blurOnSubmit={false}
          onSubmitEditing={() => password_input.current?.focus()}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          nativeID="SignUp.passwordInput"
          testID="SignUp.passwordInput"
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={setPassword}
          ref={password_input}
          blurOnSubmit={false}
          onSubmitEditing={() => confPassword_input.current?.focus()}
          maxLength={64}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          nativeID="SignUp.confPasswordInput"
          testID="SignUp.confPasswordInput"
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={setConfPass}
          ref={confPassword_input}
          blurOnSubmit={false}
          onSubmitEditing={handleSignUp}
          maxLength={64}
        />
      </View>
      <TouchableOpacity testID="SignUp.Button" style={styles.createBtn} onPress={handleSignUp}>
        <Text style={styles.createBtnText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateAccountScreen

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
  create: {
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
  createBtn: {
    title: "Login",
    width: "85%",
    borderRadius: 25,
    marginTop: 30,
    height: 50,
    alignItems: "center",
    backgroundColor: "#6A6A6A",
  },
  createBtnText: {
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