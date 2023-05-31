import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Message } from './Message';
import { Button, TextInput } from 'react-native-paper';
import useWebSocket, { ReadyState } from "react-use-websocket";


export const Chat = ({ navigation, route }) => {
    const { user, accessToken } = React.useContext(AuthContext)

    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
    }, [])

    const [message, setMessage] = React.useState("");
    const [messageHistory, setMessageHistory] = React.useState<any>([]);

    const namesAlph = [route.params.user1, route.params.user2].sort();
    const conversationName = `${namesAlph[0]}__${namesAlph[1]}`

    const handleSend = () => {
        if (message) {
            sendJsonMessage({
                type: "chat_message",
                message,
                name: user['username']
            });
            setMessage("");
        }
    }

    const { readyState, sendJsonMessage } = useWebSocket(user ? `ws://127.0.0.1:8000/chats/${conversationName}/` : null, {
        queryParams: {
            token: user ? accessToken : ""
        },
        onOpen: () => {
            console.log("WebSocket connected!");
        },
        onClose: () => {
            console.log("WebSocket disconnected!");
        },
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case 'chat_message_echo':
                    setMessageHistory([data.message, ...messageHistory]);
                    sendJsonMessage({ type: "read_messages" });
                    break;
                case "last_50_messages":
                    setMessageHistory(data.messages);
                    break
                default:
                    console.error("Unknown message type!");
                    break;
            }
        }
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
    }[readyState];

    useEffect(() => {
        if (connectionStatus === "Open") {
            sendJsonMessage({
                type: "read_messages"
            });
        }
    }, [connectionStatus, sendJsonMessage]);

    const renderItem = ({ item }) => (
        <Message key={item.id} message={item}></Message>
    );

    return (
        <View style={{ flex: 1 }}>
            {!user && <Button onPress={() => { navigation.navigate('LoginScreen') }}>Login</Button>}
            <Text>The WebSocket is currently {connectionStatus}</Text>
            <FlatList
                inverted
                data={messageHistory}
                renderItem={renderItem}
            />
            <TextInput
                value={message}
                placeholder="Message"
                placeholderTextColor="#000000"
                onChangeText={setMessage}
            />
            <Button mode="contained" onPress={handleSend}>
                Send
            </Button>
        </View>
    )
}
