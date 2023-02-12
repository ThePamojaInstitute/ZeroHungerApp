import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useEffect} from 'react';
import {app, auth} from "../utilities/firebaseconfig"
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import { Logs } from 'expo';
import { useNavigation } from '@react-navigation/core';
import Homescreen from './Homescreen';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const appFB = app;
    const authFB = auth;
    const navigation = useNavigation();
 
    useEffect(() => 
    {
        const unsubscribe = authFB.onAuthStateChanged(user => 
            {
                if (user)
                    {
                        navigation.navigate("Home" as never)
                    }
            })
            return unsubscribe
    },  [])

    const onLogInPress = () =>
    {
         signInWithEmailAndPassword(authFB, email, password)
          .then((userCredential) => 
         {
          const user = userCredential.user;
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
          });
    } 

    const onSignUpPress = () =>
    {
        Alert.alert("Signed Up with email: " + email);
        
        createUserWithEmailAndPassword(authFB, email, password)
        .then((userCredential) => 
        {
            const user = userCredential.user;
         })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
        
    }

  return (
  
    <KeyboardAvoidingView behavior='height' style = {styles.container}>
    
        <View style={styles.inputContainer}>
            <TextInput style = {styles.input}
                placeholder='Email'
                value = {email}
                onChangeText={text => setEmail(text)}
            />            
            <TextInput style = {styles.input}
                placeholder='Password'
                secureTextEntry
                value = {password}
                onChangeText={text => setPassword(text)}
            />
        </View>

        <View style = {styles.buttonContainer}>
            <TouchableOpacity style = {styles.button} onPressIn={onLogInPress} >
                <Text style={styles.buttonText}> Login </Text>

            </TouchableOpacity>

            <TouchableOpacity style = {[styles.button, styles.buttonOutline]} onPressIn={onSignUpPress} >
                <Text style={styles.buttonOutlineText}> Register </Text>

            </TouchableOpacity>
        </View>

    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create
({
    container: 
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer:
    {
        width: '80%'
    },
    input:
    {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer:
    {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20

    },
    button:
    {
        backgroundColor: '#0782f9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline:
    {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782f9',
        borderWidth: 2
    },
    buttonOutlineText:
    {
        color: '#0782f9',
        fontWeight: '700',
        fontSize: 16
    },
    buttonText:
    {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    }

})