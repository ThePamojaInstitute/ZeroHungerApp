import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import styles from "../../styles/components/ImagePickerStyleSheet"
import { useAlert } from "../context/Alert";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Image } from "react-native";
import { Platform } from "react-native";


const ImagePicker = (props: { images: string[], setImages: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const { dispatch: alert } = useAlert()

    const pickImages = async () => {
        if (props.images.length >= 1) {
            alert!({ type: 'open', message: 'The limit is 1 image per post', alertType: 'error' })
            return
        }
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.3, //  compression, from 0 to 1
            allowsMultipleSelection: true,
            selectionLimit: 1 // only for ios 14+
        });

        if (!result.canceled && result.assets) {
            if (result.assets.length + props.images.length > 1) {
                alert!({ type: 'open', message: 'The limit is 1 image per post', alertType: 'error' })
            }
            result.assets.slice(0, 5 - props.images.length).forEach((img: { uri: string; }) => {
                props.setImages(oldArr => [...oldArr, img.uri])
            })
        }
    };

    const deleteImg = (item: string) => {
        props.setImages(props.images.filter((img: string) => img !== item))
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
        <View testID="ImagePicker.container" style={{ marginBottom: 20 }}>
            <Pressable
                testID="ImagePicker.accessButton"
                onPress={pickImages}>
                <Image
                    testID="ImagePicker.image"
                    style={[styles.imgInput, { width: Platform.OS === 'web' ? 370 : '100%' }]}
                    source={require('../../assets/Photo_Input.png')} />
            </Pressable>
            <View testID="ImagePicker.imagesContainer" style={{ marginLeft: 20 }}>
                <FlatList
                    testID="ImagePicker.imagesList"
                    data={props.images}
                    renderItem={renderItem}
                    horizontal
                    style={styles.imgList}
                />
            </View>
        </View>
    )
}

export default ImagePicker
