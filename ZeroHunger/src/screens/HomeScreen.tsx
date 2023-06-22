import React, { useContext, useEffect, useState } from "react";
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Pressable, 
    FlatList, 
    GestureResponderEvent 
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { deleteUser, logOutUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { NotificationContext } from "../context/ChatNotificationContext";
import PostRenderer from "../components/PostRenderer";
import FoodCategories from "../components/FoodCategories";
import { Colors, globalStyles } from "../../styles/globalStyleSheet"

export const HomeScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext)
    const { unreadMessageCount, chatIsOpen, setChatIsOpen } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [showRequests, setShowRequests] = useState(true)
    // const [showOffers, setShowOffers] = useState(true)

    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    }, [])

    useEffect(() => {
        if (unreadMessageCount > 0 && !chatIsOpen) {
            alert!({
                type: 'open', message: `You have ${unreadMessageCount} new ${unreadMessageCount > 1
                    ? 'messages' : 'message'}`, alertType: 'info'
            })
        }
    }, [unreadMessageCount])

    const handleLogOut = (e: GestureResponderEvent) => {
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => {
            alert!({ type: 'open', message: 'Logged out successfully!', alertType: 'success' })
            navigation.navigate('LoginScreen')
        }).catch(() => {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        })
    }

    const handleDeleteUser = () => {
        deleteUser(user['user_id'], accessToken).then(res => {
            if (res === "success") {
                logOutUser().then(() => {
                    dispatch({ type: "LOGOUT", payload: null })
                    alert!({ type: 'open', message: 'Account deleted successfully!', alertType: 'success' })
                    navigation.navigate('LoginScreen')
                }).catch(() => {
                    alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
                    console.log("log out error");
                })
            } else {
                alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
                console.log(res);
            }
        })
    }
    
    return (
        <View style={styles.container}>
            {/* <View style={styles.landingPageText}>
                <Text style={styles.text}>Temporary Landing Page</Text>
                <Text>Good Morning {user ? user['username'] : "User"}</Text>
                {unreadMessageCount > 0 &&
                    <Text>You have {unreadMessageCount} unread
                        {unreadMessageCount > 1 ? ' messages' : ' message'}</Text>
                }
                {user &&
                    <TouchableOpacity testID="ChatNav.Button" style={styles.logOutBtn} onPress={() => navigation.navigate('Conversations')}>
                        <Text style={styles.logOutBtnText}>Chat</Text>
                    </TouchableOpacity>}
                {user &&
                    <TouchableOpacity testID="LogOut.Button" style={styles.logOutBtn} onPress={handleLogOut}>
                        <Text style={styles.logOutBtnText}>Log Out</Text>
                    </TouchableOpacity>}
                {user &&
                    <TouchableOpacity testID="DeleteUser.Button" style={styles.deleteBtn} onPress={handleDeleteUser}>
                        <Text style={styles.deleteBtnText}>Delete User</Text>
                    </TouchableOpacity>}
            </View> */}
            <View style={{flexDirection: 'row', marginTop: 8, marginRight: 16, marginBottom: 4, marginLeft: 16 }}>
                <View style={[
                    {
                        borderBottomColor: showRequests ? 'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                    },
                    styles.pressable
                ]}>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                // backgroundColor: showRequests ? '#F0F000' : '#FFFFFF',
                            },
                            styles.pressableText,
                        ]}
                        onPress={() => setShowRequests(true)}
                    >
                        <Text style={globalStyles.H3}>Requests</Text>
                    </Pressable>
                </View>
                <View style={[
                    {
                        borderBottomColor: !showRequests ? 'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                    },
                    styles.pressable
                ]}>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                // backgroundColor: !showRequests ? '#F0F000' : '#FFFFFF',
                                // marginLeft: 24,
                            },
                            styles.pressableText,
                        ]}
                        onPress={() => setShowRequests(false)}
                    >
                        <Text style={globalStyles.H3}>Offers</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{marginTop: 8, marginRight: 16, marginBottom: 4, marginLeft: 16}}>
                <FoodCategories />
            </View>
            <TouchableOpacity testID="RequestFormNav.Button" style={styles.logOutBtnText} onPress={() => navigation.navigate("RequestFormScreen")}>
                <Text style={styles.logOutBtn}>Add a Request</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="OfferFormNav.Button" style={styles.logOutBtnText} onPress={() => navigation.navigate("OfferFormScreen")}>
                <Text style={styles.logOutBtn}>Add an Offer</Text>
            </TouchableOpacity>
            {user &&
                    <TouchableOpacity testID="LogOut.Button" style={styles.logOutBtn} onPress={handleLogOut}>
                        <Text style={styles.logOutBtnText}>Log Out</Text>
                    </TouchableOpacity>}
            {user &&
                <TouchableOpacity testID="DeleteUser.Button" style={styles.deleteBtn} onPress={handleDeleteUser}>
                    <Text style={styles.deleteBtnText}>Delete User</Text>
                </TouchableOpacity>}
            {showRequests && <PostRenderer type={"r"} navigation={navigation} />}
            {!showRequests && <PostRenderer type={"o"} navigation={navigation} />}
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
        // alignItems: 'center',
        // justifyContext: 'center',
    },
    landingPageText: {
        // flex: 1,
        marginTop: 10,
        marginLeft: 25,
        marginBottom: 60,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    logOutBtn: {
        width: "7%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "#6A6A6A",
    },
    logOutBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
    deleteBtn: {
        title: "Login",
        width: "8%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "red",
    },
    deleteBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
    pressable: {
        flexDirection: 'row',
        marginLeft: 4,
        marginRight: 25,
        borderBottomWidth: 4,
        // borderBottomColor: 'rgba(48, 103, 117, 0)',
    },
    pressableText: {
        fontSize: 30,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    categoryText: {
        marginTop: 20,
        marginLeft: 25,
        fontSize: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 10,
    },
    feed: {
        fontSize: 30,
        marginTop: 35,
        marginLeft: 25,
    },
})