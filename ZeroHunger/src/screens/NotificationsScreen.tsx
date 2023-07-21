import { View, ScrollView, Text, TouchableOpacity, Image, RefreshControl, StyleSheet, Dimensions } from "react-native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { axiosInstance } from "../../config";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export const NotificationsScreen = ({ navigation }) => {
    //Time threshold for notifications to become "old"
    let old_threshold = 3600 * 48 //48 hours
    //Time threshold for notifications to be deleted
    let purge_threshold = 3600 * 168 //1 week

    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (!loaded) return
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
                    <View>
                        <Modal
                            isVisible={modalVisible}
                            animationIn="slideInUp"
                            backdropOpacity={0.5}
                            onBackButtonPress={() => setModalVisible(!modalVisible)}
                            onBackdropPress={() => setModalVisible(!modalVisible)}
                            onSwipeComplete={() => setModalVisible(!modalVisible)}
                            swipeDirection={['down']}
                            style={styles.modal}
                        >
                            <View style={{ marginBottom: 30, marginTop: 12 }}>
                                <View style={styles.modalContent}>
                                    <Text style={[globalStyles.H3, { alignSelf: 'center' }]}>Notifications Options</Text>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, marginRight: 10 }} onPress={() => setModalVisible(!modalVisible)}>
                                    <Ionicons name="close" size={30} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 12 }}>
                                <View style={{padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.midLight}}>
                                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={ markAllAsRead }>
                                        <Ionicons name="checkmark-circle-outline" size={24} style={{paddingRight: 16}}/>
                                        <Text style={[globalStyles.Body, {marginTop: 3}]}>Mark all as read</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 12 }}>
                                    <TouchableOpacity style={{ flexDirection: "row" }} 
                                        onPress={() => { 
                                            setModalVisible(!modalVisible)
                                            navigation.navigate("NotificationsSettingsScreen") 
                                        }}
                                    >
                                        {/* <Ionicons name="md-cog-outline" size={24} style={{ paddingRight: 16 }}/> */}
                                        <Image 
                                            style={{height: 20, width: 20, marginLeft: 3, marginRight: 16}}
                                            source={require('../../assets/notifications_settings_icon.png')}
                                        />
                                        <Text style={[globalStyles.Body, {marginTop: 3}]}>Notifications settings</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            )
        })
    })

    const { user } = useContext(AuthContext);

    const [newNotifications, setNewNotifications] = useState([])
    const [oldNotifications, setOldNotifications] = useState([])
    const [noNewNotifications, setNoNewNotifications] = useState(true)
    const [noOldNotifications, setNoOldNotifications] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const refresh = () => {
        if (refreshing) return

        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 2500)
    }

    const getNotifications = async () => {
        await axiosInstance.post("users/getNotifications", user, {
        }).then((res) => {
            length = res.data.length

            if(length === 2) {
                return
            }
            setNoNewNotifications(false)
            setNoOldNotifications(false)

            try {
                for(let i = 0; i < length; i++) {
                    const data = JSON.parse(res.data)[i]
                    // console.log(data)

                    //Calculate time in hours since notification received
                    let timestamp = Math.floor((Math.floor(new Date().getTime() / 1000) - data.time)/3600)

                    if(timestamp > purge_threshold) {
                        clearNotification(data.id)
                        continue
                    }
                
                    let notification = {
                        id: data.id,
                        type: data.type,
                        user: data.user,
                        food: data.food,
                        time: timestamp
                    }
                    if(timestamp <= old_threshold) {
                        setNewNotifications(newNotifications => [...newNotifications, notification])
                    }
                    else {
                        setOldNotifications(oldNotifications => [...oldNotifications, notification])
                    }
                }
            }
            catch (e) {
                // console.log(e)
            }
        })
    }

    useEffect(() => {
        getNotifications()
    }, [])

    const Notification = ({ id, type, user, food, time }) => {
        return (
            <TouchableOpacity style={styles.notification}>
                <Image 
                    style={{height: 68, width: 68, paddingRight: 12}}
                    source={{
                        //Temporary image
                        uri: "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"
                    }}
                />
                
                {/* Offer notification */}
                {type == "o" && <>
                    <View style={{paddingLeft: 12}}>
                        <Text style={[globalStyles.Body, {paddingBottom: 8}]}>
                            <Text style={{fontWeight: "bold"}}>{user}</Text>
                            {" "} is offering the {" "}
                            <Text style={{fontWeight: "bold"}}>{food}</Text>
                            {" "} that you need!
                        </Text>
                        <View style={{flexDirection: "row"}}>
                            <View style={globalStyles.postTag}>
                                <Text style={globalStyles.postTagLabel}>Offer</Text>
                            </View>
                            <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
                        </View>
                    </View>
                </>}
                
                {/* Request notification */}
                {type == "r" && <>
                    <View style={{paddingLeft: 12}}>
                        <Text style={[globalStyles.Body, {paddingBottom: 8}]}>
                            <Text style={{fontWeight: "bold"}}>{user}</Text>
                            {" "} needs the {" "}
                            <Text style={{fontWeight: "bold"}}>{food}</Text>
                            {" "} that you are offering!
                        </Text>
                        <View style={{flexDirection: "row"}}>
                            <View style={globalStyles.postTag}>
                                <Text style={globalStyles.postTagLabel}>Request</Text>
                            </View>
                            <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
                        </View>
                    </View>
                </>}

                {/* Temporary test notification */}
                {type == "t" && <>
                    <View style={{paddingLeft: 12, width: "95%", paddingRight: 12}}>
                        <Text style={[globalStyles.Body, {paddingBottom: 8}]}>
                            User: {" "}
                            <Text style={{fontWeight: "bold"}}>{user}</Text>
                            {"\n"}Item: {" "}
                            <Text style={{fontWeight: "bold"}}>{food}</Text>
                        </Text>
                        <View style={{flexDirection: "row"}}>
                            <View style={globalStyles.postTag}>
                                <Text style={globalStyles.postTagLabel}>Test</Text>
                            </View>
                            <Text style={[globalStyles.Small2, styles.time]}>{time} hrs ago</Text>
                        </View>
                    </View>
                </>}

            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <Notification
                id={item.id}
                type={item.type}
                user={item.user}
                food={item.food}
                time={item.time}
            />
        )
    }

    const clearNotification = async (id) => {
        await axiosInstance.post("users/deleteNotification", {user, id}, {
        }).then((res) => {
            try {

            }
            catch (e) {
                console.log(e)
            }
        })
    }

    const markAllAsRead = async () => {
        await axiosInstance.post("users/clearAllNotifications", user, {
        }).then((res) => {
            try {
                setModalVisible(!modalVisible)
                setNewNotifications([])
                setOldNotifications([])
                setNoNewNotifications(true)
                setNoOldNotifications(true)
            }
            catch (e) {
                console.log(e)
            }
        })
    }

    return (
        <>
            {!loaded && <Text>Loading...</Text>}
            {loaded && <>
                <ScrollView style={{padding: 12, backgroundColor: Colors.Background}}>
                    {!noNewNotifications && <>
                        <View style={{paddingBottom: 12}}>
                            <Text style={globalStyles.H3}>New</Text>
                            <FlashList
                                renderItem={renderItem}
                                data={newNotifications}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                estimatedItemSize={100}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[Colors.primary, Colors.primaryLight]} />
                                }
                            />
                        </View>
                    </>}
                    {!noOldNotifications && <>
                        <View style={{}}>
                            <Text style={globalStyles.H3}>Older</Text>
                            <FlashList 
                                renderItem={renderItem}
                                data={oldNotifications}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                estimatedItemSize={100}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[Colors.primary, Colors.primaryLight]} />
                                }
                            />
                        </View>
                    </>}
                    {noNewNotifications && noOldNotifications && <>
                        <Text style={{fontSize: 36, padding: 15}}>No Notifications</Text>
                    </>}

                    {/* Button to test notification loading */}
                    {/* <TouchableOpacity onPress={getNotifications}>
                        <Text>test load notifs</Text>
                    </TouchableOpacity> */}
                </ScrollView>
            </>}
        </>
    )
}

const styles = StyleSheet.create({
    notification: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight,
        paddingTop: 12,
    },
    time: {
        marginLeft: "auto",
        paddingTop: 4,
    },
    modal: {
        margin: 0,
        marginTop: Dimensions.get('window').height * 0.70,
        backgroundColor: Colors.offWhite,
        borderRadius: 10,
        elevation: 0,
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    }
})

export default NotificationsScreen