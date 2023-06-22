import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native"
import LoginScreen from '../screens/Loginscreen';
import CreateAccountScreen from '../screens/CreateAccountScreen'
import LandingPageScreen from '../screens/HomeScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import OfferFormScreen from '../screens/OfferFormScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import Conversations from '../screens/Conversations';
import Chat from './Chat';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Colors } from '../../styles/globalStyleSheet';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuProvider, Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStackNavigator = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="HomeScreen" 
                component={LandingPageScreen}
                options={{
                    title: "Zero Hunger",
                    headerTitleAlign: 'left',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.offWhite
                    },
                    headerLeft: () => (
                        <Ionicons 
                            style={{marginLeft:12, marginRight:21}}
                            name="menu" 
                            size={24}
                            onPress={navigation.openDrawer}
                        />
                    ),
                    headerRight: () => (
                        <View style={{flexDirection: 'row'}}>
                            <Ionicons
                            style={{padding:16}}
                                name="md-search"
                                size={22}
                                onPress={() => {}}
                            />
                            <Ionicons
                                style={{padding:16}}
                                name="notifications-sharp"
                                size={22}
                                onPress={() => {}}
                            />
                        </View>
                    )
                  }}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    // headerShown: false,
                    title: "Zero Hunger",
                    headerTitleAlign: 'center',
                    headerStyle: {
                      backgroundColor: Colors.Background,
                    },
                    headerLeft: () => (<></>),
                }}
            />
            <Stack.Screen
                name="CreateAccountScreen"
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
                name="RequestFormScreen" 
                component={RequestFormScreen}
            />
            <Stack.Screen 
                name="RequestDetailsScreen" 
                component={RequestDetailsScreen}
            />
            <Stack.Screen 
                name="OfferFormScreen" 
                component={OfferFormScreen}
            />
            <Stack.Screen 
                name="OfferDetailsScreen" 
                component={OfferDetailsScreen}
            />
        </Stack.Navigator>
    )
} 

const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Conversations" 
                component={Conversations}
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name="Chat" 
                component={Chat}
                options={{headerShown: false}} 
            />
        </Stack.Navigator>
    )
}

const openPostMenu = () => {
    return (
        // openMenu 
        <View></View>
    )
}

const TabBarButton = () => {
    return (
        <View style={{flex: 0, alignItems: "center", justifyContent: "center",}}>
            <TouchableOpacity style={styles.postButton} onPress={openPostMenu}>
                <Ionicons name="add-circle-outline" size={28} color={Colors.primary} style={{marginLeft: 3}}/>
                <Text style={styles.bottomBarText}>Post</Text>
            </TouchableOpacity>
        </View>
    )
}

const PostComponent = () => {return null}

const BottomTab = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeStackNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <View style={{flex: 0, alignItems: "center", justifyContent: "center"}}>
                    {focused
                        ? <Ionicons name="home" size={24} color={Colors.primary} style={{marginBottom: -10}}/>
                        : <Ionicons name="home-outline" size={24} color={Colors.primary} style={{marginBottom: -10}}/>
                    }
                </View>
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: styles.bottomBarText,
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              if (routeName === 'LoginScreen' || routeName === 'CreateAccountScreen') {
                return { display: "none" }
              }
              return styles.bottomBarTab
            })(route),
          })}
        />
        <Tab.Screen
          name="Post"
        //   component={() => (null)}
        component={PostComponent}
          options={{
            tabBarButton: TabBarButton 
          }}
        />
        <Tab.Screen 
          name="Conversations" 
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    {focused
                        ? <Ionicons name="chatbox-ellipses" size={24} color={Colors.primary} style={{marginBottom: -10}}/>
                        : <Ionicons name="chatbox-ellipses-outline" size={24} color={Colors.primary} style={{marginBottom: -10}}/>
                    }
                </View>
            ),
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: styles.bottomBarText,
            tabBarStyle: styles.bottomBarTab
          }}
        />
      </Tab.Navigator>
    )
  }

export default BottomTab

const styles = StyleSheet.create({
    bottomBarText: {
        // marginBottom: 14,
        fontSize: 11,
        color: Colors.primary,
        marginBottom: 14,
        textAlign: "center"
    },
    bottomBarTab: {
        height: 69, 
        backgroundColor: Colors.offWhite,
        borderTopWidth: 0,
    },
    postButton: {
        marginTop: 9,
        alignItems: "center",
        justifyContent: "center",
        // position: "absolute",
        // zIndex: 100,
        // width: "33%"
    }
})