import { useContext, useEffect, useState } from "react";
import {
    View, Text, Dimensions, Image,
    TouchableHighlight, RefreshControl, ActivityIndicator, Pressable
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import styles from "../../styles/screens/conversationsStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance, getAccessToken, storage } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { PublicKeyModel } from "../models/PublicKey";
import { FlashList } from "@shopify/flash-list";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { Platform } from "expo-modules-core";
import nacl from "tweetnacl"
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from "tweetnacl-util"
import { encryptMessage, decryptMessage, encryptMessageWithoutNonce, decryptMessageWithoutNonce } from "../controllers/message";
import { getPrivateKey } from "../controllers/publickey";

const NoMessages = ({ navigate }) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.15,
        paddingHorizontal: 50,
    }}>
        <Text
            style={[globalStyles.H2, { marginBottom: 10, textAlign: 'center' }]}>
            No messages yet
        </Text>
        <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
            start a conversation by replying to a food request or offer
        </Text>
        <Pressable
            style={[globalStyles.defaultBtn, { width: '90%' }]}
            onPress={() => navigate('HomeScreen')}
        >
            <Text style={globalStyles.defaultBtnLabel}>
                Back to Home
            </Text>
        </Pressable>
    </View>
)

export const Conversations = ({ navigation }) => {
    const { user, privkey } = useContext(AuthContext);
    const { unreadFromUsers } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()
    const isFocused = useIsFocused()

    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    const [publickeys, setPublicKeys] = useState<PublicKeyModel[]>([]);
    const [empty, setEmpty] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    const getConversations = async () => {
        console.log(`GETTING CONVERSATIONS, authprivkey: ${privkey}, real: ${storage.getString(user['username'] + 'privkey')}`)
        // storage.delete('enctest1privkey')
        // storage.delete('enctest1pubkey')
        // storage.delete('enctest2privkey')
        // storage.delete('enctest2pubkey')
        // storage.delete('enctest3privkey')
        // storage.delete('enctest3pubkey')
        // storage.delete('enctest4privkey')
        // storage.delete('enctest4pubkey')
        try {
            let res = await axiosInstance.get("chat/conversations/", {
                headers: {
                    Authorization: await getAccessToken()
                }
            });

            if (res.data.length === 0) {
                setEmpty(true)
            } else {
                const orderedConversations: ConversationModel[] = res.data
                orderedConversations.sort((a, b) => {
                    const aTime = new Date(a.last_message.timestamp)
                    const bTime = new Date(b.last_message.timestamp)

                    return bTime.getTime() - aTime.getTime()
                })
                // console.log(`got conversations`)
                let usernames = orderedConversations.map(a => a.other_user.username)
                // console.log(`Conversations: ${usernames}`)
                // console.log(`List: ${[1, 2 , 3, 4]}`)
                // console.log(`Convo 1: ${usernames[0]}`)
                // console.log(`Manipulating content: ${orderedConversations.map(a => a.last_message.content = "Hello world")}`)
                // console.log(`Usernames: ${usernames}`)
                try {
                    // console.log(`STRINGIFY USERNAMES: ${JSON.stringify(usernames)}`)
                    let keyres = await axiosInstance.get("users/getPublicKeys", {
                        headers: {
                            Authorization: await getAccessToken()
                        },
                        params: {
                            users: usernames
                            // users: ["nicktest"]
                        },
                    });

                    // let res = await axiosInstance.get("users/getPublicKeys", {
                    //     data: "test"
                    // });

                    // console.log(`TESTING RESPONSE HERE HELLO ${res.data}`)
                    const publickeys: PublicKeyModel[] = keyres.data
                    console.log(`${JSON.stringify(keyres.data)}`)
                    setPublicKeys(keyres.data)
                    // orderedConversations.map(a => a.last_message.content = decryptMessage(storage.getString('privkey'), findArrayByUser(keyres.data, a.other_user.username)['publickey'], a.last_message.content))
                    // decryptMessage(self_privatekey, other_user_publickey, content)
                    // console.log(`${JSON.stringify(findArrayByUser(keyres.data, 'nickellee'))}`)
                    // console.log(`Nickellee key: ${findArrayByUser(keyres.data, 'nickellee')['publickey']}`)
                    // console.log(`Saved private key: ${storage.getString('pubkey')}, obtained publickey: ${findArrayByUser(keyres.data, user['username'])['publickey']}`)
                    // console.log(`Is ${findArrayByUser(keyres.data, 'nickellee')['publickey']}`)
                    // console.log(`Public keys: ${publickeys}`)

                    const keyPair1 = nacl.box.keyPair.fromSecretKey(nacl.randomBytes(nacl.box.secretKeyLength))
                    const keyPair2 = nacl.box.keyPair.fromSecretKey(nacl.randomBytes(nacl.box.secretKeyLength))

                    let enc = encryptMessageWithoutNonce(encodeBase64(keyPair1.secretKey), encodeBase64(keyPair2.publicKey), "Hello world")
                    let dec1 = decryptMessageWithoutNonce(encodeBase64(keyPair2.secretKey), encodeBase64(keyPair1.publicKey), enc)
                    let dec2 = decryptMessageWithoutNonce(encodeBase64(keyPair1.secretKey), encodeBase64(keyPair2.publicKey), enc)

                    console.log(`DECRYPT FOR OTHER USER: ${dec1}`)
                    console.log(`DECRYPT WITH SELF USER: ${dec2}`)

                } catch (error) {
                    console.log(error)
                }
                // orderedConversations.map(a => a.last_message.content)
                //const values = conversations.map(a => a.other_user.username)
                setActiveConversations(orderedConversations);
            }
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    function findArrayByUser(array, username) {
        return array.find((element) => {
            return element.username == username
        })
    }
    // const getPublicKeys = async () => {
    //     let res = await axiosInstance.get("chat/conversations/");
    //     console.log(res)
    // }

    useEffect(() => {
        // getPublicKeys()
        getConversations();
        setFirstLoad(false)
    }, [user, unreadFromUsers]);

    useEffect(() => {
        // console.log(`Length?: ${conversations.length}`)
        if (conversations.length > 0) {
            setEmpty(false)
            const values = conversations.map(a => a.other_user.username)
            // setPublicKeys(conversations.map(a => a.other_user.username))
            // console.log(`Public keys: ${publickeys}`)
            // console.log(`Values: ${values.toString()}`)
        }
    }, [conversations])

    useEffect(() => {
        // console.log(`publickeys: ${publickeys}`)
    }, [publickeys])

    useEffect(() => {
        if (!isFocused) return

        getConversations();
        setFirstLoad(false)
    }, [isFocused])

    const navigateToChat = (firstUser: string, secondUser: string, otherPub: string) => {
        navigation.navigate('Chat', { user1: firstUser, user2: secondUser, other_pub: otherPub })
    }

    const refresh = () => {
        getConversations()
    }

    const renderItem = ({ item }) => {
        let namesAlph: string[]
        try {
            namesAlph = [user['username'], item.other_user.username].sort();
        } catch (error) {
            console.log(error);
            return
        }
        console.log(`FOUND KEY?: ${findArrayByUser(publickeys, item.other_user.username)}`)
        if(findArrayByUser(publickeys, item.other_user.username)) {
            console.log(`HERE IS ${item.other_user.username}'s KEY: ${findArrayByUser(publickeys, item.other_user.username)['publickey']}`)
        }
        // console.log(item)
        // console.log(findArrayByUser(publickeys, item.other_user).toString())
        // try{
        //     if (findArrayByUser(publickeys, item.other_user)['publickey']) {
        //         item.last_message.content = decryptMessage(storage.getString('privkey'), findArrayByUser(publickeys, item.other_user)['publickey'].toString(), item.last_message.content)
        //     }
        //     // item.last_message.content = decryptMessage(storage.getString('privkey'), findArrayByUser(publickeys, item.other_user)['publickey'].toString(), item.last_message.content)
        //     // console.log(`Nickellee key: ${findArrayByUser(keyres.data, 'nickellee')['publickey']}`)
        // } catch (error) {
        //     console.log(error)
        //     return
        // }
        if (item.last_message) {
            // item.last_message.content = decryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), findArrayByUser(publickeys, item.other_user.username)['publickey'], item.last_message.content)
            // console.log(`PUBLIC KEYS: ${JSON.stringify(publickeys[0])}`)
            console.log(`PUBLIC KEYS AGAIN: ${findArrayByUser(publickeys, item.other_user.username)['publickey']}`)
            console.log(`LAST MESSAGE: ${item.last_message.content}`)
        }

        const now = moment.utc().local()
        // console.log(item)
        let timestamp = item.last_message ?
            moment.utc(item.last_message.timestamp).local().startOf('seconds').fromNow()
            : ""

        if (timestamp) {
            if (timestamp.includes('second')) {
                timestamp = 'now'
            } else if (timestamp.includes('minute')) {
                const time = timestamp.split(' ')
                if (timestamp.startsWith("a")) {
                    timestamp = `1m`
                } else {
                    timestamp = `${time[0]}m`
                }
            } else if (timestamp.includes('hour')) {
                if (timestamp.startsWith("a")) {
                    timestamp = `1h`
                } else {
                    const time = timestamp.split(' ')
                    timestamp = `${time[0]}h`
                }
            } else if (timestamp.includes('day')) {
                if (timestamp.startsWith("a")) {
                    timestamp = `1d`
                } else {
                    const time = timestamp.split(' ')
                    timestamp = `${time[0]}d`
                }
            } else {
                const diff = moment.duration(now.diff(item.last_message.timestamp))
                timestamp = `${Math.floor(diff.asWeeks()).toString()}w`
            }
        }

        const isUnread = unreadFromUsers.includes(item.other_user.username)

        console.log(`DOES AUTH CONTEXT WORK: ${privkey}`)

        // try {
        //     console.log(`got private key ${getPrivateKey()}`)
        // } catch (error) {
        //     console.log(`found error ${error}`)
        // }

        return (
            <TouchableHighlight
                onPress={() => {
                    // item.last_message.content = encryptMessageWithoutNonce(storage.getString(user['username'] + 'privkey'), findArrayByUser(publickeys, item.other_user.username)['publickey'], item.last_message.content)
                    // styles.content = decryptMessageWithoutNonce()
                    navigateToChat(namesAlph[0], namesAlph[1], findArrayByUser(publickeys, item.other_user.username)['publickey'])
                }}
                testID={`Conversation.${namesAlph[0]}__${namesAlph[1]}`}
            >
                <View
                    testID={`Conversation.${namesAlph[0]}__${namesAlph[1]}Cont`}
                    key={item.other_user.username}
                    style={styles.conversation}
                >
                    <View testID="Conversation.info" style={styles.info}>
                        <Image
                            testID="Conversation.profileImg"
                            style={styles.profileImg}
                            source={require('../../assets/Profile.png')}
                        />
                        <View testID="Conversation.content" style={styles.content}>
                            <Text
                                testID="Conversation.username"
                                style={isUnread ? styles.usernameUnread : styles.username}
                            >{item.other_user.username}</Text>
                            <Text
                                testID="Conversation.lastMsg"
                                ellipsizeMode="tail"
                                numberOfLines={2}
                                style={isUnread ? styles.lastMessageUnread : styles.lastMessage}
                            >{decryptMessageWithoutNonce(privkey, findArrayByUser(publickeys, item.other_user.username)['publickey'], item.last_message.content)}</Text>
                        </View>
                    </View>
                    <View>
                        {isUnread &&
                            <View testID="Conversation.ellipseFrame" style={styles.ellipseFrame}>
                                <View testID="Conversation.ellipse" style={styles.ellipse}></View>
                            </View>}
                        <Text
                            testID="Conversation.timestamp"
                            style={styles.timestamp}
                        >{timestamp ? timestamp : ''}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };
    const { t, i18n } = useTranslation();
    return (
        <View
            testID="Conversations.container"
            style={Platform.OS === 'web' ? styles.container : { backgroundColor: Colors.offWhite }}>
            {empty && <NoMessages navigate={navigation.navigate} />}
            {!empty && <View
                testID="Conversations.subContainer"
                style={{ height: Dimensions.get('window').height - 130 }}>
                {/* <View
                    testID="Conversations.searchContainer"
                    style={styles.searchContainer}>
                    <View
                        testID="Conversations.searchInputContainer"
                        style={styles.searchInputContainer}>
                        <MaterialIcons
                            style={styles.searchIcon}
                            name="search"
                            size={24}
                            color="black" />
                        <TextInput
                            testID="Conversations.searchInput"
                            placeholder="Search messages"
                            style={styles.searchInput}
                        />
                    </View>
                </View> */}
                {conversations.length === 0 &&
                    <ActivityIndicator animating size="large" color={Colors.primary} />}
                <FlashList
                    data={conversations}
                    renderItem={renderItem}
                    testID="Conversations.List"
                    estimatedItemSize={100}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                            colors={[Colors.primary, Colors.primaryLight]}
                        />
                    }
                    ListEmptyComponent={() => {
                        if (empty) {
                            return <Text style={{ fontSize: 20 }}>No Messages</Text>
                        }
                        else if (firstLoad) {
                            return <ActivityIndicator
                                animating
                                size="large"
                                color={Colors.primary}
                            />
                        }
                    }}
                />
            </View>
            }
        </View>
    );
}

export default Conversations
