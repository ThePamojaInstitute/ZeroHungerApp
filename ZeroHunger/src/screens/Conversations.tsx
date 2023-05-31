import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { axiosInstance } from "../../config";
import { ConversationModel } from "../models/Conversation";
import { Button, TextInput } from 'react-native-paper';

export const Conversations = ({ navigation }) => {
    const { user, accessToken } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()
    const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);
    const [create, setCreate] = useState("")

    useEffect(() => {
        const getConversations = async () => {
            const res = await axiosInstance.get("http://127.0.0.1:8000/chat/conversations/", {
                headers: {
                    Authorization: `${accessToken}`
                }
            });

            if (res.data.length == 0) {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
            }

            setActiveConversations(res.data);
        }
        getConversations();
    }, [user]);


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
        navigateToChat(user['username'], create)
    }

    return (
        <View>
            {!user && <Button onPress={() => { navigation.navigate('LoginScreen') }}>Login</Button>}
            {conversations.map((c) => {
                const namesAlph = [user['username'], c.other_user.username].sort();

                return (
                    <View key={c.other_user.username}>
                        <Button onPress={() => navigateToChat(namesAlph[0], namesAlph[1])}>{`${namesAlph[0]}__${namesAlph[1]}`}</Button>
                        <View>
                            <Text>{c.other_user.username}</Text>
                            <View >
                                <Text >{c.last_message?.content}</Text>
                                <Text>{formatMessageTimestamp(c.last_message?.timestamp)}</Text>
                            </View>
                        </View>
                    </View>
                )
            })}
            <View>
                <Text>Create Chat with:</Text>
                <TextInput
                    value={create}
                    placeholder="Chat with(username)"
                    placeholderTextColor="#000000"
                    onChangeText={setCreate}
                />
                <Button onPress={handleCreate}>Create</Button>
            </View>

        </View>
    );
}