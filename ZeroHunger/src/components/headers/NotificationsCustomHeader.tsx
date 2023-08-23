import { Text, View } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import { Ionicons } from "@expo/vector-icons";

export const NotificationsCustomHeader = ({ navigation, title, modalVisible, setModalVisible }) => (
    <View style={{ backgroundColor: Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={globalStyles.H4}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    style={{ paddingRight: 16 }}
                    onPress={() => { setModalVisible(!modalVisible) }}
                />
            </View>
        </View>
    </View>
)