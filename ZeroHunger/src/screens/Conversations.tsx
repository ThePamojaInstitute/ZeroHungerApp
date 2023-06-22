import { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { Button, TextInput } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import { Colors } from "../../styles/globalStyleSheet";
import { logOutUser } from "../controllers/auth";

export const Conversations = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext);
    const { unreadFromUsers } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    const [createGroup, setCreateGroup] = useState("")
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

    const formatMessageTimestamp = (timestamp?: string) => {
        if (!timestamp) return;

        let date = new Date(timestamp).toLocaleTimeString().slice(0, 5)

        if (date.at(date.length - 1) === ":") {
            date = date.slice(0, date.length - 1)
        }

        return date
    }

    const navigateToChat = (firstUser: string, secondUser: string) => {
        navigation.navigate('Chat', { user1: firstUser, user2: secondUser })
    }

    const handleCreate = () => {
        navigateToChat(user['username'], createGroup)
    }


    const handleLogOut = (e: GestureResponderEvent) => {
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => {
            alert!({ type: 'open', message: 'Logged out successfully!', alertType: 'success' })
            navigation.navigate('LoginScreen')
        }).catch(() => {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        })
    }

    const renderItem = ({ item }) => {
        const namesAlph = [user['username'], item.other_user.username].sort();

        return (
            <View testID={`${namesAlph[0]}__${namesAlph[1]}`} key={item.other_user.username}>
                <Button onPress={() => navigateToChat(namesAlph[0], namesAlph[1])}
                    testID={`${namesAlph[0]}__${namesAlph[1]}.Button`}
                >
                    {`${namesAlph[0]}__${namesAlph[1]}`}
                </Button>
                {item.last_message && (<View style={{ marginLeft: 10 }}>
                    <Text>From {item.last_message.from_user.username === user['username']
                        ? `Me` : item.last_message.from_user.username}
                    </Text>
                    <View>
                        {unreadFromUsers.includes(item.other_user.username) &&
                            <Text style={{ color: 'red' }}>You have unread messages</Text>
                        }
                        <Text >Last message: {item.last_message?.content}</Text>
                        <Text>{formatMessageTimestamp(item.last_message?.timestamp)}</Text>
                    </View>
                </View>)}
            </View>
        )
    };

    return (
        <View>
            {!empty && conversations.length === 0 && <Text style={{ fontSize: 20 }}>Loading...</Text>}
            {empty && <Text style={{ fontSize: 20 }}>No Conversations</Text>}
            <View style={{ height: Dimensions.get("screen").height - 350, width: Dimensions.get("screen").width }}>
                <FlashList
                    data={conversations}
                    renderItem={renderItem}
                    testID="conversationsList"
                    estimatedItemSize={100}
                />
            </View>
            <TouchableOpacity testID="LogOut.Button" style={styles.logOutBtn} onPress={handleLogOut}>
                <Text style={styles.logOutBtnText}>Log Out</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20 }}>
                <Text>Create Chat with:</Text>
                <TextInput
                    value={createGroup}
                    placeholder="Chat with(username)"
                    placeholderTextColor="#000000"
                    onChangeText={setCreateGroup}
                    onSubmitEditing={handleCreate}
                />
                <Button onPress={handleCreate}>Create</Button>
            </View>
        </View>
    );
}

export default Conversations

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
        // marginBottom: 100,
        // position: 'absolute',
        // width: '100%',
        // height: '100%',
        // bottom: 100,
        // alignItems: 'center',
        // justifyContext: 'center',
    },
    landingPageText: {
        // flex: 1,
        marginTop: 10,
        marginLeft: 25,
        marginBottom: 60,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    logOutBtn: {
        width: "7%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "#6A6A6A",
    },
    logOutBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
    deleteBtn: {
        title: "Login",
        width: "8%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "red",
    },
    deleteBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
    pressable: {
        flexDirection: 'row',
        marginLeft: 4,
        marginRight: 25,
        borderBottomWidth: 4,
        // borderBottomColor: 'rgba(48, 103, 117, 0)',
    },
    pressableText: {
        fontSize: 30,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    categoryText: {
        marginTop: 20,
        marginLeft: 25,
        fontSize: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 10,
    },
    feed: {
        fontSize: 30,
        marginTop: 35,
        marginLeft: 25,
    },
})