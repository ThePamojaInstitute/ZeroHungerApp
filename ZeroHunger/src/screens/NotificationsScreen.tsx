import { View, ScrollView, Text, TouchableOpacity } from "react-native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { FlashList } from "@shopify/flash-list";

export const NotificationsScreen = ({ navigation }) => {
    return (
        <ScrollView style={{padding: 12}}>
            <View style={{padding: 12}}>
                <Text style={globalStyles.H3}>New</Text>
            </View>
            <View style={{padding: 12}}>
                <Text style={globalStyles.H3}>Older</Text>
            </View>
        </ScrollView>
    )
}

export default NotificationsScreen