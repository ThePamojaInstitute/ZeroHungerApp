import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {auth} from "../firebaseconfig"
import { useNavigation } from '@react-navigation/native'

const Homescreen = () => {

    const navigation = useNavigation();
    const handleSignOut = () =>
    {
        auth.signOut()
        .then(()=>
        {
            navigation.navigate("Login" as never)
        })
        .catch(error => alert(error.message));
    }

  return (
    <View style = {styles.container}>
     <Text> Email: {auth.currentUser?.email}</Text>
    <TouchableOpacity onPress={handleSignOut}>
        <Text> Sign Out </Text>
    </TouchableOpacity>

    </View>
  )
}

export default Homescreen

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})