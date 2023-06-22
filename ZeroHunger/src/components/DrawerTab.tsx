import { View, Image } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTab from "./BottomTab";

const Drawer = createDrawerNavigator()

const AccountSettings = () => {
    return (
        <View>
        
        </View>
    )
}

const RequestOfferHistory = () => {
    return null
}

const DrawerTab = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="test" component={BottomTab} options={{headerShown: false}}/>
            <Drawer.Screen name="settings" component={AccountSettings}/>
            <Drawer.Screen name="history" component={RequestOfferHistory}/>
        </Drawer.Navigator>
    )
}

export default DrawerTab