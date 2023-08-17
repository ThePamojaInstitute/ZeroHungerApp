import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, Pressable } from "react-native"
import { useIsFocused } from '@react-navigation/native';
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet";
import { getAccessToken, setLocalStorageItem, storage } from "../../config";
import { useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
// import {
//     addNotification,
//     clearNotification,
//     clearAllNotifications
// } from "../controllers/notifications";
// import { useAlert } from "../context/Alert";
import styles from "../../styles/screens/notificationsStyleSheet";
import { useRoute } from "@react-navigation/native";
import { ENV } from "../../env";
import { getNotifications } from "../controllers/auth";
import { extendExpiryDate } from "../controllers/post";
import { useAlert } from "../context/Alert";


const NoNotifications = ({ navigate }) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.15,
        paddingHorizontal: 50,
    }}>
        <Text
            style={[globalStyles.H2, { marginBottom: 10, textAlign: 'center' }]}>
            No notifications
        </Text>
        <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
            You will be notified when one of your posts is expiring soon
        </Text>
        <Pressable
            style={[globalStyles.defaultBtn, { width: '90%' }]}
            onPress={() => navigate('HomeScreen')}
        >
            <Text style={globalStyles.defaultBtnLabel}>
                Back to Home
            </Text>
        </Pressable>
    </View>
)

const NotificationsModal = ({ modalVisible, setModalVisible, height, setHeight, navigate }) => (
    <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        backdropOpacity={0.5}
        onBackButtonPress={() => setModalVisible(!modalVisible)}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        onSwipeComplete={() => setModalVisible(!modalVisible)}
        swipeDirection={['down']}
        style={[styles.modal, height ? { marginTop: Dimensions.get('window').height - (height + 10) } : {}]}
    >
        <View
            onLayout={(event) => {
                if (!height) {
                    const height = event.nativeEvent.layout.height;
                    setHeight(height)
                }
            }}
        >
            <View style={{ marginBottom: 10, marginTop: 12 }}>
                <View style={styles.modalContent}>
                    <Text style={[globalStyles.H3, { alignSelf: 'center' }]}>Notifications Options</Text>
                </View>
                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, marginRight: 10 }} onPress={() => setModalVisible(!modalVisible)}>
                    <Ionicons name="close" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 12 }}>
                {/* <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.midLight }}>
                <TouchableOpacity style={{ flexDirection: "row" }} onPress={handleClearAllNotifications}>
                    <Ionicons name="checkmark-circle-outline" size={24} style={{ paddingRight: 16 }} />
                    <Text style={[globalStyles.Body, { marginTop: 3 }]}>Mark all as read</Text>
                </TouchableOpacity>
            </View> */}
                <View style={{ padding: 12 }}>
                    <TouchableOpacity style={{ flexDirection: "row" }}
                        onPress={() => {
                            setModalVisible(!modalVisible)
                            navigate("NotificationsSettingsScreen")
                        }}
                    >
                        {/* <Ionicons name="md-cog-outline" size={24} style={{ paddingRight: 16 }}/> */}
                        <Image
                            style={{ height: 20, width: 20, marginLeft: 3, marginRight: 16 }}
                            source={require('../../assets/notifications_settings_icon.png')}
                        />
                        <Text style={[globalStyles.Body, { marginTop: 3 }]}>Notifications settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
)

