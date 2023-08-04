import * as React from 'react'
import { AuthContextProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlertProvider } from './src/context/Alert';
import SnackBar from './src/components/Snackbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationContextProvider } from './src/context/ChatNotificationContext';
import DrawerTab from './src/components/DrawerTab';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './src/hooks/useFonts';
import { useTranslation } from "react-i18next";


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts()
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    onLayoutRootView().catch(console.error)
  }, [appIsReady])

  const onLayoutRootView = async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }

  if (!appIsReady) {
    return null;
  }

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
