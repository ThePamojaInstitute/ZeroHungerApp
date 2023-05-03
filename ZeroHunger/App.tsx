import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import { AuthContextProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthContextProvider>
      <View style={styles.container}>
        <LoginScreen />
        <CreateAccountScreen />
      </View>
    </AuthContextProvider>
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
