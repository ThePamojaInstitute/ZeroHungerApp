import React, { useContext, useState } from "react";
import { GestureResponderEvent } from "react-native";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { createUser, logOutUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";

export const CreateAccountScreen = ({ navigation }) => {
  const { user, loading, dispatch } = useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPass, setConfPass] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const handleSignUp = (e: GestureResponderEvent) => {
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
        setErrMsg("")
        navigation.navigate('LoginScreen')
      } else if (res.msg === "failure") {
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
        setErrMsg(res.res[Object.keys(res.res)[0]] ? res.res[Object.keys(res.res)[0]] : "")
      } else {
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
        setErrMsg(res.msg)
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
          testID="SignUp.usernameInput"
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000000"
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          testID="SignUp.emailInput"
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#000000"
          secureTextEntry={false}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          testID="SignUp.passwordInput"
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          testID="SignUp.confPasswordInput"
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={setConfPass}
        />
      </View>
      <Text style={{ color: "red" }}>{errMsg && errMsg}</Text>
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