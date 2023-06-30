import { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, Image, TouchableHighlight, TextInput } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { FlashList } from "@shopify/flash-list";
import { Colors } from "../../styles/globalStyleSheet";
import moment from 'moment';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { MaterialIcons } from "@expo/vector-icons";

export const Conversations = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const { user, accessToken } = useContext(AuthContext);
    const { unreadFromUsers } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    // const [createGroup, setCreateGroup] = useState("")
    const [empty, setEmpty] = useState(false)

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axiosInstance.get("chat/conversations/", {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });

                if (res.data.length === 0) {
                    setEmpty(true)
                } else {
                    setActiveConversations(res.data);
                }
            } catch (error) {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
            }

        }
        getConversations();
    }, [user, unreadFromUsers]);

    useEffect(() => {
        if (conversations.length > 0) setEmpty(false)
    }, [conversations])

    const navigateToChat = (firstUser: string, secondUser: string) => {
        navigation.navigate('Chat', { user1: firstUser, user2: secondUser })
    }

    // const handleCreate = () => {
    //     if (user['username'].toLowerCase() === createGroup.toLowerCase()) {
    //         alert!({ type: 'open', message: 'The username you entered is your username', alertType: 'error' })
    //     } else if (!user['username'] || !createGroup) {
    //         alert!({ type: 'open', message: 'Please enter a username', alertType: 'error' })
    //     }
    //     navigateToChat(user['username'], createGroup)
    // }

    const renderItem = ({ item }) => {
        let namesAlph: string[]
        try {
            namesAlph = [user['username'], item.other_user.username].sort();
        } catch (error) {
            console.log(error);
            return
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

        const isUnread = unreadFromUsers.includes(item.other_user.username)

        return (
            <TouchableHighlight
                onPress={() => navigateToChat(namesAlph[0], namesAlph[1])}
                testID={`${namesAlph[0]}__${namesAlph[1]}.Button`}
            >
                <>
                    {!loaded && <Text>Loading...</Text>}
                    {loaded &&
                        <View testID={`${namesAlph[0]}__${namesAlph[1]}`}
                            key={item.other_user.username}
                            style={styles.conversation}
                        >
                            <View style={styles.info}>
                                <Image
                                    style={styles.profileImg}
                                    source={require('../../assets/Profile.png')}
                                />
                                <View style={styles.content}>
                                    <Text
                                        style={isUnread ? styles.usernameUnread : styles.username}
                                    >{item.other_user.username}</Text>
                                    <Text ellipsizeMode="tail"
                                        numberOfLines={2}
                                        style={isUnread ? styles.lastMessageUnread : styles.lastMessage}
                                    >{item?.last_message?.content}</Text>
                                </View>
                            </View>
                            <View>
                                {isUnread &&
                                    <View style={styles.ellipseFrame}>
                                        <View style={styles.ellipse}></View>
                                    </View>}
                                <Text style={styles.timestamp}>{timestamp ? timestamp : ''}</Text>
                            </View>
                        </View>}
                </>
            </TouchableHighlight>
        )
    };

    return (
        <View style={{ backgroundColor: Colors.Background }}>
            {!empty && conversations.length === 0 && <Text style={{ fontSize: 20 }}>Loading...</Text>}
            {empty && <Text style={{ fontSize: 20 }}>No Conversations</Text>}
            {!empty &&
                <View style={{ height: Dimensions.get('window').height - 130 }}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <MaterialIcons style={styles.searchIcon} name="search" size={24} color="black" />
                            <TextInput
                                placeholder="Search messages"
                                style={styles.searchInput}
                            />
                        </View>
                    </View>
                    <FlashList
                        data={conversations}
                        renderItem={renderItem}
                        testID="conversationsList"
                        estimatedItemSize={100}
                    />
                </View>}
        </View>
    );
}

export default Conversations

const styles = StyleSheet.create({
    conversation: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        padding: 12,
        position: 'relative',
        width: '95%'
    },
    info: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 1,
        gap: 12,
        position: 'relative',
        flexDirection: 'row'
    },
    profileImg: {
        resizeMode: 'cover',
        width: 48,
        height: 48,
        position: 'relative'
    },
    content: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 1,
        position: 'relative',
    },
    username: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 15,
        letterSpacing: 0,
        lineHeight: 18,
        marginTop: -1,
        position: 'relative',
        fontFamily: 'PublicSans_500Medium'
    },
    usernameUnread: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 15,
        letterSpacing: 0,
        lineHeight: 18,
        marginTop: -1,
        position: 'relative',
        fontFamily: 'PublicSans_600SemiBold'
    },
    lastMessage: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 13,
        letterSpacing: 0,
        lineHeight: 15.6,
        position: 'relative',
        fontFamily: 'PublicSans_400Regular'
    },
    lastMessageUnread: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 13,
        letterSpacing: 0,
        lineHeight: 15.6,
        position: 'relative',
        fontFamily: 'PublicSans_600SemiBold'
    },
    ellipseFrame: {
        alignItems: 'flex-start',
        display: 'flex',
        gap: 10,
        right: 0,
        top: 0,
        paddingVertical: 2,
        paddingHorizontal: 0,
        position: 'absolute',
    },
    ellipse: {
        backgroundColor: '#306775',
        borderRadius: 4,
        height: 8,
        minWidth: 8,
        position: 'relative',
        marginTop: 5,
        marginRight: 35
    },
    timestamp: {
        left: -15,
        top: 0,
        marginRight: 10,
        paddingVertical: 2,
        paddingHorizontal: 0,
        position: 'absolute',
        color: Colors.dark,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13.2
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        width: "100%",
        height: 45,
        marginBottom: 10,
        marginTop: 5,
        paddingHorizontal: 10,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderRadius: 10,
        paddingLeft: 7,
    },
    searchInput: {
        backgroundColor: Colors.white,
        color: '#646464',
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        lineHeight: 20.8,
        width: '50%'
    },
    searchIcon: {
        paddingTop: 10,
        paddingRight: 5
    }
})