import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react'
import Feedscreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/Loginscreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen />
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
