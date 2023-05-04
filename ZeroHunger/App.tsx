import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import { AuthContextProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// export default function App() {
//   return (
//     <AuthContextProvider>
//       <View style={styles.container}>
//         <LoginScreen />
//         {/* <CreateAccountScreen /> */}
//       </View>
//     </AuthContextProvider>
//   );
// }

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen}
          options={{headerShown: false}}/>
        <Stack.Screen 
          name="CreateAccountScreen" //Placeholder to return to login screen
          component={CreateAccountScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});