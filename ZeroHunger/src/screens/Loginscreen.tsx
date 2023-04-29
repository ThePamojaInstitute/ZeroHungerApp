import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { createUser, logInUser } from "../controllers/auth";


export const LoginScreen = () => {

  const [credentials, setCredentials] = useState({
    'username': undefined,
    'password': undefined
  })

  const handleLogin = () => {
    logInUser(credentials)
  }

  const handleChange = (e, type: string) => {
    setCredentials(prev => ({ ...prev, [type]: e.target.value }))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.login}>Zero Hunger</Text>
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
          placeholder="Password"
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChange={e => handleChange(e, 'password')}
        />
      </View>
      <TouchableOpacity /*onPress={}*/>
        <Text style={styles.forgotBtn}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpBtn} /*onPress={}*/>
        <Text style={styles.signUpBtnText}>Sign Up</Text>
      </TouchableOpacity>
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
    title: "Login",
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