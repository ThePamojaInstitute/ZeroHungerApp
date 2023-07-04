import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { deletePost } from "../controllers/post";
import { useAlert } from "../context/Alert";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { FlashList } from "@shopify/flash-list";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
            array: object[],
            setArray: React.Dispatch<React.SetStateAction<object[]>>
        }
    }> = useRoute()

    const { dispatch: alert } = useAlert()
    const { user, accessToken } = useContext(AuthContext);

    const [message, setMessage] = useState("Hi " + route.params.username + ", do you still need this? I have some to share")
    const [inputHeight, setInputHeight] = useState(0)

    const sendMsg = () => {
        const post = {
            title: route.params.title,
            images: route.params.imagesLink,
            postedOn: route.params.postedOn,
            postedBy: route.params.postedBy,
            description: route.params.description,
            postId: route.params.postId,
            username: route.params.username,
            type: "r"
        }
        navigation.navigate('Chat', { user1: user['username'], user2: route.params.username, msg: message, post: JSON.stringify(post) })
    }

    const handleDelete = (postId: Number) => {
        deletePost("r", postId, accessToken).then(res => {
            if (res.msg == "success") {
                route.params.setArray(route.params.array.filter(item => item['postId'] != postId))
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
        }).then(() => navigation.navigate('HomeScreen'))
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity>
                <Image
                    style={{ height: 200, width: 200 }}
                    source={{ uri: item.imagesLink }}
                />
            </TouchableOpacity>
        )
    }

    const images = [
        { imagesLink: route.params.imagesLink }
    ]

    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    return (
        <ScrollView style={styles.container}>
            <FlashList
                renderItem={renderItem}
                data={images}
                horizontal={true}
                estimatedItemSize={166}
            // contentContainerStyle={{paddingLeft: 12}}
            />
            <View>
                <Text style={[globalStyles.H2, { paddingTop: 12 }]}>{route.params.title}</Text>

                {/* Your post */}
                {user['username'] == route.params.username && <>
                    <View style={styles.yourPost}>
                        <View style={{ flexDirection: "row" }}>
                            <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                            {/* Placeholder postal code */}
                            <Text style={globalStyles.Small2}>XXXXXX</Text>
                        </View>

                        {/* TODO: Implement edit posts */}
                        <View>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => { }}>
                                <MaterialCommunityIcons name="pencil-box-outline" size={21} />
                                <Text style={globalStyles.secondaryBtnLabel}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>}

                {/* Send message option if posted by other user */}
                {user['username'] != route.params.username && <>
                    <View style={styles.yourPost}>
                        <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                            <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                            {/* Placeholder distance away */}
                            <Text style={globalStyles.Small2}>{1} km away</Text>
                        </View>

                        {/* Temporary need by date */}
                        <View style={styles.needBy}>
                            <Text style={globalStyles.Tag}>Need in {3} days</Text>
                        </View>
                    </View>

                    <View style={styles.sendMessage}>
                        <Text style={[globalStyles.H4, { padding: 12 }]}>Send a message</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder={"Type a message"}
                            placeholderTextColor={Colors.midDark}
                            style={[styles.inputText, { maxHeight: inputHeight }]}
                            multiline={true}
                            numberOfLines={2}
                            maxLength={1024}
                            scrollEnabled={false}
                            onContentSizeChange={event => {
                                setInputHeight(event.nativeEvent.contentSize.height);
                            }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity style={styles.defaultBtn} onPress={sendMsg}>
                                <Text style={globalStyles.defaultBtnLabel}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>}

                <View style={styles.information}>
                    <Text style={[globalStyles.H4, { paddingBottom: 12, paddingTop: 20 }]}>Description</Text>
                    <View style={{ paddingBottom: 12 }}>
                        <Text style={globalStyles.Body}>
                            {route.params.description == "" ? "No Description" : route.params.description}
                        </Text>
                    </View>
                </View>
                <View style={styles.information}>
                    <Text style={[globalStyles.H4, { paddingBottom: 12 }]}>Poster Information</Text>
                    <View style={{ flexDirection: "row", marginRight: 12 }}>
                        <Ionicons name="person-circle-sharp" color="#B8B8B8" size={40} />
                        <View>
                            <Text style={[
                                globalStyles.H5,
                                {
                                    marginLeft: 3,
                                    marginTop: 2
                                }]}
                            >{route.params.username}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                                <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                                {/* Placeholder postal code */}
                                <Text style={globalStyles.Small2}>XXXXXX</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.information}>
                    <Text style={[globalStyles.H4, { paddingBottom: 12 }]}>Request Details</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ marginRight: 24 }}>
                            <Text style={[styles.Small1, { marginBottom: 8 }]}>Food category</Text>
                            <Text style={[styles.Small1, { marginBottom: 8 }]}>Quantity</Text>
                            <Text style={styles.Small1}>Dietary Requirements</Text>
                        </View>
                        {/* Temporary details values */}
                        <View>
                            <Text style={[globalStyles.Small1, { marginBottom: 8 }]}>N/A</Text>
                            <Text style={[globalStyles.Small1, { marginBottom: 8 }]}>N/A</Text>
                            <Text style={[globalStyles.Small1]}>N/A</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.information}>
                    <Text style={[globalStyles.H4, { paddingBottom: 12 }]}>Meeting Preferences</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ marginRight: 24 }}>
                            <Text style={[styles.Small1, { marginBottom: 8 }]}>Pick Up or Delivery Preference</Text>
                            <Text style={styles.Small1}>Postal Code</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.Small1, { marginBottom: 8 }]}>Pick Up, Delivery</Text>
                            <Text style={[globalStyles.Small1]}>XXXXXX</Text>
                        </View>
                    </View>
                </View>

                {user && user['username'] === route.params.username &&
                    <View style={{ height: 300 }}>
                        <Button buttonColor="red"
                            mode="contained"
                            onPress={() => handleDelete(route.params.postId)}
                            style={{ width: '80%' }}
                        >Delete Post</Button>
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        // marginTop: 20,
        // backgroundColor: Colors.Background,
        backgroundColor: Colors.offWhite
        // textAlign: 'center',
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
        backgroundColor: Colors.white,
        marginLeft: 12,
        marginRight: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
    },
    messageInputView: {
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "90%",
        height: 100,
        // marginBottom: 8,
        marginTop: 10,
        marginLeft: 8,
    },
    defaultBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: "40%",
        gap: 10,
        position: 'relative',
        marginTop: 11,
        marginBottom: 16,
        marginRight: 11,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primary,
    },
    secondaryBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        // width: "15%",
        padding: 10,
        gap: 10,
        position: 'relative',
        // marginTop: 30,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primaryMid,
    },
    sendMessage: {
        backgroundColor: Colors.Background,
        borderRadius: 10,
    },
    information: {
        // padding: 12,
        paddingTop: 12,
        paddingBottom: 20,
        // paddingBottom: 8,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight
    },
    Small1: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.midDark,
        marginBottom: 8
    },
    yourPost: {
        flexDirection: "row",
        marginTop: 4,
        // marginBottom: 12,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        // marginLeft: 12
    },
    needBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4
    }
})

export default RequestDetailsScreen