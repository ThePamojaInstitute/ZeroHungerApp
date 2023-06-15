import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import { TouchableOpacity } from "react-native"
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import HomeScreen from './src/screens/HomeScreen';
import RequestDetailsScreen from './src/screens/RequestDetailsScreen';
import OfferDetailsScreen from './src/screens/OfferDetailsScreen';
import { AuthContextProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RequestFormScreen } from './src/screens/RequestFormScreen';
import { OfferFormScreen } from './src/screens/OfferFormScreen';
import { AlertProvider } from './src/context/Alert';
import SnackBar from './src/components/Snackbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat } from './src/components/Chat';
import { Conversations } from './src/screens/Conversations';
import { NotificationContextProvider } from './src/context/ChatNotificationContext';
import { Colors } from './styles/globalStyleSheet';

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
    <SafeAreaProvider>
      <AuthContextProvider>
        <NotificationContextProvider>
          <NavigationContainer>
            <AlertProvider>
              <>
                <Stack.Navigator>
                  <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
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
                    name='Conversations'
                    component={Conversations}
                  />
                  <Stack.Screen
                    name='Chat'
                    component={Chat}
                  />
                  <Stack.Screen
                    name="RequestFormScreen"
                    component={RequestFormScreen}
                  />
                  <Stack.Screen
                    name="OfferFormScreen"
                    component={OfferFormScreen}
                  />
                  <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                      // headerShown: false,
                      title: "Zero Hunger",
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: Colors.Background
                      },
                      headerLeft: () => (<></>),
                    }}
                  />
                  <Stack.Screen
                    name="CreateAccountScreen" //Placeholder header to return to login screen
                    component={CreateAccountScreen}
                    options={{
                      // headerShown: false,
                      title: "Zero Hunger",
                      headerTitleAlign: 'center',
                      headerStyle: {
                        backgroundColor: Colors.Background
                      }
                    }}
                  />
                  <Stack.Screen
                    name="RequestDetailsScreen"
                    component={RequestDetailsScreen}
                  />
                  <Stack.Screen
                    name="OfferDetailsScreen"
                    component={OfferDetailsScreen}
                  />
                </Stack.Navigator>
                <SnackBar />
              </>
            </AlertProvider>
          </NavigationContainer>
        </NotificationContextProvider>
      </AuthContextProvider>
    </SafeAreaProvider>
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