import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAlert } from "../context/Alert";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const RequestDetailsScreen = () => {
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
    const { user } = useContext(AuthContext);

    const sendMsg = () => {
        // Send msg function blocked until username/user id complete
        alert!({ type: 'open', message: 'Error: Message not sent!', alertType: 'error' })
    }

    return (
        <ScrollView style={{ flex: 1 }}>
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
                <>
                    <Text style={styles.headerText}>Need this item? Send {route.params.username} a message.</Text>
                    <View style={styles.messageInputView}>
                        <TextInput
                            placeholder={"Hi " + route.params.username + ", I need " + route.params.title + ", would you like to meet?"}
                            placeholderTextColor="#000000"
                            style={styles.inputText}
                            multiline={true}
                            maxLength={1024}
                        />
                    </View>
                    <TouchableOpacity style={styles.sendBtn} onPress={sendMsg}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleText: {
        padding: 10,
        fontSize: 50,
        fontWeight: 'bold',
    },
    image: {
        //Image styling is buggy
        resizeMode: 'cover',
        width: '20%',
        height: '40%',
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
    },
    messageInputView: {
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "30%",
        height: 100,
        marginBottom: 8,
        marginTop: 10,
        marginLeft: 8
    },
    sendBtn: {
        width: 75,
        borderRadius: 25,
        marginLeft: 500,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E7E0EC",
    },
})

export default RequestDetailsScreen