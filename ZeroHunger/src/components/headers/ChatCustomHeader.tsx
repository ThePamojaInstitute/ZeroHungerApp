import { Text, View, Button, Pressable } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import styles from "../../../styles/components/chatStyleSheet"
import { Ionicons } from "@expo/vector-icons";
import { ChatCustomHeaderButton } from "./ChatCustomHeaderButton";

export const ChatCustomHeader = ({ navigation, username, sender, muteValue}) => (
    <View style={{ backgroundColor: Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '92%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={globalStyles.H4}>{username}</Text>
            </View>
            <View style={[styles.chatBar, {maxWidth: "12%", width: "12%", marginRight: 20, paddingRight: 10, alignItems: "flex-end"}]}>
                <View style={[styles.chatBar, {alignSelf: "flex-end", alignItems: "flex-end"}]}>
                    <Pressable style={[ styles.muteBtn, { alignSelf: "flex-end", 
                                            backgroundColor: muteValue ? Colors.offWhite : Colors.alert2,
                                            borderColor: muteValue ? Colors.alert2 : Colors.offWhite} ]} onPress={() => sender()}>
                        <Text style={[ globalStyles.Button, { marginHorizontal: 10, marginVertical: 8, color: muteValue ? Colors.alert2 : Colors.offWhite }]}>{muteOrUnmute(muteValue)}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </View>
)

const muteOrUnmute = (muted: boolean) => {
    console.log(`Mute or unmute function called`)
    if (muted) {
        return "Unmute"
    } else {
        return "Mute"
    }
}