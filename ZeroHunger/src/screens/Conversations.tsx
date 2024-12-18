import { useContext, useEffect, useState } from "react";
import {
    View, Text, Dimensions, Image,
    TouchableHighlight, RefreshControl, ActivityIndicator, Pressable,
    TouchableOpacity
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import styles from "../../styles/screens/conversationsStyleSheet"
import { default as buttonStyles } from "../../styles/components/chatStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance, getAccessToken } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { FlashList } from "@shopify/flash-list";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { Platform } from "expo-modules-core";
import { PublicKeyModel } from "../models/PublicKey";
import { decryptMessage1 } from "../controllers/message";
import { debounce } from "lodash"
import { updateMuteStatus } from "../controllers/flags";

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
    const { user, privateKey } = useContext(AuthContext);
    const { unreadFromUsers } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()
    const isFocused = useIsFocused()

    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    const [publickeys, setPublicKeys] = useState<PublicKeyModel[]>([]);
    // const [mutedState, setMutedState] = useState<SelfMuteModel[]>([]);
    const [empty, setEmpty] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    const getConversations = async () => {
        try {
            const res = await axiosInstance.get("chat/conversations/", {
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

                let usernames = orderedConversations.map(a => a.other_user.username)

                try {
                    let keyres = await axiosInstance.get("users/getPublicKeys", {
                        headers: {
                            Authorization: await getAccessToken()
                        }, 
                        params: {
                            users: usernames
                        }
                    })

                    setPublicKeys(keyres.data)
                    // console.log(`CONVERSATIONS ARE HERE ${JSON.stringify(orderedConversations[0])}`)

                } catch (error) {
                    console.log(`Encountered an error trying to get public keys: ${error}`)
                }
                // console.log(`CHECKPOINT HERE!!`)
                setActiveConversations(orderedConversations);
            }
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    function findArrayByUser(array, username: String) {
        return array.find((element) => {
            return element.username == username
        })
    }

    useEffect(() => {
        getConversations();
        setFirstLoad(false)
    }, [user, unreadFromUsers]);

    useEffect(() => {
        if (conversations.length > 0) setEmpty(false)
    }, [conversations])

    useEffect(() => {
        if (!isFocused) return

        getConversations();
        setFirstLoad(false)
    }, [isFocused])

    const navigateToChat = (firstUser: string, secondUser: string, otherPub: string) => {
        navigation.navigate('Chat', { user1: firstUser, user2: secondUser, otherPub: otherPub })
    }

    const refresh = () => {
        getConversations()
    }

    // useEffect(() => {
    //     if (conversations) 
    //         console.log(`CONVERSATIONS: ${JSON.stringify(conversations)}`)
    // }, [conversations])

    const handleMute = (conversation, other_username) => {
        updateMuteStatus(conversation)
        setActiveConversations(conversations.map(convo => ({...convo, self_muted: (other_username == convo.other_user.username) ? !convo.self_muted : convo.self_muted})))
    }

    const debouncedMute = debounce(handleMute, 250)

    const renderItem = ({ item }) => {
        let namesAlph: string[]
        try {
            namesAlph = [user['username'], item.other_user.username].sort();
        } catch (error) {
            console.log(error);
            return
        }

        let otherPub: string
        try {
            otherPub = findArrayByUser(publickeys, item.other_user.username)['publickey']

        } catch (error) {
            otherPub = "undefined"
        }

        const now = moment.utc().local()
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

        // item.self_muted.setState(!item.self_muted)
        // console.log(item.state)

        const isUnread = unreadFromUsers.includes(item.other_user.username)
        // const [muteStatus, updateMuteStatus] = useState((item.self_muted) ? "Unmute" : "Mute")

        // console.log(`HERE IS EACH CONVERSATION: ${JSON.stringify(item)}`)
        // let usernames = orderedConversations.map(a => a.other_user.username)

        // setMessageHistory( data.messages.map(mes => ({
        //     ...mes,
        //     content: decryptMessage1(privateKey, route.params.otherPub, mes.content)
        // })) )

        return (
            <View style={{display: "flex", flexDirection: "row"}}>


                <View style={[ buttonStyles.chatBar, {marginLeft: 5, width: "18%", alignItems: "flex-end", alignSelf: "center" }]}>
                    <Pressable style={[ buttonStyles.muteBtn, { width: "100%", borderColor: item.self_muted ? Colors.alert2 : Colors.offWhite, backgroundColor: item.self_muted ? Colors.offWhite : Colors.alert2}]}
                    onPress={() => { debouncedMute(`${namesAlph[0]}__${namesAlph[1]}`, item.other_user.username); }}>
                        <Text style={[ globalStyles.Button, buttonStyles.convMuteBtnText, {color: item.self_muted ? Colors.alert2 : Colors.offWhite } ]}>
                            {(item.self_muted) ? "Unmute" : "Mute"}
                        </Text>
                    </Pressable>
                </View>

                {/* <View style={[styles.chatBar, {maxWidth: "12%", width: "12%", marginRight: 20, paddingRight: 10, alignItems: "flex-end"}]}>
                <Pressable style={[ styles.muteBtn, { backgroundColor: Colors.alert, width: "100%"} ]} onPress={() => sender()}>
                    <Text style={[ globalStyles.Button, { marginHorizontal: 10, marginVertical: 8, color: Colors.offWhite }]}>{muteValue}</Text>
                </Pressable>
                </View> */}
                {/* <Text style={styles.mute} 
                onPress={() => {handleMute(`${namesAlph[0]}__${namesAlph[1]}`); 
                                setActiveConversations(conversations.map(convo => ({...convo, self_muted: (item.other_user.username == convo.other_user.username) ? !convo.self_muted : convo.self_muted} )))}} >
                    {(item.self_muted) ? "Unmute" : "Mute"}
                </Text> */}
                <TouchableHighlight
                    onPress={() => navigateToChat(namesAlph[0], namesAlph[1], otherPub)}
                    testID={`Conversation.${namesAlph[0]}__${namesAlph[1]}`}
                    style={{width: '82%'}}
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
                                >{(otherPub == "undefined") ? "[Message]" :
                                ((item.last_message.content.startsWith('{'))? "[Post]" : decryptMessage1(privateKey, otherPub, item.last_message.content))}</Text>

                                {/* // >{(otherPub == "undefined") ? item?.last_message?.content : decryptMessage1(privateKey, otherPub, item.last_message.content)}</Text> */}
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
            </View>
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
