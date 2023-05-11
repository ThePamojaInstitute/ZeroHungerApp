import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import { TouchableOpacity } from "react-native"
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import LandingPageScreen from './src/screens/LandingPageScreen';
import { AuthContextProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// export default function App() {
//   return (
//     <AuthContextProvider>
//       <View style={styles.container}>
//         <LoginScreen />
//         {/* <CreateAccountScreen /> */}
//       </View>r
//     </AuthContextProvider>
//   );
// }

const Stack = createNativeStackNavigator();

// const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LandingPageScreenTemp"
            component={LandingPageScreen}
            options={{
              title: "Zero Hunger",
              headerTitleAlign: 'center',
              headerLeft: () => (
                <TouchableOpacity style={styles.buttonPlaceholder}>
                  <Text>Profile Picture</Text>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity style={styles.buttonPlaceholder}>
                  <Text>Notif Icon</Text>
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateAccountScreen" //Placeholder header to return to login screen
            component={CreateAccountScreen}
          // options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonPlaceholder: {
    borderWidth: 2,
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    marginLeft: 10,
  },
});