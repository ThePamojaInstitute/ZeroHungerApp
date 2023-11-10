import { View, Text, Image, TextInput, TouchableOpacity, LogBox } from "react-native";
import styles from "../../styles/screens/postDetailsStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PostModel } from "../models/Post";
import { formatPostalCode, getCategory, getDiet, getLogisticsType, handleExpiryDate, handlePreferences } from "../controllers/post";

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

export const RequestDetailsScreen = ({ navigation }) => {
    let route: RouteProp<{
        params: PostModel
    }> = useRoute()

    const { user } = useContext(AuthContext);

    const [message, setMessage] = useState("Hi " + route.params.username + ", do you still need this? I have some to share")
    const [inputHeight, setInputHeight] = useState(0)
    const [alertMsg, setAlertMsg] = useState('')
    const [heights, setHeights] = useState({
        'categories': 0,
        'diet': 0,
        'logistics': 0,
        'accessNeeds': 0
    })

    const sendMsg = () => {
        if (!message) {
            setAlertMsg("Please enter a message")
            return
        }

        const post = {
            title: route.params?.title,
            images: route.params?.imageLink,
            postedOn: route.params?.postedOn,
            postedBy: route.params?.postedBy,
            description: route.params?.description,
            postId: route.params?.postId,
            username: route.params?.username,
            expiryDate: route.params?.expiryDate,
            distance: route.params?.distance,
            logistics: route.params?.logistics,
            categories: route.params?.categories,
            diet: route.params?.diet,
            accessNeeds: route.params?.accessNeeds,
            postalCode: route.params?.postalCode,
            type: "r"
        }
        navigation.navigate('Chat', {
            user1: user['username'],
            user2: route.params.username, msg: message, post: JSON.stringify(post)
        })
    }

    const logistics = handlePreferences(route.params?.logistics?.sort().toString(), getLogisticsType)
    const postalCode = formatPostalCode(route.params?.postalCode)
    const categories = handlePreferences(route.params?.categories?.sort().toString(), getCategory)
    const diet = handlePreferences(route.params?.diet?.sort().toString(), getDiet)
    const [expiryStr, expiryInDays] = handleExpiryDate(route.params.expiryDate, route.params.type)

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
        <View style={{ height: '100%', backgroundColor: Colors.offWhite }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                testID="ReqDet.container"
                style={styles.container}
            >
                {/* <FlashList
                renderItem={renderItem}
                data={images}
                horizontal={true}
                estimatedItemSize={166}
                testID="ReqDet.imgsList"
            /> */}
                {!!route.params.imageLink &&
                    <TouchableOpacity>
                        <Image
                            style={{ height: 200, width: 200 }}
                            source={{ uri: route.params.imageLink }}
                        />
                    </TouchableOpacity>
                }
                <View>
                    <Text testID="ReqDet.title" style={[globalStyles.H2, { paddingTop: 12 }]}>{route.params.title}</Text>
                    {/* Your post */}
                    {user['username'] == route.params.username &&
                        <>
                            <View testID="ReqDet.subContainer" style={styles.subContainer}>
                                <View testID="ReqDet.location" style={{ flexDirection: "row" }}>
                                    <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                                    {/* Placeholder postal code */}
                                    <Text testID="ReqDet.locationText" style={[globalStyles.Small2, { textTransform: 'uppercase' }]}>{postalCode}</Text>
                                </View>
                                {/* TODO: Implement edit posts */}
                                {/* <View>
                                <TouchableOpacity
                                    testID="ReqDet.editBtn"
                                    style={[globalStyles.secondaryBtn, {
                                        marginTop: 0,
                                        width: 'auto',
                                        padding: 10
                                    }]}
                                    onPress={() => { }}
                                >
                                    <MaterialCommunityIcons name="pencil-box-outline" size={21} />
                                    <Text testID="ReqDet.editBtnLabel" style={globalStyles.secondaryBtnLabel}>Edit</Text>
                                </TouchableOpacity>
                            </View> */}
                            </View>
                        </>
                    }

                    {/* Send message option if posted by other user */}
                    {user['username'] != route.params.username && <>
                        <View testID="ReqDet.subContainer" style={styles.subContainer}>
                            <View testID="ReqDet.location" style={styles.location}>
                                <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                                {/* Placeholder distance away */}
                                <Text testID="ReqDet.distanceText" style={globalStyles.Small2}>{route.params.distance ? `${route.params.distance.toFixed(1)} km away` : 'N/A'}</Text>
                            </View>

                            <View testID="ReqDet.needBy" style={styles.needBy}>
                                <Text testID="ReqDet.needByTag" style={styles.Tag}>{expiryStr}</Text>
                            </View>
                        </View>

                        <View testID="ReqDet.sendMsgCont" style={styles.sendMessage}>
                            <Text testID="ReqDet.sendMsgLabel" style={[globalStyles.H4, { padding: 12 }]}>Send a message</Text>
                            <TextInput
                                testID="ReqDet.msgInput"
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
                            {alertMsg && <Text testID="ReqDet.alertMsg" style={styles.alertMsg}>{alertMsg}</Text>}
                            <View testID="ReqDet.sendMsgBtnCont" style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity
                                    testID="ReqDet.sendMsgBtn"
                                    style={[globalStyles.defaultBtn, styles.defaultBtn]}
                                    onPress={sendMsg}
                                >
                                    <Text testID="ReqDet.sendMsgBtnLabel" style={globalStyles.defaultBtnLabel}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>}

                    <View testID="ReqDet.description" style={styles.information}>
                        <Text testID="ReqDet.discLabel" style={[globalStyles.H4, { paddingBottom: 12, paddingTop: 20 }]}>Description</Text>
                        <View style={{ paddingBottom: 12 }}>
                            <Text testID="ReqDet.discBody" style={globalStyles.Body}>
                                {route.params.description ? route.params.description : "No Description"}
                            </Text>
                        </View>
                    </View>
                    <View testID="ReqDet.posterInfo" style={styles.information}>
                        <Text testID="ReqDet.posterInfoLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Poster Information</Text>
                        <View testID="ReqDet.posterInfoCont" style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Ionicons name="person-circle-sharp" color="#B8B8B8" size={40} />
                            <Text
                                testID="ReqDet.posterUsername"
                                style={[
                                    globalStyles.H5,
                                    {
                                        marginLeft: 3,
                                        marginBottom: 5
                                    }]}
                            >{route.params.username}</Text>
                            {/* <View>
                            <View testID="ReqDet.locationDet" style={styles.location}>
                                <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                                Placeholder postal code
                                <Text testID="ReqDet.locationDetText" style={globalStyles.Small2}>XXXXXX</Text>
                            </View>
                        </View> */}
                        </View>
                    </View>
                    <View testID="ReqDet.details" style={styles.information}>
                        <Text testID="ReqDet.detailsLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Request Details</Text>
                        <View testID="ReqDet.detailsSub" style={{ flexDirection: "row" }}>
                            <View style={{ marginRight: 24 }}>
                                <Text
                                    testID="ReqDet.detailCat"
                                    style={[globalStyles.Small1, styles.smallText,
                                    { height: heights.categories ?? 'auto' }]}
                                >Food category</Text>
                                {/* <Text testID="ReqDet.detailsQuant" style={[globalStyles.Small1, styles.smallText]}>Quantity</Text> */}
                                <Text
                                    testID="ReqDet.detailsReq"
                                    style={[globalStyles.Small1, styles.smallText,
                                    { height: heights.diet ?? 'auto' }]}
                                >Dietary requirements</Text>
                            </View>
                            <View style={{ flexShrink: 1 }}>
                                <Text
                                    testID="ReqDet.detailCatVal"
                                    style={[globalStyles.Small1, { marginBottom: 8 }]}
                                    onLayout={(event) => {
                                        const layout = event.nativeEvent.layout;
                                        setHeights(current => ({
                                            ...current,
                                            categories: layout.height
                                        }))
                                    }}
                                >{categories}</Text>
                                {/* <Text testID="ReqDet.detailsQuantVal" style={[globalStyles.Small1, { marginBottom: 8 }]}>N/A</Text> */}
                                <Text
                                    testID="ReqDet.detailsReqVal"
                                    style={globalStyles.Small1}
                                    onLayout={(event) => {
                                        const layout = event.nativeEvent.layout;
                                        setHeights(current => ({
                                            ...current,
                                            diet: layout.height
                                        }))
                                    }}
                                >{diet}</Text>
                            </View>
                        </View>
                    </View>
                    <View testID="ReqDet.meetPref" style={styles.information}>
                        <Text testID="ReqDet.meetPrefLabel" style={[globalStyles.H4, { paddingBottom: 12 }]}>Meeting Preferences</Text>
                        <View testID="ReqDet.meetPrefSubCont" style={{ flexDirection: "row" }}>
                            <View style={{ marginRight: 24 }}>
                                <Text
                                    testID="ReqDet.meetPrefPickOrDel"
                                    style={[globalStyles.Small1, styles.smallText,
                                    { height: heights.logistics ?? 'auto' }]}
                                >Pick up or delivery preference</Text>
                                <Text
                                    testID="ReqDet.meetPrefPostal"
                                    style={[globalStyles.Small1, styles.smallText,
                                    { height: heights.accessNeeds ?? 'auto' }]}
                                >Access needs</Text>
                            </View>
                            <View style={{ flexShrink: 1 }}>
                                <Text
                                    testID="ReqDet.meetPrefPickOrDelVal"
                                    style={[globalStyles.Small1, { marginBottom: 8 }]}
                                    onLayout={(event) => {
                                        const layout = event.nativeEvent.layout;
                                        setHeights(current => ({
                                            ...current,
                                            logistics: layout.height
                                        }))
                                    }}
                                >{logistics}</Text>
                                <Text
                                    testID="ReqDet.meetPrefPostalVal"
                                    style={globalStyles.Small1}
                                    onLayout={(event) => {
                                        const layout = event.nativeEvent.layout;
                                        setHeights(current => ({
                                            ...current,
                                            accessNeeds: layout.height
                                        }))
                                    }}
                                >
                                    {!!route.params?.accessNeeds ? route.params?.accessNeeds : 'None'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default RequestDetailsScreen
