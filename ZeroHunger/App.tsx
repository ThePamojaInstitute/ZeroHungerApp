import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';


export default function App() {
  

  const [value, setValue] = React.useState("StartingVal")

  

  async function TestGET()
  {
    console.log("Testing GET")
    let response = await fetch("http://127.0.0.1:8000/api/test", {method: 'GET'});
    let data = await response.text()
    setValue(data)
    console.log(data)
  }

  async function TestPOST()
  {
    console.log("Testing GET")
    let response = await fetch("http://127.0.0.1:8000/api/test", {method: 'POST'});
    let data = await response.text()
    setValue(data)
    console.log(data)
  }

  async function TestDeleteUser() //Temporary test function to create a new user
  {
    
  } 


  return (
    <View style={styles.container}>
      <Text>Basic API Test </Text>
      <StatusBar style="auto" />



      <Button title= "Test GET" onPress={TestGET} />

      <Button title= "Test POST" onPress={TestPOST} />

      <Text> {value} </Text>
     
      <CreateAccountScreen />

    </View>


  );



}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
