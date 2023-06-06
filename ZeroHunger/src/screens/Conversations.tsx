import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { Button, TextInput } from 'react-native-paper';

export const Conversations = ({ navigation }) => {
    const { user, accessToken } = useContext(AuthContext);
    const { unreadFromUsers } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    const [createGroup, setCreateGroup] = useState("")

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axiosInstance.get("http://127.0.0.1:8000/chat/conversations/", {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });
                setActiveConversations(res.data);
            } catch (error) {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
            }

        }
        getConversations();
    }, [user, unreadFromUsers]);

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

    const renderItem = ({ item }) => {
        const namesAlph = [user['username'], item.other_user.username].sort();

        return (
            <View key={item.other_user.username}>
                <Button onPress={() => navigateToChat(namesAlph[0], namesAlph[1])}>
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
            {!user && <Button onPress={() => { navigation.navigate('LoginScreen') }}>Login</Button>}
            <FlatList
                data={conversations}
                renderItem={renderItem}
            />
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