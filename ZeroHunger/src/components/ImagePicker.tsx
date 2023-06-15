import { useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useAlert } from "../context/Alert";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Image } from "react-native";
import { Platform } from "react-native";


const ImagePicker = (props: { setImages: React.Dispatch<React.SetStateAction<string>> }) => {
    const { dispatch: alert } = useAlert()
    const [images, setImages] = useState([])

    const pickImages = async () => {
        if (images.length >= 5) {
            alert!({ type: 'open', message: 'The limit is 5 images per post', alertType: 'error' })
            return
        }
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.3, //  compression, from 0 to 1
            allowsMultipleSelection: true,
            selectionLimit: 5 // only for ios 14+
        });

        if (!result.canceled && result.assets) {
            if (result.assets.length + images.length > 5) {
                alert!({ type: 'open', message: 'The limit is 5 images per post', alertType: 'error' })
            }
            result.assets.slice(0, 5 - images.length).forEach((img: { uri: string; }) => {
                setImages(oldArr => [...oldArr, img.uri])
            })
        }
    };

    const deleteImg = (item: string) => {
        setImages(images.filter((img: string) => img !== item))
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
        // <View>
        //     <Ionicons name="images-outline" size={50} testID="AccessCameraRoll.Button" onPress={pickImages} title="Access Camera Roll" />
        //     <View style={{ marginLeft: 20 }}>
        //         <FlatList
        //             data={images}
        //             renderItem={renderItem}
        //             horizontal
        //             style={styles.imgList}
        //         />
        //     </View>
        //     {images.length == 0 && <Text>No Images</Text>}
        // </View>
        <View style={{ marginBottom: 20 }}>
            <Pressable
                testID="AccessCameraRoll.Button"
                onPress={pickImages}>
                <Image
                    style={[styles.imgInput, { width: Platform.OS === 'web' ? 370 : '100%' }]}
                    source={require('../../assets/Photo_Input.png')} />
            </Pressable>
            <View style={{ marginLeft: 20 }}>
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    horizontal
                    style={styles.imgList}
                />
            </View>
        </View>
    )
}

export default ImagePicker

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
    Img: {
        marginTop: 20,
        marginLeft: 20,
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    imgList: {
        left: -40,
        marginRight: -40
    },
    imgInput: {
        marginTop: 5,
        width: '100%',
        height: 123,
        resizeMode: 'contain'
    },
    topRight: {
        position: 'absolute',
        right: 0,
    }
})