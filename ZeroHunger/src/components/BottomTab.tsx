import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
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
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Modal from 'react-native-modal';

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
                            style={{ marginLeft: 12, marginRight: 21 }}
                            name="menu"
                            size={24}
                            onPress={navigation.openDrawer}
                        />
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons
                                style={{ padding: 16 }}
                                name="md-search"
                                size={22}
                                onPress={() => { }}
                            />
                            <Ionicons
                                style={{ padding: 16 }}
                                name="notifications-sharp"
                                size={22}
                                onPress={() => { }}
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
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: true,
                    title: "Chat",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ConversationsNav"
                component={Conversations}
                options={{
                    headerShown: true,
                    title: "Conversations",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: true,
                    title: "Chat",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.Background,
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const PostComponent = () => null

const BottomTab = () => {
    const [modalVisible, setModalVisible] = useState(false)
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
          component={PostComponent}
          //Post button + modal
          options={({ navigation }) => ({
            tabBarButton: () => 
                <View>
                    <View>
                        <TouchableOpacity style={styles.postButton} onPress={() => setModalVisible(!modalVisible)}>
                            <Ionicons name="add-circle-outline" size={28} color={Colors.primary} style={{marginLeft: 3}}/>
                            <Text style={styles.bottomBarText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Modal
                            isVisible={modalVisible}
                            animationIn="slideInUp"
                            backdropOpacity={0.5}
                            onBackButtonPress={() => setModalVisible(!modalVisible)}
                            onBackdropPress={() => setModalVisible(!modalVisible)}
                            onSwipeComplete={() => setModalVisible(!modalVisible)}
                            swipeDirection={['down']}
                            style={styles.modal}
                        >
                            <View style={styles.modalContent}>
                                <Text style={[globalStyles.H3, {}]}>What would you like to post?</Text>
                            </View>
                            <View style={{alignItems: "flex-end", marginRight: 16, marginTop: -34}}>
                                <TouchableOpacity style={{alignItems: "flex-end", marginRight: 16}} onPress={() => setModalVisible(!modalVisible)}>
                                    <Ionicons name="close" size={36}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: "center"}}>
                                <TouchableOpacity 
                                    style={[globalStyles.defaultBtn, {marginTop: 24}]}
                                    onPress={() => {
                                        setModalVisible(false)
                                        navigation.navigate("RequestFormScreen")
                                    }}
                                >
                                    <Text style={globalStyles.defaultBtnLabel}>A Request for Food</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[globalStyles.secondaryBtn, {marginTop: 16}]} 
                                    onPress={() => {
                                        setModalVisible(false)
                                        navigation.navigate("OfferFormScreen")
                                    }}
                                >
                                    <Text style={globalStyles.secondaryBtnLabel}>An Offering of Food</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </View>
          })}
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
    },
    modal: {
        margin: 0,
        marginTop: Dimensions.get('window').height * 0.7,
        backgroundColor: Colors.offWhite,
        borderRadius: 10,
        elevation: 0,
      },
    modalContent: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: -34
    }
})