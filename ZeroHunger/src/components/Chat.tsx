import React, { useContext, useEffect, useState, } from 'react'
import { Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator, Pressable, Platform } from 'react-native';
import styles from "../../styles/components/chatStyleSheet"
import { Colors, globalStyles } from '../../styles/globalStyleSheet';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/ChatNotificationContext';
import { Message } from './Message';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FlashList } from "@shopify/flash-list";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Char } from '../../types';
import { WSBaseURL, storage } from '../../config';
// import { storage } from '../../config'
import { handleExpiryDate } from '../controllers/post';
import { encryptMessage, decryptMessage, encryptMessageWithoutNonce, decryptMessageWithoutNonce } from '../controllers/message';
import { ENV } from '../../env';
import { ChatCustomHeader } from './headers/ChatCustomHeader';
import { axiosInstance, getAccessToken } from "../../config";
import { MessageModel } from "../models/Message";
import nacl from "tweetnacl"
import { encodeBase64, decodeBase64, decodeUTF8, encodeUTF8 } from "tweetnacl-util"
import { getPrivateKey } from '../controllers/publickey';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { addPublicKey } from '../controllers/publickey';


export const Chat = ({ navigation, route }) => {
    const { user, accessToken, privkey } = React.useContext(AuthContext)
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
    const [refreshing, setRefreshing] = React.useState(false)
    // const [selfkey, setSelfKey] = useState("")
    const [messageHistory, setMessageHistory] = React.useState<object[]>([]);
    const [start, setStart] = useState(20)
    const [end, setEnd] = useState(30)
    const [empty, setEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [endReached, setEndReached] = useState(false)
    const [inputHeight, setInputHeight] = useState(0)
    const [initiated, setInitiated] = useState(false)
    const [initiatedTimeStampForMe, setInitiatedTimeStampForMe] = useState(false)
    const [initiatedTimeStampForOther, setInitiatedTimeStampForOther] = useState(false)

    const addPublicKey = async () => {
        const { user, accessToken, privkey } = React.useContext(AuthContext)
        try {
            const res = await axiosInstance.post('users/addPublicKey', {
                data: {
                    user: user['username'],
                    publickey: storage.getString('pubkey'),
                    username: user['username'],
                },
                headers: {
                    Authorization: await getAccessToken()
                }
            });
            console.log(res)
        } catch(error) {
            console.log(error)
        }
    }

    const getKeys = async () => {
        try {
            const res = await axiosInstance.get("users/getPublicKeys", {
                headers: {
                    Authorization: await getAccessToken()
                },
                data: {
                    users: [receiver]
                },
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getMessages = async () => {
        try {
            const res = await axiosInstance.get(`chat/messageHistory`, {
                headers: {
                    Authorization: await getAccessToken()
                },
                params: {
                    'conversation': conversationName
                }
            });
            // console.log("got this far")
            if (res.data.length === 0) {
                setEmpty(true)
            } else {
                const orderedMessages: MessageModel[] = res.data
                // orderedMessages.sort((a, b) => {
                //     const aTime = new Date(a.timestamp)
                //     const bTime = new Date(b.timestamp)

                //     return bTime.getTime() - aTime.getTime()
                // })
                setMessageHistory(orderedMessages)
                setLoading(false)
                setEndReached(true)
            }
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    // useEffect(() => {
    //     setRefreshing(true)
    //     let interval = setInterval(() => {
    //         getMessages()
    //     }, 1000)
    //     return () => {
    //         clearInterval(interval)
    //         setRefreshing(false)
    //     }
    //     // setRefreshing(false)
    // }, [])

    let lastFromMeRendered = false
    let lastFromOtherRendered = false

    const namesAlph = [route.params.user1, route.params.user2].sort();
    const conversationName = `${namesAlph[0]}__${namesAlph[1]}`
    const receiver = namesAlph[0] === user['username'] ?
        namesAlph[1] : namesAlph[0]

    useEffect(() => {
        if (Platform.OS === 'web') {
            navigation.setOptions({
                header: ({ navigation }) => (
                    <ChatCustomHeader
                        navigation={navigation}
                        username={receiver}
                    />
                )
            })
        } else {
            navigation.setOptions({
                title: receiver,
            })
        }
    }, [])
    //////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if(!endReached) {
            console.log(`Receiver: ${receiver}`)

            // let newtest = nacl.box.keyPair.fromSecretKey(nacl.randomBytes(nacl.box.secretKeyLength))

            // let origmes = "Hello World!"

            // let nonce = encodeBase64(nacl.randomBytes(nacl.box.nonceLength))

            // let testmes = encryptMessage(storage.getString('privkey'), encodeBase64(newtest.publicKey), origmes)
            // let testmes = encryptMessage(storage.getString('privkey'), route.params.other_pub, origmes, nonce)
            // let testmes = encryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), route.params.other_pub, origmes)
            // console.log(`WE TEST HERE (ENCRYPTED): ${testmes}`)
            // // let decmes = decryptMessage(storage.getString('privkey'), encodeBase64(newtest.publicKey), testmes)
            // let decmes = decryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), route.params.other_pub, testmes)
            // console.log(`WE TEST HERE (DECRYPTED): ${decmes}`)
        }
    }, [endReached])

    const getPublicKeys = async () => {
        try {
            const res = await axiosInstance.get(`users/getPublicKey`, {
                headers: {
                    Authorization: await getAccessToken()
                },
                params: {
                    'user': receiver
                }
            });

            
        } catch(error) {
            console.log(error)
        }
    }

    

    //////////////////////////////////////////////////////////////////////////////////////

    
    const handleSend = () => {
        if (message) {
            // console.log(`UBER OMEGA TESTING: ${getPrivateKey()}`)
            // let newmes = encryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), route.params.other_pub, message)
            // try {
            //     console.log(`obtained private key @ sending: ${getPrivateKey()}`)
            // } catch(error) {
            //     console.log(`error encountered @ sending: ${error}`)
            // }

            sendJsonMessage({
                // axiosInstance
                type: "chat_message",
                // message: message,//encryptMessage(storage.getString('privkey'), route.params.other_pub, message),
                message: encryptMessageWithoutNonce(privkey, route.params.other_pub, message),
                name: user['username']
            });
            setMessage("");
            setInputHeight(30)
        }
    }

    const loadMessages = () => {
        if (!initiated) return

        if (end) {
            // if (Platform.OS === 'web') {
            //     setSelfKey(storage.getString(user['username'] + 'privkey'))
            // } else {
            //     AsyncStorage.getItem(user['username'] + 'privkey').then((key) => {
            //         setSelfKey(key)
            //     })
            // }
            // console.log(`key during load messages: ${selfkey}`)
            setLoading(true)
            sendJsonMessage({
                type: `render__${start}_${end}`,
                name: user['username']
            });
            setStart(end)
            setEnd(end + 10)
        } else console.log("end!!");
    }

    const sendMessage = async(post: {
        postData: {
            // conversation: string,
            from_user: string,
            to_user: string,
            content: string,
            // timestamp: string, //unsure
            // read: boolean
        }
    }) => {
        try {
            // const res = await axiosInstance.post('/posts/createPost', post)
            const res = await axiosInstance.post('/chat/sendMessage', post)
    
            if (res.status === 201) {
                return { msg: "success", res: res.data }
            } else {
                return { msg: "message failure", res: res.data }
            }
        } catch (error) {
            return { msg: "message failure", res: error }
        }
    }

    const submitMessage = async (data: object) => {
        const res = await sendMessage({
            postData: {
                to_user: receiver,
                from_user: user['username'],
                content: message,
            }
        })
        // Error handling here
    }

    const handleMessage = async(data:object) => {
        if (!user || !user['user_id']) {
            alert!({ type: 'open', message: 'You are not logged in!', alertType: 'error' })
            navigation.navigate('LoginScreen')
            return
        } else if (loading) {
            return
        }
        if (message) { //message is not empty
            try{
                await submitMessage(data)
                setMessage("");
                setInputHeight(30)
            } catch(error) {
                alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
            }
        }

        // setLoading(true)
        // try{
        //     await submitMessage(data)
        //     setLoading(false)
        // } catch(error) {
        //     setLoading(false)
        //     alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
        // }
    }
    

    // rewrite with axiosInstance
    const { readyState, sendJsonMessage } = useWebSocket(user ? `${WSBaseURL}chats/${conversationName}/` : null, {
        // axiosInstance instead of useWebSocket here
        queryParams: {
            token: user ?
                ENV === 'production' ? storage.getString('access_token') : accessToken
                : ""
        },
        onOpen: () => {
            console.log("WebSocket connected!");
        },
        onClose: () => {
            console.log("WebSocket disconnected!");
        },
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            // console.log(`DATA IS FOUND HERE: ${JSON.stringify(data.message.content)}`)
            // console.log(`MESSAGE IS FOUND HERE: ${JSON.stringify(data.content)}`)
            // console.log(`selfkey at onmessage: ${selfkey}`)

            // try {
            //     console.log(`obtained private key @ onmessage: ${getPrivateKey()}`)
            // } catch(error) {
            //     console.log(`error encountered @ onmessage: ${error}`)
            // }
            switch (data.type) {
                case 'chat_message_echo':
                    // console.log(`ECHO DATA IS FOUND HERE: ${data.message.content}`)
                    // console.log(`ATTEMPTING TO DO STUFF: ${decryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), route.params.other_pub, data.message.content)}`)
                    setMessageHistory([data.message, ...messageHistory]);
                    sendJsonMessage({ type: "read_messages" });
                    break;
                case "last_30_messages":
                    setInitiated(true)
                    if (data.messages.length === 0) {
                        setEmpty(true)
                    } else setMessageHistory(data.messages);
                    break
                case "render_x_to_y_messages":
                    setMessageHistory([...messageHistory, ...data.messages]);
                    setLoading(false)
                    break
                case "limit_reached":
                    setLoading(false)
                    if (!empty && !endReached) {
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
            // let nonce = 
            if (route.params.post) {
                sendJsonMessage({
                    type: "chat_message",
                    message: route.params.post,
                    name: user['username']
                });
                route.params.post = ''
            }

            console.log(`WE'RE NOW AT CHAT, HERE'S THE PRIVATEKEY123: ${privkey}`)
            //testing right here
            const msg = route.params.msg
            sendJsonMessage({
                type: "chat_message",
                message: encryptMessageWithoutNonce(privkey, route.params.other_pub, msg),
                // message: msg,
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
        postedOn: number,
        postedBy: number,
        description: string,
        postId: number,
        username: string,
        expiryDate: string,
        distance: number | null,
        logistics: Char[],
        categories: Char[],
        diet: Char[],
        accessNeeds: string,
        postalCode: string,
        type: Char
    ) => {
        type === "r" ?
            navigation.navigate('RequestDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username,
                expiryDate,
                distance,
                logistics,
                categories,
                diet,
                accessNeeds,
                postalCode,
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
                expiryDate,
                distance,
                logistics,
                categories,
                diet,
                accessNeeds,
                postalCode,
            })
    }

    // IMPORTANT TO NOTE THIS WAS NOT UPDATED TO REFLECT DIFFERENT RESPONSE RECEIVED FROM API
    const Post = ({ item }) => {
        const content = JSON.parse(item.content)

        const [expiryStr, expiryInDays] = handleExpiryDate(content.expiryDate, content.type)

        return (
            <TouchableOpacity testID='Chat.postPrev' onPress={() => handlePress(
                content.title,
                content.images,
                content.postedOn,
                content.postedBy,
                content.description,
                content.postId,
                content.username,
                content.expiryDate,
                content.distance,
                content.logistics,
                content.categories,
                content.diet,
                content.accessNeeds,
                content.postalCode,
                content.type
            )}>
                <View
                    testID='Chat.postCont'
                    style={user['username'] === item.to_user['username']
                        ? styles.postMsgContainerIn : styles.postMsgContainerOut}
                >
                    <View
                        testID='Chat.postMsg'
                        style={user['username'] === item.to_user['username'] ?
                            styles.postMsgIn : styles.postMsgOut}>
                        <View testID='Chat.postMsgCont' style={styles.postMsgCont}>
                            {<Image
                                testID='Chat.postMsgImg'
                                style={styles.postMsgImg}
                                source={content.images ? { uri: content.images } : require('../../assets/Post.png')}
                            />}
                            <View>
                                <View testID='Chat.postMsgSubCont' style={styles.postMsgSubCont}>
                                    <Text
                                        testID='Chat.postMsgTitle'
                                        style={[styles.postMsgTitle, {
                                            color: user['username'] === item.to_user['username'] ?
                                                Colors.dark : Colors.white
                                        }]}
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                    >{content.title}</Text>
                                    <View testID='Chat.postMsgLocation' style={[styles.postMsgLocation,
                                    (user['username'] === content.username) ? { opacity: 0, height: 0 } : {}]}>
                                        <Ionicons name='location-outline' size={13}
                                            testID='Chat.postMsgLocationIcon'
                                            style={{
                                                marginRight: 4,
                                                color: user['username'] === item.to_user['username'] ?
                                                    Colors.dark : Colors.white
                                            }} />
                                        {/* Placeholder distance away */}
                                        <Text testID='Chat.postMsgDistance' style={[globalStyles.Small2,
                                        {
                                            color: user['username'] === item.to_user['username'] ?
                                                Colors.dark : Colors.white
                                        }]}>{content.distance ? content.distance.toFixed(1) : 'x'} km away</Text>
                                    </View>
                                </View>
                                <View testID='Chat.postMsgNeedBy' style={[styles.postMsgNeedBy]}>
                                    <Text testID='Chat.postMsgTag' style={globalStyles.Tag}>{expiryStr}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        if (item.content.startsWith('{')) {
            try {
                JSON.parse(item.content)
                return <Post key={item.id} item={item} />
            } catch (error) { }
        }
        let showTimeStamp = false // was: let showTimeStamp = false
        if (item.from_username === user['username'] && !lastFromMeRendered && !initiatedTimeStampForMe) {
            setInitiatedTimeStampForMe(true)
            lastFromMeRendered = true
            showTimeStamp = true
            // console.log("item is owned by user!")
        } else if (item.from_username !== user['username'] && !lastFromOtherRendered && !initiatedTimeStampForOther) {
            setInitiatedTimeStampForOther(true)
            lastFromOtherRendered = true
            showTimeStamp = true
            // console.log("item is not owned by user!")
        }

        // console.log(`CONTENT HERE! ${item.content}`)
        // item.content = decryptMessage(storage.getString('privkey'), route.params.other_pub, item.content)
        // item.content = decryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), route.params.other_pub, item.content)

        return <Message
            key={item.id}
            message={item}
            showTimeStamp={showTimeStamp}
            otherkey = {route.params.other_pub}
        />
    }


    return (
        <View testID='Chat.container' style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                {/* <Text>The WebSocket is currently {connectionStatus}</Text> */}
                {/* {(!empty && messageHistory.length === 0) && <ActivityIndicator animating size="large" color={Colors.dark} />} */}
                {empty && !loading && <Text testID='Chat.noMsgs' style={styles.noMsgs}>No Messages</Text>}
                <FlashList
                    renderItem={renderItem}
                    data={messageHistory}
                    onEndReached={loadMessages}
                    onEndReachedThreshold={0.3}
                    inverted={true}
                    estimatedItemSize={235}
                    testID='Chat.messagesList'
                    showsVerticalScrollIndicator={false}
                    // ListFooterComponent={endReached ?
                    //     <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: 10 }}
                    //     >End Reached</Text> : <ActivityIndicator animating size="large" color={Colors.dark} />}
                    ListFooterComponent={!endReached ?
                        <ActivityIndicator animating size="large" color={Colors.primaryDark} /> : <></>}
                />
            </View>
            <View
                testID='Chat.chatBar'
                style={[styles.chatBarContainer, inputHeight > 50 ?
                    { height: 69 + (inputHeight - 69 + 25) } : { height: 69 }]}>
                <View style={[styles.chatBar, Platform.OS === 'web' ? styles.chatBarAlignWidth : {}]}>
                    <Entypo testID='Chat.chatCameraIcon' name="camera" size={26} color="black" style={styles.chatCameraIcon} />
                    <View testID='Chat.chatInputContainer' style={styles.chatInputContainer}>
                        <TextInput
                            testID='Chat.chatInput'
                            value={message}
                            style={[styles.chatInput, { height: inputHeight }]}
                            placeholder="Type a message"
                            placeholderTextColor="#656565"
                            onChangeText={setMessage}
                            onSubmitEditing={handleSend}
                            maxLength={250}
                            multiline={true}
                            onContentSizeChange={event => {
                                const height = event.nativeEvent.contentSize.height
                                if (height === 0) return

                                setInputHeight(height);
                            }}
                            numberOfLines={3}
                        />
                    </View>
                    <Pressable style={styles.sendBtn} onPress={handleSend}>
                        <Text style={[globalStyles.Button, { color: Colors.offWhite, marginHorizontal: 10 }]}>Send</Text>
                    </Pressable>
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
            /> */}
        </View>
    )
}

export default Chat
