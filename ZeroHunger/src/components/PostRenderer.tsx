import { View, Text } from "react-native";
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
        <View>
            <Text> {title} </Text>
            <Text> {imagesLink} </Text>
            <Text> {postedOn} </Text>
            <Text> {postedBy} </Text>
            <Text> {description} </Text>
            <Text> {postType}  </Text>
        </View>
    )
    /*
    
    */

   
}
export default PostRenderer