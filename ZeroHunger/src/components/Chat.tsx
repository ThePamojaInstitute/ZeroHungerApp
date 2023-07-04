import React, { useContext, useEffect, useState, } from 'react'
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/ChatNotificationContext';
import { Message } from './Message';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FlashList } from "@shopify/flash-list";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { Char } from '../../types';


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
            if (route.params.post) {
                sendJsonMessage({
                    type: "chat_message",
                    message: route.params.post,
                    name: user['username']
                });
                route.params.post = ''
            }

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

    const handlePress = (
        title: string,
        imagesLink: string,
        postedOn: Number,
        postedBy: Number,
        description: string,
        postId: Number,
        username: string,
        type: Char
    ) => {
        //Placeholder image
        imagesLink = imagesLink ? imagesLink :
            "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"

        type === "r" ?
            navigation.navigate('RequestDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username,
            })
            :
            navigation.navigate('OfferDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username,
            })
    }

    const Post = ({ item }) => {
        const content = JSON.parse(item.content)

        return (
            <TouchableOpacity onPress={() => handlePress(
                content.title,
                content.images,
                content.postedOn,
                content.postedBy,
                content.description,
                content.postId,
                content.username,
                content.type
            )}>
                <View style={user['username'] === item.to_user['username'] ? styles.postMsgContainerIn : styles.postMsgContainerOut}>
                    <View
                        style={user['username'] === item.to_user['username'] ? styles.postMsgIn : styles.postMsgOut}>
                        <View style={styles.postMsgCont}>
                            <Image
                                style={styles.postMsgImg}
                                source={{ uri: content.images }}
                            />
                            <View style={styles.postMsgSubCont}>
                                <Text style={[styles.postMsgTitle, {
                                    color: user['username'] === item.to_user['username'] ?
                                        Colors.dark : Colors.white
                                }]}>{content.title}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                                    <Ionicons name='location-outline' size={13}
                                        style={{
                                            marginRight: 4,
                                            color: user['username'] === item.to_user['username'] ?
                                                Colors.dark : Colors.white
                                        }} />
                                    {/* Placeholder distance away */}
                                    <Text style={[globalStyles.Small2,
                                    {
                                        color: user['username'] === item.to_user['username'] ?
                                            Colors.dark : Colors.white
                                    }]}>{1}km away</Text>
                                </View>
                                <View style={styles.postMsgNeedBy}>
                                    <Text style={globalStyles.Tag}>Need in {3} days</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        if (item.id === "end") {
            return (
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>End Reached</Text>
                </View>
            )
        } else if (item.content.startsWith('{')) {
            try {
                JSON.parse(item.content)
                return <Post item={item} />
            } catch (error) { }
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
    },
    postMsgCont: {
        flexDirection: 'row',
        marginVertical: -11
    },
    postMsgSubCont: {
        marginVertical: 10,
        marginRight: 65,
        marginLeft: 5
    },
    postMsgImg: {
        height: 90,
        width: 90,
        resizeMode: 'cover',
        marginLeft: -10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 5
    },
    postMsgTitle: {
        color: Colors.dark,
        fontFamily: 'PublicSans_500Medium',
        fontSize: 15
    },
    postMsgNeedBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        marginTop: -3,
        marginBottom: -10
    },
    postMsgIn: {
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
    postMsgOut: {
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
    postMsgContainerIn: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    postMsgContainerOut: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse',
    }
});