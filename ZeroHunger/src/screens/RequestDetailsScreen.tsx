import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { deletePost } from "../controllers/post";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";

export const RequestDetailsScreen = ({ navigation }) => {
    let route: RouteProp<{
        params: {
            title: string,
            imagesLink: string,
            postedOn: string,
            postedBy: string,
            description: string,
            postId: Number,
            username: string,
        }
    }> = useRoute()

    const { dispatch: alert } = useAlert()
    const { user, accessToken } = useContext(AuthContext);

    const [message, setMessage] = useState('')

    const sendMsg = () => {
        // Send msg function blocked until username/user id complete
        // alert!({ type: 'open', message: 'Error: Message not sent!', alertType: 'error' })
        navigation.navigate('Chat', { user1: user['username'], user2: route.params.username, msg: message })
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titleText}>{route.params.title}</Text>
            <Image
                style={styles.image}
                source={{
                    uri: route.params.imagesLink
                }}
            />
            <Text style={styles.headerText}>Description</Text>
            <View style={{ width: "30%" }}>
                <Text style={styles.text}>
                    {route.params.description == "" ? "No Description" : route.params.description}
                </Text>
            </View>
            <Text style={styles.headerText}>Poster Information</Text>
            <Text style={styles.text}>{route.params.username === user['username'] ? 'You' : route.params.username}</Text>
            {user['username'] != route.params.username &&
                <View style={{ height: 500 }}>
                    <Text style={styles.headerText}>Have this item? Send {route.params.username} a message.</Text>
                    <View style={styles.messageInputView}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder={"Hi " + route.params.username + ", I have " + route.params.title + " to share, would you like to meet?"}
                            placeholderTextColor="#000000"
                            style={styles.inputText}
                            multiline={true}
                            maxLength={1024}
                            scrollEnabled={true}
                        />
                    </View>
                    <TouchableOpacity style={globalStyles.defaultBtn} onPress={sendMsg}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>
            }
            {user && user['username'] === route.params.username &&
                <View>
                    <Button buttonColor="red"
                        mode="contained"
                        onPress={() => {
                            deletePost("r", route.params.postId, accessToken)
                            navigation.navigate("HomeScreen")
                        }}
                    >Delete Post</Button>
                </View>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        // marginTop: 20,
        backgroundColor: Colors.Background,
        // textAlign: 'center',
    },
    titleText: {
        padding: 10,
        fontSize: 50,
        fontWeight: 'bold',
    },
    image: {
        // flex: 1,
        resizeMode: 'cover',
        width: '25%',
        height: '25%',
        padding: 8,
        marginLeft: 8,
    },
    headerText: {
        fontSize: 24,
        padding: 8,
    },
    text: {
        padding: 8,
    },
    inputText: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        fontSize: 15,
        textAlignVertical: "top",
        // height: 40,
    },
    messageInputView: {
        // flex: 1,
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "90%",
        height: 100,
        // marginBottom: 8,
        marginTop: 10,
        marginLeft: 8,
    },
    // sendBtn: {
    //     // flex: 1,
    //     width: 75,
    //     borderRadius: 25,
    //     marginLeft: 500,
    //     height: 50,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     backgroundColor: "#E7E0EC",
    // },
})

export default RequestDetailsScreen