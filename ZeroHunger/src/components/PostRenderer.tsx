import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Button } from "react-native-paper";
import { deletePost } from "../controllers/post";
import { useFocusEffect } from "@react-navigation/native";

export const PostRenderer = ({ type, navigation }) => {
    const { dispatch: alert } = useAlert()
    const { user, accessToken } = useContext(AuthContext);

    const [noPosts, setNoPosts] = useState(false)
    const [postIndex, setPostIndex] = useState(0)
    const [array, setArray] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [endReached, setEndReached] = useState(false)

    const loadNumPosts = 5 //Change if number of posts to load changes

    const loadPosts = async () => {
        const json = JSON.stringify({ postIndex: postIndex, postType: type })
        await axiosInstance.post("posts/requestPostsForFeed", json, {
        }).then((res) => {
            if (res.data.length == 2 && postIndex == 0) {
                console.log('No posts available')
                setNoPosts(true)
                alert!({ type: 'open', message: 'No posts available', alertType: 'info' })
            }
            else if (res.data.length == 2 && postIndex > 0) {
                console.log('All posts displayed')
                setEndReached(true)
                // alert!({ type: 'open', message: 'All posts displayed', alertType: 'info' })
            }
            else {

                setIsLoading(true)
                try {
                    setPostIndex(postIndex + loadNumPosts)

                    for (let i = 0; i < loadNumPosts; i++) {
                        if (!JSON.parse(res.data)[i]) return
                        const data = JSON.parse(res.data)[i].fields
                        // post's primary key | id
                        const pk = JSON.parse(res.data)[i].pk
                        const username = JSON.parse(res.data)[i].username

                        const postedOnDate = new Date(data.postedOn * 1000).toLocaleDateString('en-US')

                        let newPost = {
                            title: data.title,
                            imagesLink: data.images,
                            postedOn: postedOnDate,
                            postedBy: data.postedBy,
                            description: data.description,
                            postId: pk,
                            username: username
                        }
                        setArray(arr => [...arr, newPost])
                    }
                }
                catch (e) {
                    console.log("Fewer than " + loadNumPosts + " new posts")
                }
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        console.log(postIndex);

        if (array.length > postIndex) {
            setArray(array.slice(0, -1))
        } else if (array.length < postIndex) {
            setPostIndex(array.length + 1)
        }
    }, [array, postIndex])

    useFocusEffect(() => {
        console.log("change");
        if (endReached) loadPosts()
    })


    const handleDelete = (postId: Number) => {
        deletePost(type, postId, accessToken).then(res => {
            if (res.msg == "success") {
                setArray(array.filter(item => item.postId != postId))
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
        })
    }

    const onPress = (title: string,
        imagesLink: string,
        postedOn: Number,
        postedBy: Number,
        description: string,
        postId: Number,
        username: string) => {
        //Placeholder image
        imagesLink = imagesLink ? imagesLink : "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"

        type === "r" ?
            navigation.navigate('RequestDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username
            })
            :
            navigation.navigate('OfferDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username
            })
    }

    const Post = ({ title, imagesLink, postedOn, postedBy, description, postId, username }) => {
        return (
            <TouchableOpacity style={styles.container} onPress={() => onPress(
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username)}>
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
                    <View style={{ padding: 0 }}>
                        {/* Placeholder profile picture
                        <Image source={{uri: }}> */}
                        <Text style={{ marginTop: 8 }}>{username}</Text>
                    </View>
                    {/* <Text style={styles.quantityText}>Quantity: </Text> */}
                </View>
                <View>
                    <Text style={styles.postedOnText}>Posted On: {postedOn}</Text>
                    {user && user['username'] === username &&
                        <Button buttonColor="red"
                            mode="contained"
                            onPress={() => handleDelete(postId)}
                        >Delete Post</Button>}
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <Post
                title={item.title}
                imagesLink={item.imagesLink}
                postedOn={item.postedOn}
                postedBy={item.postedBy}
                description={item.description}
                postId={item.postId}
                username={item.username}
            />
        )
    }

    return (
        <View style={{ backgroundColor: '#F3F3F3', height: "80%" }}>
            {/* Temporary refresh button for web */}
            <TouchableOpacity onPress={loadPosts}>
                <Text style={[styles.refreshBtnText]}>Refresh</Text>
            </TouchableOpacity>
            {noPosts ? <Text style={styles.noPostsText}>No posts available</Text> : <></>}
            {user &&
                <FlashList
                    renderItem={renderItem}
                    data={array}
                    onEndReached={loadPosts}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={125}
                    keyExtractor={(item, index) => item.postId}
                />}
            {!endReached && isLoading && <Text>Loading...</Text>}
            {endReached && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>End Reached</Text>
                </View>
            )}
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
    postedOnText: {
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