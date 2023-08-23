import { Text, View } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import { Ionicons } from "@expo/vector-icons";

export const WebCustomHeader = ({ navigation, title }) => (
    <View style={{ backgroundColor: title === 'Zero Hunger' ? Colors.Background : Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginLeft: -30 }}>
                <Text style={globalStyles.H4}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
            </View>
        </View>
    </View>
)