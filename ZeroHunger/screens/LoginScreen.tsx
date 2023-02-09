import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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
            <TouchableOpacity style = {styles.button} onPress={() => {}} >
                <Text style={styles.buttonText}> Login </Text>

            </TouchableOpacity>

            <TouchableOpacity style = {[styles.button, styles.buttonOutline]} onPress={() => {}} >
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