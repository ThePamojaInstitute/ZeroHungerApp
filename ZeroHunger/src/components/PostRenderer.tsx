import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { useContext, useState } from "react";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { deletePost } from "../controllers/post";
import { FlashList } from "@shopify/flash-list"
import { Button } from "react-native-paper";


const PostRenderer = ({ type }) => {
    const { accessToken } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const [noPosts, setNoPosts] = useState(true)
    const [postIndex, setPostIndex] = useState(0)
    const [loadNumPosts, setLoadNumPosts] = useState(1) //Change if number of posts to load changes
    const [array, setArray] = useState([])

    const loadPosts = async () => {
        const json = JSON.stringify({ postIndex: postIndex, postType: type })
        await axiosInstance.post("posts/requestPostsForFeed", json, {
        }).then((res) => {
            if (res.data.length == 2 && postIndex == 0) {
                console.log('No posts available')
                alert!({ type: 'open', message: 'No posts available', alertType: 'info' })
            }
            else if (res.data.length == 2 && postIndex > 0) {
                console.log('All posts displayed')
                alert!({ type: 'open', message: 'All posts displayed', alertType: 'info' })
            }
            else {
                try {
                    setNoPosts(false)
                    setPostIndex(postIndex + loadNumPosts)

                    for (let i = 0; i < loadNumPosts; i++) {
                        const data = JSON.parse(res.data)[i].fields
                        // post's primary key | id
                        const pk = JSON.parse(res.data)[i].pk

                        const postedOnDate = new Date(data.postedOn * 1000).toLocaleDateString('en-US')
                        const postedByDate = new Date(data.postedBy * 1000).toLocaleDateString('en-US')

                        let newPost = {
                            title: data.title,
                            imagesLink: data.images,
                            postedOn: postedOnDate,
                            postedBy: postedByDate,
                            description: data.description,
                            id: pk
                        }
                        setArray(arr => [...arr, newPost])
                    }
                }
                catch (e) {
                    console.log("Fewer than " + loadNumPosts + " new posts")
                }
            }
        })
    }

    const handleDelete = (postId: Number) => {
        deletePost(type, postId, accessToken).then(res => {
            if (res.msg == "success") {
                setArray(array.filter(item => item.id != postId))
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
        })
    }

    //TODO: Show more post details (description, option to message, etc)on press
    const onPress = () => {

    }

    const Post = ({ title, imagesLink, postedOn, postedBy, description, id }) => {
        return (
            <TouchableOpacity style={styles.container} onPress={() => {
                console.log({ title, imagesLink, postedOn, postedBy, description, id });
            }}>
                <Image
                    style={styles.image}
                    source={{
                        uri:
                            imagesLink ?
                                imagesLink :
                                "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"
                    }}
                />
                <View style={styles.subContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <View style={{ padding: 8 }}>
                        {/* Placeholder profile picture
                        <Image source={{uri: }}> */}
                        <Text>User</Text>
                    </View>
                    <Text style={styles.quantityText}>Quantity: </Text>
                </View>
                <View>
                    <Text style={styles.needByText}>
                        Posted On: {postedOn}{'\n'}
                        Need by: {postedBy}</Text>
                    <Button buttonColor="red" mode="contained" onPress={() => handleDelete(id)}>Delete Post</Button>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        return (
            // <View>
            <Post
                title={item.title}
                imagesLink={item.imagesLink}
                postedOn={item.postedOn}
                postedBy={item.postedBy}
                description={item.description}
                id={item.id}
            />

        )
    }

    return (
        <View style={{ backgroundColor: '#F3F3F3', height: "80%", flex: 1 }}>
            {/* Temporary refresh button for web */}
            <TouchableOpacity onPress={loadPosts}>
                <Text style={[styles.refreshBtnText]}>Refresh</Text>
            </TouchableOpacity>
            {noPosts ? <Text style={styles.noPostsText}>No posts available</Text> : <></>}
            <FlashList
                renderItem={renderItem}
                data={array}
                onEndReached={loadPosts}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={125}
            />
        </View>
    )
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
    },
    noPostsText: {
        fontSize: 36,
        padding: 15,
    },
    refreshBtnText: {
        color: 'blue',
        fontSize: 24,
        padding: 15,
    }
})

export default PostRenderer