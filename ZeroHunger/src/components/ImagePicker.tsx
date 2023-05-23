import { FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from "react";


const ImagePicker = () => {
    const [images, setImages] = useState([])
    const [errMsg, setErrMsg] = useState("")

    // Needs to be tested on ios
    // Also, do we want to access the camera?
    const pickImages = async () => {
        setErrMsg("")
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.3, //  compression, from 0 to 1
            allowsMultipleSelection: true,
            selectionLimit: 5 // only for ios 14+
        });

        if (!result['cancelled']) {
            if (Platform.OS === 'web') {
                if (result['selected'].length + images.length > 5) {
                    setErrMsg("The limit is 5 images per post")
                }
                result['selected'].slice(0, 5 - images.length).forEach((img: { uri: string; }) => {
                    setImages(oldArr => [...oldArr, img.uri])
                })
            } else if (Platform.OS === 'android') {
                if (result['selected']) {   // if more than 1 image picked
                    if (result['selected'].length + images.length > 5) {
                        setErrMsg("The limit is 5 images per post")
                    }
                    result['selected'].slice(0, 5 - images.length).forEach((img: { uri: string; }) => {
                        setImages(oldArr => [...oldArr, img.uri])
                    })
                } else {    // if only 1 image picked
                    if (images.length < 5) {
                        setImages(oldArr => [...oldArr, result['uri']])
                    } else {
                        setErrMsg("The limit is 5 images per post")
                    }
                }
            }
        }
    };

    const deleteImg = (item: string) => {
        setImages(images.filter((img: string) => img !== item))
        setErrMsg("")
    }

    const renderItem = ({ item }) => (
        <ImageBackground testID={item} source={{ uri: item }} style={styles.Img}>
            <TouchableHighlight
                testID={item + ".DeleteButton"}
                onPress={() => deleteImg(item)}>
                <Ionicons name="close-circle" size={32} color="black" style={styles.topRight} />
            </TouchableHighlight>
        </ImageBackground>
    );

    return (
        <View>
            {/* <Text>The limit is 5 images</Text> */}
            <Text testID="errMsg" style={{ color: "red" }}>{errMsg && errMsg}</Text>
            <TouchableOpacity testID="AccessCameraRoll.Button" style={styles.logOutBtnText} onPress={pickImages}>
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
        </View>
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

export default ImagePicker