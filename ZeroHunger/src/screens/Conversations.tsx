import { useContext, useEffect, useState } from "react";
import {
    View, Text, Dimensions, Image,
    TouchableHighlight, TextInput, RefreshControl, ActivityIndicator
} from "react-native";
import styles from "../../styles/screens/conversationsStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { FlashList } from "@shopify/flash-list";
import moment from 'moment';
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

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
    const [empty, setEmpty] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

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
                const orderedConversations: ConversationModel[] = res.data
                orderedConversations.sort((a, b) => {
                    const aTime = new Date(a.last_message.timestamp)
                    const bTime = new Date(b.last_message.timestamp)

                    return bTime.getTime() - aTime.getTime()
                })
                setActiveConversations(orderedConversations);
            }
        } catch (error) {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    useEffect(() => {
        getConversations();
        setFirstLoad(false)
    }, [user, unreadFromUsers]);

    useEffect(() => {
        if (conversations.length > 0) setEmpty(false)
    }, [conversations])

    const navigateToChat = (firstUser: string, secondUser: string) => {
        navigation.navigate('Chat', { user1: firstUser, user2: secondUser })
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
                            >{item?.last_message?.content}</Text>
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
    const {t, i18n} = useTranslation();
    return (
        <View testID="Conversations.container" style={{ backgroundColor: Colors.Background }}>
            {!loaded && <Text> t("home.loading.label") </Text>}
            {loaded &&
                <>
                    {empty && <Text testID="Conversations.noMsgs" style={styles.noMsgs}>No Messages</Text>}
                    {!empty && <View
                        testID="Conversations.subContainer"
                        style={{ height: Dimensions.get('window').height - 130 }}>
                        <View
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
                        </View>
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
                                    return <Text style={{ fontSize: 20 }}>No posts available</Text>
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
                    </View>}
                </>
            }
        </View>
    );
}

export default Conversations
