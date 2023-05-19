import React, { useContext, useState, useEffect } from "react";
import { Platform, NativeSyntheticEvent, TextInputChangeEventData, GestureResponderEvent } from "react-native";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export const RequestFormScreen = ({ navigation }) => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [image, setImage] = useState("ii");

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.3, //  compression, from 0 to 1
            allowsMultipleSelection: true,
            selectionLimit: 5 // only for ios 14+
        });
        console.log(result);

        if (!result['cancelled']) {
            if (Platform.OS === 'web') {
                setImage(result['selected'][0].uri);
            } else if (Platform.OS === 'android') {
                setImage(result['uri']);
            }
        }
    };

    return (
        <View>
            <Text>Hello Request</Text>
            <TouchableOpacity testID="RequestFromNav.Button" style={styles.logOutBtnText} onPress={pickImage}>
                <Text style={styles.logOutBtn}>Access Camera Roll</Text>
            </TouchableOpacity>
            {image && <Image style={styles.Img} source={{ uri: image }} />}
        </View>
    )
}

const styles = StyleSheet.create({
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
    Img:
    {
        marginTop: 20,
        width: '100%',
        height: '50%',
        resizeMode: 'cover'
    },
})