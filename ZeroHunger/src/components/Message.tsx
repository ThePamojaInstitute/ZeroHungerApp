import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MessageModel } from "../models/Message";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../../styles/globalStyleSheet";


export function Message({ message }: { message: MessageModel }) {
    const { user } = useContext(AuthContext);

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
        <View style={user['username'] === message.to_user['username'] ? styles.containerIn : styles.containerOut}>
            <View
                style={user['username'] === message.to_user['username'] ? styles.msgIn : styles.msgOut}>
                <View style={styles.subCont}>
                    <Text style={[styles.messageText,
                    {
                        color: user['username'] === message.to_user['username']
                            ? Colors.dark : Colors.white
                    }
                    ]}>{message.content}</Text>
                    <Text
                        style={[styles.timestamp,
                        {
                            color: user['username'] === message.to_user['username']
                                ? Colors.dark : Colors.white
                        }]}
                    >
                        {formatMessageTimestamp(message.timestamp)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerIn: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    containerOut: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse',
    },
    msgIn: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primaryLightest,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginleft: 20,
        marginBottom: 20
    },
    msgOut: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginRight: 20,
        marginBottom: 20
    },
    subCont: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    messageText: {
        fontSize: 15,
        fontFamily: 'PublicSans_400Regular',
        color: Colors.white,
        marginBottom: 15,
        marginRight: 35,
        alignItems: 'flex-start',
        left: 0
    },
    timestamp: {
        right: 0,
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
        fontSize: 11,
        fontFamily: 'PublicSans_400Regular',
        color: Colors.white,
        lineHeight: 13.2,
    }
});