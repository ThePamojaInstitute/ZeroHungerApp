import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, FlatList, GestureResponderEvent } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { deleteUser, logOutUser } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { NotificationContext } from "../context/ChatNotificationContext";

//Flatlist data
const Item = ({ name }) => {
    return (
        <View style={styles.item}>
            <TouchableOpacity>
                <Text style={{ textAlign: 'center' }}>{name}</Text>
            </TouchableOpacity>
        </View>
    );
}

//Food categories placeholder
const foods = [
    { name: 'Food1' },
    { name: 'Food2' },
    { name: 'Food3' },
    { name: 'Food4' },
    { name: 'Food5' },
    { name: 'Food6' },
    { name: 'Food7' },
    { name: 'Food8' },
    { name: 'Food9' },
    { name: 'Food10' },
]

//Render flatlist items
const renderItem = ({ item }) => (
    <Item name={item.name} />
);

//Temporary landing page screen to test tokens
export const LandingPageScreen = ({ navigation }) => {
    const { user, accessToken, dispatch } = useContext(AuthContext)
    const { unreadMessageCount, chatIsOpen, setChatIsOpen } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

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
            <View style={styles.landingPageText}>
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
            </View>
            <View style={styles.pressable}>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#F0F000' : '#FFFFFF',
                        },
                        styles.pressableText,
                    ]}>
                    <Text style={styles.pressableText}>Requests</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#F0F000' : '#FFFFFF',
                            marginLeft: 40,
                        },
                        styles.pressableText,
                    ]}>
                    <Text style={styles.pressableText}>Offers</Text>
                </Pressable>
            </View>
            <Text style={styles.categoryText}>Categories</Text>
            <View style={{ marginLeft: 20 }}>
                <FlatList
                    data={foods}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    horizontal
                />
            </View>
            <TouchableOpacity testID="RequestFromNav.Button" style={styles.logOutBtnText} onPress={() => navigation.navigate("RequestFormScreen")}>
                <Text style={styles.logOutBtn}>Add a Request</Text>
            </TouchableOpacity>
            <Text style={styles.feed}>Feed Screen{"\n"}will go here</Text>
        </View>
    )
}

export default LandingPageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginLeft: 25,
        marginRight: 25,
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