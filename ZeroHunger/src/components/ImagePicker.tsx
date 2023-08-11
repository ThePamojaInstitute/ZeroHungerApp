import { FlatList, ImageBackground, Pressable, TouchableHighlight, View, Image, Platform } from "react-native";
import styles from "../../styles/components/ImagePickerStyleSheet"
import { useAlert } from "../context/Alert";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


enum PhotoDimensions {
    WIDTH = 'width',
    HEIGHT = 'height',
}

const maximalValuesPerDimension = { width: 2000, height: 2000 }
const resizePhotoToMaxDimensionsAndCompress = async ({ photo }: { photo: { width: number, height: number, uri: string } }) => {
    // define the maximal dimension and the allowed value for it
    const largestDimension = (photo.width > photo.height) ? PhotoDimensions.WIDTH : PhotoDimensions.HEIGHT
    const initialValueOfLargestDimension = photo[largestDimension]
    const maximalAllowedValueOfLargestDimension = maximalValuesPerDimension[largestDimension]
    const targetValueOfLargestDimension =
        (initialValueOfLargestDimension > maximalAllowedValueOfLargestDimension) ?
            maximalAllowedValueOfLargestDimension : initialValueOfLargestDimension

    // resize the photo w/ that target value for that dimension (keeping the aspect ratio)
    const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { [largestDimension]: targetValueOfLargestDimension } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    )

    return resizedPhoto;
}


const ImagePicker = (props: {
    imagesURIs: string[],
    base64Images: string[],
    setImagesURIs: React.Dispatch<React.SetStateAction<string[]>>,
    setBase64Images: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    const { dispatch: alert } = useAlert()

    const pickImages = async () => {
        if (props.imagesURIs.length >= 1) {
            alert!({ type: 'open', message: 'The limit is 1 image per post', alertType: 'error' })
            return
        }
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            allowsMultipleSelection: false,
            selectionLimit: 1 // only for ios 14+
        });

        if (!result.canceled && result.assets) {
            if (result.assets.length + props.imagesURIs.length > 1) {
                alert!({ type: 'open', message: 'The limit is 1 image per post', alertType: 'error' })
            }
            result.assets.slice(0, 1 - props.imagesURIs.length).forEach(async (img: object) => {
                Image.getSize(img['uri'], async (width, height) => {
                    const photo = {
                        width: width,
                        height: height,
                        uri: img['uri']
                    }
                    const compressedImage = await resizePhotoToMaxDimensionsAndCompress({ photo })

                    props.setImagesURIs(oldArr => [...oldArr, compressedImage.uri])
                    props.setBase64Images(oldArr => [...oldArr, compressedImage.base64])
                })
            })
        }
    };

    const deleteImg = (index: number) => {
        props.setImagesURIs(props.imagesURIs.filter((_, i: number) => i !== index))
        props.setBase64Images(props.base64Images.filter((_, i: number) => i !== index))
    }

    const renderItem = ({ item, index }) => (
        <ImageBackground testID={item} source={{ uri: item }} style={styles.Img}>
            <TouchableHighlight
                testID={item + ".DeleteButton"}
                onPress={() => deleteImg(index)}>
                <Ionicons name="close-circle" size={32} color="black" style={styles.topRight} />
            </TouchableHighlight>
        </ImageBackground>
    )

    return (
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
                    data={props.imagesURIs}
                    renderItem={renderItem}
                    horizontal
                    style={styles.imgList}
                />
            </View>
        </View>
    )
}

export default ImagePicker
