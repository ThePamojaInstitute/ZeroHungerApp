import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import Homescreen from './screens/Homescreen';
import PrivateRoute from "./utilities/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { Context, Provider } from "./context/globalContext"

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    
    <Provider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen options ={{ headerShown: false}} name = "Login" component={LoginScreen} />
        <Stack.Screen name = "Home" component={Homescreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    
  
  );
}
export default App;