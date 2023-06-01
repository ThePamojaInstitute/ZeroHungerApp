import { useContext } from "react";
import { MessageModel } from "../models/Message";
import { AuthContext } from "../context/AuthContext";
import { StyleSheet, Text, View } from "react-native";


export function Message({ message }: { message: MessageModel }) {
    const { user } = useContext(AuthContext);

    const formatMessageTimestamp = (timestamp: string) => {
        let date = new Date(timestamp).toLocaleTimeString().slice(0, 5)

        if (date.at(date.length - 1) === ":") {
            date = date.slice(0, date.length - 1)
        }

        return date
    }

    return (
        <View style={user['username'] === message.to_user['username'] ? styles.containerRec : styles.containerSen}>
            <View
                style={user['username'] === message.to_user['username'] ? styles.msgRec : styles.msgSen}>
                <View style={styles.subCont}>
                    <Text style={{ fontSize: 20 }}>{message.content}</Text>
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 5,
                            marginLeft: 20,
                            marginRight: 5,
                            fontSize: 15,
                            lineHeight: 1
                        }}
                    >
                        {formatMessageTimestamp(message.timestamp)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerRec: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row'
    },
    containerSen: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse'
    },
    msgRec: {
        position: 'relative',
        textDecorationColor: 'gray',
        backgroundColor: '#D3D3D3'
    },
    msgSen: {
        position: 'relative',
        left: 0,
        textDecorationColor: 'gray',
        backgroundColor: '#0096FF'
    },
    subCont: {
        display: 'flex',
        alignItems: 'flex-end'
    },
});