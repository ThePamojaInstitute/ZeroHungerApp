import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Button } from "react-native-paper";
import { deletePost } from "../controllers/post";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';

export const PostRenderer = ({ type, navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const { dispatch: alert } = useAlert()
    const { user, accessToken } = useContext(AuthContext);

    const [noPosts, setNoPosts] = useState(false)
    const [postIndex, setPostIndex] = useState(0)
    const [array, setArray] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [endReached, setEndReached] = useState(false)
    const [requestsLength, setRequestsLength] = useState(0)
    const [offersLength, setOffersLength] = useState(0)

    const fetchLengths = async () => {
        const res = await axiosInstance.get("posts/requestPostsForFeed")
        setRequestsLength(res.data["r"])
        setOffersLength(res.data["o"])
    }

    useEffect(() => {
        fetchLengths()
    }, [])

    useEffect(() => {
        if (type === "r" && postIndex > requestsLength) {
            setPostIndex(requestsLength)
        } else if (type === "o" && postIndex > offersLength) {
            setPostIndex(offersLength)
        }
    }, [postIndex])

    useEffect(() => {
        if (type === "r" && postIndex > requestsLength) {
            setPostIndex(requestsLength)
        } else if (type === "o" && postIndex > offersLength) {
            setPostIndex(offersLength)
        }
    }, [requestsLength, offersLength])

    const loadNumPosts = 5 //Change if number of posts to load changes

    const loadPosts = async () => {
        if ((requestsLength <= array.length) && requestsLength != 0) return

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
        if (type === "r" && (requestsLength <= array.length) && requestsLength != 0) {
            array.pop()
        } else if (type === "o" && (offersLength <= array.length) && offersLength != 0) {
            array.pop()
        }
    }, [array])

    useFocusEffect(() => {
        fetchLengths()
    })

    useEffect(() => {
        if (type === "r" && requestsLength > 0 && requestsLength != postIndex && endReached) {
            loadPosts()
        } else if (type === "o" && offersLength > 0 && offersLength != postIndex && endReached) {
            loadPosts()
        }
    }, [requestsLength, offersLength])

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
                    <Text style={globalStyles.H4}>{title}</Text>
                    <View style={{ marginTop: 16 }}>
                        {/* Placeholder profile picture
                        <Image source={{uri: }}> */}
                        <Text style={globalStyles.Small1}>{username}</Text>
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
        if (!item) return

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
        <View style={{ backgroundColor: Colors.Background, height: "80%" }}>
            {/* Temporary refresh button for web */}
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <TouchableOpacity onPress={fetchLengths}>
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
                        // keyExtractor={(item, index) => item.postId}
                        />}
                    {!endReached && isLoading && <Text>Loading...</Text>}
                    {endReached && (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20 }}>End Reached</Text>
                        </View>
                    )}
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: 100,
        // padding: 10,
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 0,
        marginLeft: 8,
        marginRight: 0,
        borderRadius: 5,
        overflow: 'hidden',
        color: Colors.offWhite,
    },
    subContainer: {
        flex: 1,
        marginTop: 4,
        marginBottom: 8,
        marginLeft: 4,
        marginRight: 8,
        color: Colors.offWhite,
    },
    image: {
        width: 105,
        height: 105,
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