export const NotificationsScreen = ({ navigation }) => {
    const route = useRoute()
    const isFocused = useIsFocused()
    const { dispatch: alert } = useAlert()

    const [modalVisible, setModalVisible] = useState(false)
    const [height, setHeight] = useState(0)
    const [posts, setPosts] = useState<object[]>()
    const [isEmpty, setIsEmpty] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        navigation.setOptions({
            title: "Notifications",
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerRight: () => (
                <View>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        style={{ paddingRight: 16 }}
                        onPress={() => { setModalVisible(!modalVisible) }}
                    />
                </View>
            )
        }, [])

        if (ENV === 'production') {
            storage.set('lastSeen', new Date().toDateString())
        } else {
            setLocalStorageItem('lastSeen', new Date().toDateString())
        }

        setFirstLoad(false)
        handleGetNotifications()
    }, [])

    useEffect(() => {
        if (firstLoad || !isFocused) return

        handleGetNotifications()
    }, [isFocused])

    const handleGetNotifications = async () => {
        if (!route.params['posts'] || !route.params['posts'].length) {
            const accessToken = await getAccessToken()

            const res = await getNotifications(accessToken, 'notifications')
            if (!res.data.length) setIsEmpty(true)
            else setPosts(res.data)
        } else setPosts(route.params['posts'])
    }

    const handleExtendExpiryDate = async (postId: Number, postType: "r" | "o") => {
        const res = await extendExpiryDate(postId, postType)

        if (res.msg === 'success') {
            alert!({ type: 'open', message: 'Post updated successfully!', alertType: 'success' })
            await handleGetNotifications()
        } else {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    // //Time threshold for notifications to become "old"
    // const old_threshold = 3600 * 24 * 2 //2 days
    // //Time threshold for notifications to be deleted
    // const purge_threshold = 3600 * 24 * 7 //1 week

    // const { dispatch: alert } = useAlert()
    // const { user } = useContext(AuthContext);

    // const [newNotifications, setNewNotifications] = useState([])
    // const [oldNotifications, setOldNotifications] = useState([])
    // const [noNewNotifications, setNoNewNotifications] = useState(true)
    // const [noOldNotifications, setNoOldNotifications] = useState(true)
    // const [refreshing, setRefreshing] = useState(false)

    // const refresh = () => {
    //     if (refreshing) return

    //     setRefreshing(true)
    //     setTimeout(() => setRefreshing(false), 2500)
    // }

    // useEffect(() => {
    //     getNotifications()
    // }, [])

    // useEffect(() => {
    //     if (newNotifications.length === 0) {
    //         setNoNewNotifications(true)
    //     }
    //     if (oldNotifications.length === 0) {
    //         setNoOldNotifications(true)
    //     }
    // })

    // const getNotifications = async () => {
    //     setNewNotifications([])
    //     setOldNotifications([])

    //     await axiosInstance.post("users/getNotifications", user, {
    //     }).then((res) => {
    //         length = res.data.length

    //         if (length === 2) {
    //             return
    //         }
    //         setNoNewNotifications(false)
    //         setNoOldNotifications(false)

    //         try {
    //             for (let i = 0; i < length; i++) {
    //                 const data = JSON.parse(res.data)[i]
    //                 // console.log(data)

    //                 //Other notification types
    //                 // if(data.type != "t" && data.type != "r" && data.type != "o") continue

    //                 //Calculate time in hours since notification received
    //                 let time = (Math.floor(new Date().getTime() / 1000) - data.time)
    //                 if (time < 0) time = 0

    //                 if (time > purge_threshold) {
    //                     handleClearNotification(data.time)
    //                     continue
    //                 }

    //                 let notification = {
    //                     type: data.type,
    //                     user: data.user,
    //                     food: data.food,
    //                     timestamp: data.time,
    //                     time: Math.floor(time / 3600)
    //                 }

    //                 if (time <= old_threshold) {
    //                     setNewNotifications(newNotifications => [...newNotifications, notification])
    //                 }
    //                 else {
    //                     setOldNotifications(oldNotifications => [...oldNotifications, notification])
    //                 }
    //             }
    //         }
    //         catch (e) {
    //             // console.log(e)
    //         }
    //     })
    // }

    //Temporary add notification function
    // const handleAddNotification = async () => {
    //     const notification = {
    //         type: "t",
    //         user: "Test user",
    //         food: "Test food"
    //     }
    //     try {
    //         addNotification(user, notification).then(res => {
    //             if (res.msg === "success") {
    //                 try {
    //                     getNotifications()
    //                 }
    //                 catch (e) {
    //                     console.log(e)
    //                     alert!({ type: 'open', message: res, alertType: 'error' })
    //                 }
    //             }
    //             else {
    //                 console.log(res)
    //                 alert!({ type: 'open', message: res, alertType: 'error' })
    //             }
    //         })
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }
    // }

    // const handleClearNotification = async (timestamp: number) => {
    //     try {
    //         clearNotification(user, timestamp).then(res => {
    //             if (res.msg === "success") {
    //                 try {
    //                     setNewNotifications(newNotifications.filter(notification => notification['timestamp'] != timestamp))
    //                 }
    //                 catch (e) {
    //                     console.log(e)
    //                     alert!({ type: 'open', message: res, alertType: 'error ' })
    //                 }
    //             }
    //             else {
    //                 console.log(res)
    //                 alert!({ type: 'open', message: res, alertType: 'error ' })
    //             }
    //         })
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }
    // }

    // const handleClearAllNotifications = async () => {
    //     clearAllNotifications(user).then(res => {
    //         if (res === "success") {
    //             try {
    //                 setModalVisible(!modalVisible)
    //                 setNewNotifications([])
    //                 setOldNotifications([])
    //                 setNoNewNotifications(true)
    //                 setNoOldNotifications(true)
    //             }
    //             catch (e) {
    //                 console.log(e)
    //                 alert!({ type: 'open', message: res, alertType: 'error' })
    //             }
    //         }
    //     })
    // }

    // const Notification = ({ type, user, food, timestamp, time }) => {
    //     return (
    //         <TouchableOpacity style={styles.notification} onPress={() => handleClearNotification(timestamp)}>
    //             <Image
    //                 style={{ height: 68, width: 68, paddingRight: 12 }}
    //                 source={{
    //                     //Temporary image
    //                     uri: "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"
    //                 }}
    //             />

    //             {/* Offer notification */}
    //             {type == "o" && <>
    //                 <View style={{ paddingLeft: 12, width: "95%", paddingRight: 12 }}>
    //                     <Text style={[globalStyles.Body, { paddingBottom: 8 }]}>
    //                         <Text style={{ fontWeight: "bold" }}>{user}</Text>
    //                         {" "} is offering the {" "}
    //                         <Text style={{ fontWeight: "bold" }}>{food}</Text>
    //                         {" "} that you need!
    //                     </Text>
    //                     <View style={{ flexDirection: "row" }}>
    //                         <View style={styles.postTag}>
    //                             <Text style={styles.postTagLabel}>Offer</Text>
    //                         </View>
    //                         <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
    //                     </View>
    //                 </View>
    //             </>}

    //             {/* Request notification */}
    //             {type == "r" && <>
    //                 <View style={{ paddingLeft: 12, width: "95%", paddingRight: 12 }}>
    //                     <Text style={[globalStyles.Body, { paddingBottom: 8 }]}>
    //                         <Text style={{ fontWeight: "bold" }}>{user}</Text>
    //                         {" "} needs the {" "}
    //                         <Text style={{ fontWeight: "bold" }}>{food}</Text>
    //                         {" "} that you are offering!
    //                     </Text>
    //                     <View style={{ flexDirection: "row" }}>
    //                         <View style={styles.postTag}>
    //                             <Text style={styles.postTagLabel}>Request</Text>
    //                         </View>
    //                         <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
    //                     </View>
    //                 </View>
    //             </>}

    //             {/* Temporary test notification */}
    //             {type == "t" && <>
    //                 <View style={{ paddingLeft: 12, width: "95%", paddingRight: 12 }}>
    //                     <Text style={[globalStyles.Body, { paddingBottom: 8 }]}>
    //                         User: {" "}
    //                         <Text style={{ fontWeight: "bold" }}>{user}</Text>
    //                         {"\n"}Item: {" "}
    //                         <Text style={{ fontWeight: "bold" }}>{food}</Text>
    //                     </Text>
    //                     <View style={{ flexDirection: "row" }}>
    //                         <View style={styles.postTag}>
    //                             <Text style={styles.postTagLabel}>Test</Text>
    //                         </View>
    //                         <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
    //                     </View>
    //                 </View>
    //             </>}

    //         </TouchableOpacity>
    //     )
    // }

    const renderItem = ({ item, index }) => {
        return (
            <View style={index !== 0 ? {
                borderTopWidth: 1,
                borderStyle: 'solid',
                borderTopColor: '#D1D1D1',
                marginHorizontal: 5,
            } : { marginHorizontal: 5 }}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    marginBottom: 15
                }}>

                    <Image
                        testID="Posts.Img"
                        style={{
                            width: 80,
                            height: 80,
                            marginRight: 10
                        }}
                        source={
                            item.images ?
                                { uri: item.images } : require('../../assets/Post.png')
                        }
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: Fonts.PublicSans_Regular,
                            fontWeight: '400',
                            fontSize: 15,
                        }}>
                            Your {item.type === 'r' ? 'request' : 'offer'} for
                            <Text style={{ fontFamily: Fonts.PublicSans_SemiBold, fontWeight: '600' }}>{` ${item.title} `}</Text>
                            will expire at the end of today!</Text>
                        <View
                            testID="Posts.tag"
                            style={{
                                // borderRadius: 4,
                                // backgroundColor: '#F0D2C6',
                                // paddingVertical: 4,
                                // paddingHorizontal: 6,
                                // alignSelf: 'flex-start',
                                // marginBottom: 10,
                                // width: '100%'
                            }}
                        >
                            {/* Placeholder need by date */}
                            {/* <Text testID="Posts.tagLabel" style={globalStyles.Tag}>Expiring soon</Text> */}
                            <Pressable
                                style={[globalStyles.defaultBtn, { height: 20, marginTop: 0, width: 135 }]}
                                onPress={() => { handleExtendExpiryDate(item.postId, item.type) }}
                            >
                                <Image source={require('../../assets/Extend.png')} style={{
                                    resizeMode: 'cover',
                                    width: 13,
                                    height: 13,
                                }} />
                                <Text style={[globalStyles.Tag, { color: Colors.white, marginLeft: -5 }]}>Extend by 1 week</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ height: '100%', backgroundColor: Colors.Background, padding: 5 }}>
            {!isEmpty ?
                (posts && !!posts.length) ?
                    <FlashList
                        renderItem={renderItem}
                        data={posts}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        estimatedItemSize={100}
                    />
                    :
                    <ActivityIndicator animating size="large" color={Colors.primary} />
                :
                <NoNotifications navigate={navigation.navigate} />
            }
            <View>
                <NotificationsModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    navigate={navigation.navigate}
                    height={height}
                    setHeight={setHeight}
                />
            </View>
        </View>

        // <ScrollView style={{ padding: 12, backgroundColor: Colors.Background }}>
        //     {!noNewNotifications && <>
        //         <View style={{ paddingBottom: 12 }}>
        //             <Text style={globalStyles.H3}>New</Text>
        //             <FlashList
        //                 renderItem={renderItem}
        //                 data={newNotifications}
        //                 showsVerticalScrollIndicator={false}
        //                 showsHorizontalScrollIndicator={false}
        //                 estimatedItemSize={100}
        //                 refreshControl={
        //                     <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[Colors.primary, Colors.primaryLight]} />
        //                 }
        //             />
        //         </View>
        //     </>}
        //     {!noOldNotifications && <>
        //         <View style={{}}>
        //             <Text style={globalStyles.H3}>Older</Text>
        //             <FlashList
        //                 renderItem={renderItem}
        //                 data={oldNotifications}
        //                 showsVerticalScrollIndicator={false}
        //                 showsHorizontalScrollIndicator={false}
        //                 estimatedItemSize={100}
        //                 refreshControl={
        //                     <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[Colors.primary, Colors.primaryLight]} />
        //                 }
        //             />
        //         </View>
        //     </>}
        //     {noNewNotifications && noOldNotifications && <>
        //         <Text style={{ fontSize: 36, padding: 15 }}>No Notifications</Text>
        //     </>}

        //     {/* Test add notification button */}
        //     <TouchableOpacity onPress={handleAddNotification}>
        //         <Text>Test add notification</Text>
        //     </TouchableOpacity>

        //     {/* Button to test notification load */}
        //     {/* <TouchableOpacity onPress={getNotifications}>
        //                 <Text>test load notifs</Text>
        //             </TouchableOpacity> */}
        // </ScrollView>
    )
}

export default NotificationsScreen