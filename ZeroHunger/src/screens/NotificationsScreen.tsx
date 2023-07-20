import { View, ScrollView, Text, TouchableOpacity, Image, RefreshControl, StyleSheet } from "react-native"
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

export const NotificationsScreen = ({ navigation }) => {
    //Time threshold for notifications to become "old"
    let time_threshold = 3600 * 48 //48 hours

    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const { user } = useContext(AuthContext);

    const [newNotifications, setNewNotifications] = useState([])
    const [oldNotifications, setOldNotifications] = useState([])
    const [noNotifications, setNoNotifications] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const refresh = () => {
        if (refreshing) return

        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 2500)
    }

    const calculateTime = (data_time) => {
        return Promise.resolve(Math.floor((Math.floor(new Date().getTime() /1000 - data_time)/3600)))
    }

    const getNotifications = async () => {
        await axiosInstance.post("users/getNotifications", user, {
        }).then((res) => {
            length = res.data.length

            if(!length) {
                return
            }
            setNoNotifications(false)

            for(let i = 0; i < length; i++) {
                const data = JSON.parse(res.data)[i]
                // console.log(data)

                //Calculate time in hours since notification received
                let timestamp = Math.floor((Math.floor(new Date().getTime() / 1000) - data.time)/3600)
                
            
                let notification = {
                    type: data.type,
                    user: data.user,
                    food: data.food,
                    time: timestamp
                }
                if(timestamp <= time_threshold) {
                    setNewNotifications(newNotifications => [...newNotifications, notification])
                }
                else {
                    setOldNotifications(oldNotifications => [...oldNotifications, notification])
                }
            }
        })
    }

    useEffect(() => {
        getNotifications()
    }, [])

    const Notification = ({ type, user, food, time }) => {
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
                type={item.type}
                user={item.user}
                food={item.food}
                time={item.time}
            />
        )
    }

    return (
        <>
            {!loaded && <Text>Loading...</Text>}
            {loaded && !noNotifications && <>
                <ScrollView style={{padding: 12, backgroundColor: Colors.Background}}>
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
                    {/* Button to test notification loading */}
                    {/* <TouchableOpacity onPress={getNotifications}>
                        <Text>test load notifs</Text>
                    </TouchableOpacity> */}
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
    }
})

export default NotificationsScreen