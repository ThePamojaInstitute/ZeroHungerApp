import React, { useContext, useEffect, useState, } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/ChatNotificationContext';
import { Message } from './Message';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FlashList } from "@shopify/flash-list";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/globalStyleSheet';


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
    const [empty, setEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [endReached, setEndReached] = useState(false)
    const [inputHeight, setInputHeight] = useState(0)

    const namesAlph = [route.params.user1, route.params.user2].sort();
    const conversationName = `${namesAlph[0]}__${namesAlph[1]}`
    const reciever = namesAlph[0] === user['username'] ?
        namesAlph[1] : namesAlph[0]

    useEffect(() => {
        navigation.setOptions({
            title: reciever,
        })
    }, [])

    const handleSend = () => {
        if (message) {
            sendJsonMessage({
                type: "chat_message",
                message,
                name: user['username']
            });
            setMessage("");
            setInputHeight(0)
        }
    }

    const loadMessages = () => {
        if (end) {
            setLoading(true)
            sendJsonMessage({
                type: `render__${start}_${end}`,
                name: user['username']
            });
            setStart(end)
            setEnd(end + 10)
        } else console.log("end!!");
    }

    const { readyState, sendJsonMessage } = useWebSocket(user ? `ws://zh-backend-azure-webapp.azurewebsites.net/chats/${conversationName}/` : null, {
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
                    if (data.messages.length === 0) {
                        setEmpty(true)
                    }
                    setMessageHistory(data.messages);
                    break
                case "render_x_to_y_messages":
                    setMessageHistory([...messageHistory, ...data.messages]);
                    setLoading(false)
                    break
                case "limit_reached":
                    setLoading(false)
                    if (!empty && !endReached) {
                        const endMessage = {
                            id: "end"
                        }
                        setMessageHistory([...messageHistory, ...data.messages, endMessage]);
                        setEnd(0)
                        setEndReached(true)
                    }
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

        if (connectionStatus === "Open" && route.params.msg) {
            const msg = route.params.msg
            sendJsonMessage({
                type: "chat_message",
                message: msg,
                name: user['username']
            });
            route.params.msg = ''
        }
    }, [connectionStatus, sendJsonMessage]);

    useEffect(() => {
        if (messageHistory.length > 0) setEmpty(false)
    }, [messageHistory])

    const renderItem = ({ item }) => {
        if (item.id === "end") {
            return (
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>End Reached</Text>
                </View>
            )
        }
        return <Message key={item.id} message={item}></Message>
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text>The WebSocket is currently {connectionStatus}</Text>
            {((!empty && messageHistory.length === 0) || loading) && <Text style={{ fontSize: 20 }}>Loading...</Text>}
            {empty && !loading && <Text style={{ fontSize: 20 }}>No Messages</Text>}
            <FlashList
                renderItem={renderItem}
                data={messageHistory}
                onEndReached={loadMessages}
                onEndReachedThreshold={0.3}
                inverted={true}
                estimatedItemSize={100}
                testID='messagesList'
            />
            <View style={[styles.chatBar, inputHeight > 50 ? { height: 69 + (inputHeight - 69 + 25) } : { height: 69 }]}>
                <Entypo name="camera" size={26} color="black" style={styles.chatCameraIcom} />
                <View style={styles.chatInputContainer}>
                    <TextInput
                        value={message}
                        style={[styles.chatInput, { height: inputHeight }]}
                        placeholder="Type a message"
                        placeholderTextColor="#656565"
                        onChangeText={setMessage}
                        onSubmitEditing={handleSend}
                        maxLength={250}
                        multiline={true}
                        onContentSizeChange={event => {
                            setInputHeight(event.nativeEvent.contentSize.height);
                        }}
                        numberOfLines={3}
                    />
                    <Ionicons name="send"
                        size={22}
                        color="black"
                        style={styles.chatSendIcon}
                        onPress={handleSend}
                    />
                </View>
            </View>
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
            {/* <TextInput
                value={message}
                placeholder="Message"
                placeholderTextColor="#000000"
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                maxLength={250}
            />
            <Button testID='MessageSend.Button' mode="contained" onPress={handleSend}>
                Send
            </Button> */}
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    chatBar: {
        backgroundColor: '#f8f9fb',
        borderColor: '#eff1f7',
        borderTopWidth: 1,
        height: 69,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100
    },
    chatInputContainer: {
        width: '85%',
        marginLeft: 15,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
    },
    chatInput: {
        paddingLeft: 10,
        paddingRight: -20,
        paddingVertical: 6.5,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 15,
        maxHeight: 70,
        width: '93%'
    },
    chatCameraIcom: {
        marginBottom: 11,
        marginLeft: 5,
    },
    chatSendIcon: {
        right: 0,
        position: 'absolute',
        marginRight: 5,
        marginTop: 4.5,
        top: 0,
        bottom: 0
    }
});