import React, { useState } from "react";
import { Platform, ScrollView, FlatList, ImageBackground, TouchableHighlight } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

export const RequestFormScreen = ({ navigation }) => {
    const [images, setImages] = useState([]);

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.3, //  compression, from 0 to 1
            allowsMultipleSelection: true,
            selectionLimit: 5 // only for ios 14+
        });

        if (!result['cancelled']) {
            if (Platform.OS === 'web') {
                result['selected'].slice(0, 5 - images.length).forEach((img: { uri: string; }) => {
                    setImages(oldArr => [...oldArr, img.uri])
                })
            } else if (Platform.OS === 'android') {
                if (result['selected']) {
                    result['selected'].slice(0, 5 - images.length).forEach((img: { uri: string; }) => {
                        setImages(oldArr => [...oldArr, img.uri])
                    })
                } else {
                    if (images.length < 5) {
                        setImages(oldArr => [...oldArr, result['uri']])
                    }
                }
            }
        }
    };

    const renderItem = ({ item }) => (
        <ImageBackground source={{ uri: item }} style={styles.Img}>
            <TouchableHighlight
                onPress={() => { setImages(images.filter(img => img !== item)) }}>
                <Ionicons name="close-circle" size={32} color="black" style={styles.topRight} />
            </TouchableHighlight>
        </ImageBackground>
    );

    return (
        <ScrollView>
            <Text>The limit is 5 images</Text>
            <TouchableOpacity testID="RequestFromNav.Button" style={styles.logOutBtnText} onPress={pickImages}>
                <Text style={styles.logOutBtn}>Access Camera Roll</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 20 }}>
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    horizontal
                />
            </View>
            {images.length == 0 && <Text>No Images</Text>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    logOutBtn: {
        title: "Login",
        width: "25%",
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
        marginLeft: 20,
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    topRight: {
        position: 'absolute',
        right: 0,
    }
})