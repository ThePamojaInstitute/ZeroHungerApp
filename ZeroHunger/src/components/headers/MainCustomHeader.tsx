import { Text, View } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import { Ionicons } from "@expo/vector-icons";

export const MainCustomHeader = ({ title, color }) => (
    <View style={{ backgroundColor: color }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={globalStyles.H4}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
            </View>
        </View>
    </View>
)