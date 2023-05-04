import React, { useContext, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData, GestureResponderEvent } from "react-native";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { createUser } from "../controllers/auth";
import { AuthContext } from "../context/AuthContext";

export const CreateAccountScreen = ({navigation}) => {
  const { loading, dispatch } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    'username': undefined,
    'email': undefined,
    'password': undefined,
    'confPassword': undefined
  })
  const [confPass, setConfPass] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [updateMsg, setUpdateMsg] = useState("")

  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>, type: string) => {
    if (type === "confPass") { setConfPass(e.nativeEvent.text) }
    else { setCredentials(prev => ({ ...prev, [type]: e.nativeEvent.text })) }
  }

  const handleSignUp = (e: GestureResponderEvent) => {
    e.preventDefault()
    dispatch({ type: "SIGNUP_START", payload: null })
    createUser(credentials).then(res => {
      if (res.msg === "success") {
        dispatch({ type: "SIGNUP_SUCCESS", payload: res.res })
        setErrMsg("")
        setUpdateMsg("Created!")
      } else if (res.msg === "failure") {
        setErrMsg("An error occurred")
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
      } else {
        dispatch({ type: "SIGNUP_FAILURE", payload: res.res })
        setErrMsg(res.msg)
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.create}>Create Account</Text>
      <Text>{loading && "Loading..."}</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000000"
          onChange={e => handleChange(e, 'username')}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#000000"
          secureTextEntry={false}
          onChange={e => handleChange(e, 'email')}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChange={e => handleChange(e, 'password')}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChange={e => handleChange(e, 'confPassword')}
        />
      </View>
      <Text style={{ color: "red" }}>{errMsg && errMsg}</Text>
      <Text style={{ color: "green" }}>{updateMsg && updateMsg}</Text>
      <TouchableOpacity style={styles.createBtn} onPress={handleSignUp}>
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