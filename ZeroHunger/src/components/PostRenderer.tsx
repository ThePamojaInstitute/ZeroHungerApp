import { View, Text, StyleSheet, Image } from "react-native";
import { useState } from "react";

const PostRenderer = () =>
{

    const [title, setTitle] = useState("title")
    const [imagesLink, setImagesLink] = useState("imageLink")
    const [postedOn, setPostedOn] = useState(1)
    const [postedBy, setPostedBy] = useState(0)
    const [description, setDescription] = useState("description")
    const [postType, setPostType] = useState('r')
    
    return (
        // <View>
        //     <Text> {title} </Text>
        //     <Text> {imagesLink} </Text>
        //     <Text> {postedOn} </Text>
        //     <Text> {postedBy} </Text>
        //     <Text> {description} </Text>
        //     <Text> {postType}  </Text>
        // </View>
        <View style={styles.container}>
            <Image 
                style={styles.image}
                // source={{uri: imagesLink}}
                //Placeholder image
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
            <View style={styles.subContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <View style={{padding: 8}}>
                    {/* Placeholder profile picture
                    <Image source={{uri: }}> */}
                    <Text>{postedBy}</Text>
                </View>
                <Text style={styles.quantityText}>Quantity: </Text>
            </View>
            <View>
                <Text style={styles.needByText}>
                    Posted On: {postedOn}{'\n'}
                    Need by: {postedBy}</Text>
            </View>
        </View>
    )
    /*
    
    */
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: 100,
        padding: 10,
        flexDirection: 'row',
    },
    subContainer: {
        flex: 1,
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 15,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    quantityText: {
        fontSize: 14,
    },
    needByText: {
        flex: 1,
        textAlign: 'right',
        alignSelf: 'flex-end',
        marginTop: 62
    }
})

export default PostRenderer