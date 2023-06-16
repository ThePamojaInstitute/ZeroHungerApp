import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from '../screens/Loginscreen';
import CreateAccountScreen from '../screens/CreateAccountScreen'
import LandingPageScreen from '../screens/HomeScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import OfferFormScreen from '../screens/OfferFormScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import Conversations from '../screens/Conversations';
import Chat from './Chat';
import { Colors } from '../../styles/globalStyleSheet';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator>
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
                name="HomeScreen" 
                component={LandingPageScreen}
                options={{
                    title: "Zero Hunger",
                    headerTitleAlign: 'left',
                    headerStyle: {
                        backgroundColor: Colors.offWhite
                    },
                    headerLeft: () => (
                        <Ionicons 
                            style={{padding:16}}
                            name="menu" 
                            size={22}
                            onPress={() => {}}
                        />
                    ),
                    headerRight: () => (
                        <View style={{flex: 1, flexDirection: 'row'}}>
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

const BottomTab = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeStackNavigator}
          options={{headerShown: false}}
        />
        {/* <Tab.Screen
          name="Post"
          component={null}
        /> */}
        <Tab.Screen 
          name="Conversations" 
          component={ChatStackNavigator}
        />
      </Tab.Navigator>
    )
  }

export default BottomTab