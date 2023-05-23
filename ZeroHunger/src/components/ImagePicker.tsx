import { FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from "react";


const ImagePicker = () => {
    const [images, setImages] = useState([]);

    // Needs to be tested on ios
    // Also, do we want to access the camera?
    const pickImages = async () => {
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
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
                onPress={() => { setImages(images.filter((img: string) => img !== item)) }}>
                <Ionicons name="close-circle" size={32} color="black" style={styles.topRight} />
            </TouchableHighlight>
        </ImageBackground>
    );

    return (
        <View>
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