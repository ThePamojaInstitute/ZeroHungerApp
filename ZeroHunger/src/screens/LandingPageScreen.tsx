//TODO Track button presses (underline button or highlight)

import React, { useContext, useState, useEffect } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData, GestureResponderEvent } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { deleteUser, logOutUser } from "../controllers/auth";

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

    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
    }, [])

    const handleLogOut = (e: GestureResponderEvent) => {
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => { navigation.navigate('LoginScreen') })
    }

    const handleDeleteUser = () => {
        deleteUser(user['user_id'], accessToken).then(() => {
            logOutUser().then(() => {
                dispatch({ type: "LOGOUT", payload: null })
            })
        }).then(() => {
            navigation.navigate('LoginScreen')
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.landingPageText}>
                <Text style={styles.text}>Temporary Landing Page</Text>
                <Text>Good Morning {user ? user['username'] : "User"}</Text>
                {user &&
                    <TouchableOpacity testID="LogOut.Button" style={styles.logOutBtn} onPress={handleLogOut}>
                        <Text style={styles.logOutBtnText}>Log Out</Text>
                    </TouchableOpacity>}
                {user &&
                    <TouchableOpacity testID="LogOut.Button" style={styles.deleteBtn} onPress={handleDeleteUser}>
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
        title: "Login",
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