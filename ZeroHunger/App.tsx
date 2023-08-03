import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import {Suspense} from 'react'
import { TouchableOpacity } from "react-native"
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import LandingPageScreen from './src/screens/HomeScreen';
import RequestDetailsScreen from './src/screens/RequestDetailsScreen';
import OfferDetailsScreen from './src/screens/OfferDetailsScreen';
import { AuthContextProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RequestFormScreen } from './src/screens/RequestFormScreen';
import { OfferFormScreen } from './src/screens/OfferFormScreen';
import { AlertProvider } from './src/context/Alert';
import SnackBar from './src/components/Snackbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat } from './src/components/Chat';
import { Conversations } from './src/screens/Conversations';
import { NotificationContextProvider } from './src/context/ChatNotificationContext';
import { Colors } from './styles/globalStyleSheet';
import { Ionicons } from '@expo/vector-icons'
import BottomTab from './src/components/BottomTab';
import DrawerTab from './src/components/DrawerTab';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider style={{ height: '99%' }}>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationContextProvider>
            <NavigationContainer>
              <AlertProvider>
                <>
                  <Stack.Navigator>
                    <Stack.Screen
                      name="ZeroHunger"
                      component={DrawerTab}
                      options={{ headerShown: false }}
                    />

                  </Stack.Navigator>
                  <SnackBar />
                </>
              </AlertProvider>
            </NavigationContainer>
          </NotificationContextProvider>
        </QueryClientProvider>
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