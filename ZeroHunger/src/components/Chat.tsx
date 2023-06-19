import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Platform, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/ChatNotificationContext';
import { Message } from './Message';
import { Button, TextInput } from 'react-native-paper';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FlashList } from "@shopify/flash-list";


export const Chat = ({ navigation, route }) => {
    const { user, accessToken } = React.useContext(AuthContext)
    const { setChatIsOpen } = useContext(NotificationContext);

    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        // on mounting
        setChatIsOpen(true)

        // on unmounting
        return () => {
            setChatIsOpen(false)
        }
    }, [])

    const [message, setMessage] = React.useState("");
    const [messageHistory, setMessageHistory] = React.useState<object[]>([]);
    const [start, setStart] = useState(30)
    const [end, setEnd] = useState(40)

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

    const loadMessages = () => {
        if (end) {
            sendJsonMessage({
                type: `render__${start}_${end}`,
                name: user['username']
            });
            setStart(end)
            setEnd(end + 10)
        } else console.log("end!!");
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
                case "last_30_messages":
                    setMessageHistory(data.messages);
                    break
                case "render_x_to_y_messages":
                    setMessageHistory([...messageHistory, ...data.messages]);
                    break
                case "limit_reached":
                    setMessageHistory([...messageHistory, ...data.messages]);
                    setEnd(0)
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
            <FlashList
                renderItem={renderItem}
                data={messageHistory}
                onEndReached={loadMessages}
                onEndReachedThreshold={0.3}
                inverted={true}
                estimatedItemSize={100}
                testID='messagesList'
            />
            {/* {Platform.OS != 'web' &&
                <FlashList
                    inverted={true}
                    data={messageHistory}
                    renderItem={renderItem}
                    onEndReached={loadMessages}
                    onEndReachedThreshold={0.3}
                />}
            {Platform.OS === 'web' &&
                <FlatList
                    inverted={true}
                    data={messageHistory}
                    renderItem={renderItem}
                    onEndReached={loadMessages}
                    onEndReachedThreshold={0.3}
                />} */}
            <TextInput
                value={message}
                placeholder="Message"
                placeholderTextColor="#000000"
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                maxLength={250}
            />
            <Button testID='MessageSend.Button' mode="contained" onPress={handleSend}>
                Send
            </Button>
        </View>
    )
}

export default Chat