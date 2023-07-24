import { View, Text, Image, TextInput, TouchableOpacity, LogBox } from "react-native";
import styles from "../../styles/screens/postDetailsStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PostModel } from "../models/Post";
import { formatPostalCode, handleAccessNeeds, handleLogistics } from "../controllers/post";

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

export const OfferDetailsScreen = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    let route: RouteProp<{
        params: PostModel
    }> = useRoute()

    const { user } = useContext(AuthContext);

    const [message, setMessage] = useState("Hi " + route.params.username + ", is this still available?")
    const [inputHeight, setInputHeight] = useState(0)
    const [alertMsg, setAlertMsg] = useState('')

    if (!loaded) return <Text>Loading...</Text>

    const sendMsg = () => {
        if (!message) {
            setAlertMsg("Please enter a message")
            return
        }

        const post = {
            title: route.params.title,
            images: route.params.imageLink,
            postedOn: route.params.postedOn,
            postedBy: route.params.postedBy,
            description: route.params.description,
            postId: route.params.postId,
            username: route.params.username,
            type: "o"
        }
        navigation.navigate('Chat', {
            user1: user['username'],
            user2: route.params.username, msg: message, post: JSON.stringify(post)
        })
    }

    const logistics = handleLogistics(route.params.logistics)
    const postalCode = formatPostalCode(route.params.postalCode)
    const accessNeeds = handleAccessNeeds(route.params.accessNeeds)

    // const renderItem = ({ item }) => {
    //     return (
    //         <TouchableOpacity>
    //             <Image
    //                 style={{ height: 200, width: 200 }}
    //                 source={{ uri: item.imageLink }}
    //             />
    //         </TouchableOpacity>
    //     )
    // }

    return (
        <ScrollView testID="OffDet.container" style={styles.container}>
            {/* <FlashList
                renderItem={renderItem}
                data={images}
                horizontal={true}
                estimatedItemSize={166}
                testID="OffDet.imgsList"
            /> */}
            {route.params.imageLink &&
                <TouchableOpacity>
                    <Image
                        style={{ height: 200, width: 200 }}
                        source={{ uri: route.params.imageLink }}
                    />
                </TouchableOpacity>
            }
            <View>
                <Text testID="OffDet.title" style={[globalStyles.H2, { paddingTop: 12 }]}>{route.params.title}</Text>
                {/* Your post */}
                {user['username'] == route.params.username && <>
                    <View testID="OffDet.subContainer" style={styles.subContainer}>
                        <View testID="OffDet.location" style={{ flexDirection: "row" }}>
                            <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                            {/* Placeholder postal code */}
                            <Text testID="OffDet.locationText" style={[globalStyles.Small2, { textTransform: 'uppercase' }]}>{postalCode}</Text>
                        </View>
                        {/* TODO: Implement edit posts */}
                        <View>
                            <TouchableOpacity
                                testID="OffDet.editBtn"
                                style={[globalStyles.secondaryBtn, {
                                    marginTop: 0,
                                    width: 'auto',
                                    padding: 10
                                }]}
                                onPress={() => { }}
                            >
                                <MaterialCommunityIcons name="pencil-box-outline" size={21} />
                                <Text testID="OffDet.editBtnLabel" style={globalStyles.secondaryBtnLabel}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>}

                {/* Send message option if posted by other user */}
                {user['username'] != route.params.username && <>
                    <View testID="OffDet.subContainer" style={styles.subContainer}>
                        <View testID="OffDet.location" style={styles.location}>
                            <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                            {/* Placeholder distance away */}
                            <Text testID="OffDet.distanceText" style={globalStyles.Small2}>{route.params.distance ? route.params.distance : 'x'} km away</Text>
                        </View>
                    </View>

                    <View testID="OffDet.sendMsgCont" style={styles.sendMessage}>
                        <Text testID="OffDet.sendMsgLabel" style={[globalStyles.H4, { padding: 12 }]}>Send a message</Text>
                        <TextInput
                            testID="OffDet.msgInput"
                            value={message}
                            onChangeText={newText => {
                                setMessage(newText)
                                setAlertMsg('')
                            }}
                            onChange={() => setAlertMsg('')}
                            placeholder={"Type a message"}
                            placeholderTextColor={Colors.midDark}
                            style={[styles.inputText,
                            (alertMsg ? { maxHeight: inputHeight + 1, borderWidth: 1, borderColor: Colors.alert2 } :
                                { maxHeight: inputHeight })]}
                            multiline={true}
                            numberOfLines={2}
                            maxLength={1024}
                            scrollEnabled={false}
                            onContentSizeChange={event => {
                                setInputHeight(event.nativeEvent.contentSize.height);
                            }}
                        />
                        {alertMsg && <Text testID="OffDet.alertMsg" style={styles.alertMsg}>{alertMsg}</Text>}
                        <View testID="OffDet.sendMsgBtnCont" style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity
                                testID="OffDet.sendMsgBtn"
                                style={[globalStyles.defaultBtn, styles.defaultBtn]}
                                onPress={sendMsg}
                            >
                                <Text testID="OffDet.sendMsgBtnLabel" style={globalStyles.defaultBtnLabel}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>}

                <View testID="OffDet.description" style={styles.information}>
                    <Text testID="OffDet.discLabel" style={[globalStyles.H4, { paddingBottom: 12, paddingTop: 20 }]}>Description</Text>
                    <View style={{ paddingBottom: 12 }}>
                        <Text testID="OffDet.discBody" style={globalStyles.Body}>
                            {route.params.description ? route.params.description : "No Description"}
                        </Text>
                    </View>
                </View>
                <View testID="OffDet.posterInfo" style={styles.information}>
                    <Text testID="OffDet.posterInfoLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Poster Information</Text>
                    <View testID="OffDet.posterInfoCont" style={{ flexDirection: "row", marginRight: 12 }}>
                        <Ionicons name="person-circle-sharp" color="#B8B8B8" size={40} />
                        <View>
                            <Text
                                testID="OffDet.posterUsername"
                                style={[
                                    globalStyles.H5,
                                    {
                                        marginLeft: 3,
                                        marginTop: 2
                                    }]}
                            >{route.params.username}</Text>
                            <View testID="OffDet.locationDet" style={styles.location}>
                                <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                                {/* Placeholder postal code */}
                                <Text testID="OffDet.locationDetText" style={globalStyles.Small2}>XXXXXX</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View testID="OffDet.details" style={styles.information}>
                    <Text testID="OffDet.detailsLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Offer Details</Text>
                    <View testID="OffDet.detailsSub" style={{ flexDirection: "row" }}>
                        <View style={{ marginRight: 24 }}>
                            <Text testID="OffDet.detailCat" style={[globalStyles.Small1, styles.smallText]}>Food category</Text>
                            <Text testID="OffDet.detailsQuant" style={[globalStyles.Small1, styles.smallText]}>Quantity</Text>
                            <Text testID="OffDet.detailsReq" style={[globalStyles.Small1, styles.smallText]}>Dietary requirements</Text>
                        </View>
                        {/* Temporary details values */}
                        <View style={{ flexShrink: 1 }}>
                            <Text testID="OffDet.detailCatVal" style={[globalStyles.Small1, { marginBottom: 8 }]}>N/A</Text>
                            <Text testID="OffDet.detailsQuantVal" style={[globalStyles.Small1, { marginBottom: 8 }]}>N/A</Text>
                            <Text testID="OffDet.detailsReqVal" style={globalStyles.Small1}>N/A</Text>
                        </View>
                    </View>
                </View>
                <View testID="OffDet.meetPref" style={styles.information}>
                    <Text testID="OffDet.meetPrefLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Meeting Preferences</Text>
                    <View testID="OffDet.meetPrefSubCont" style={{ flexDirection: "row" }}>
                        <View style={{ marginRight: 24 }}>
                            <Text testID="OffDet.meetPrefPickOrDel" style={[globalStyles.Small1, styles.smallText]}>Pick up or delivery preference</Text>
                            <Text testID="OffDet.meetPrefPostal" style={[globalStyles.Small1, styles.smallText]}>Postal code</Text>
                            <Text testID="OffDet.meetPrefPostal" style={[globalStyles.Small1, styles.smallText]}>Access needs</Text>
                        </View>
                        <View style={{ flexShrink: 1 }}>
                            <Text testID="OffDet.meetPrefPickOrDelVal" style={[globalStyles.Small1, { marginBottom: 8 }]}>{logistics}</Text>
                            <Text testID="OffDet.meetPrefPostalVal" style={[globalStyles.Small1, { textTransform: 'uppercase', marginBottom: 8 }]}>{postalCode}</Text>
                            <Text testID="ReqDet.meetPrefPostalVal" style={globalStyles.Small1}>{accessNeeds}</Text>
                        </View>
                    </View>
                </View>
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
        borderRadius: 10,
        fontSize: 16,
        height: 60,
        borderWidth: 1,
        borderColor: Colors.midLight
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
        borderWidth: 1,
        borderColor: Colors.midLight
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
    }
})

export default RequestDetailsScreen

export default OfferDetailsScreen

