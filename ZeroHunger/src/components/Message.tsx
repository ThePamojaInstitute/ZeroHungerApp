import { useContext } from "react";
import { Text, View } from "react-native";
import styles from "../../styles/components/messageStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";
import { MessageModel } from "../models/Message";
import { AuthContext } from "../context/AuthContext";
import { encryptMessageWithoutNonce, decryptMessageWithoutNonce } from "../controllers/message";
import { WSBaseURL, storage } from '../../config';
import { getPrivateKey } from "../controllers/publickey";


export const Message = ({ message, showTimeStamp, otherkey }: {
    message: MessageModel,
    showTimeStamp: boolean,
    otherkey: String
}) => {
    const { user, privkey } = useContext(AuthContext);

    const formatMessageTimestamp = (timestamp: string) => {
        let date = new Date(timestamp).toLocaleTimeString()
        const dateLength = date.length
        let time = date.slice(0, 5)

        if (time.at(time.length - 1) === ":") {
            time = time.slice(0, time.length - 1)
        }
        time = `${time} ${date.slice(dateLength - 2, dateLength)}`

        return time
    }

    return (
        <View
            testID="Message.container"
            style={user['username'] === message.to_user['username'] ?
                styles.containerIn : styles.containerOut}>
            <View
                testID="Message.msg"
                style={user['username'] === message.to_user['username'] ?
                    styles.msgIn : styles.msgOut}>
                <View testID="Message.subContainer" style={styles.subCont}>
                    <Text testID="Message.text" style={[styles.messageText,
                    {
                        color: user['username'] === message.to_user['username']
                            ? Colors.dark : Colors.white,
                        marginBottom: showTimeStamp ? 15 : 0
                    }
                    ]}>{decryptMessageWithoutNonce(privkey, otherkey, message.content)}</Text>
                    {showTimeStamp &&
                        <Text
                            testID="Message.timestamp"
                            style={[styles.timestamp,
                            {
                                color: user['username'] === message.to_user['username']
                                    ? Colors.dark : Colors.white
                            }]}
                        >
                            {formatMessageTimestamp(message.timestamp)}
                        </Text>
                    }
                </View>
            </View>
        </View>
    );
}

export default Message
