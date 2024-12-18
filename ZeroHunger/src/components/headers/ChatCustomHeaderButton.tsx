import { Text, View, Button, Pressable } from "react-native";
import { Colors, globalStyles } from "../../../styles/globalStyleSheet";
import styles from "../../../styles/components/chatStyleSheet"

export const ChatCustomHeaderButton = ({ sender, muteValue}) => (
    <View style={[styles.chatBar, {alignSelf: "flex-end", alignItems: "flex-end"}]}>
        <Pressable style={[ styles.muteBtn, { alignSelf: "flex-end", 
                                            backgroundColor: muteValue ? Colors.offWhite : Colors.alert2,
                                            borderColor: muteValue ? Colors.alert2 : Colors.offWhite} ]} onPress={() => sender()}>
            <Text style={[ globalStyles.Button, { marginHorizontal: 10, marginVertical: 8, color: muteValue ? Colors.alert2 : Colors.offWhite }]}>{muteOrUnmute(muteValue)}</Text>
        </Pressable>
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