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
import { Ionicons } from '@expo/vector-icons';

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

    // on component mount
    useEffect(() => {
        fetchLengths()
    }, [])

    // on navigation change
    useFocusEffect(() => {
        fetchLengths()
    })

    useEffect(() => {
        if (type === "r" &&
            (postIndex < requestsLength || postIndex > requestsLength)) {
            setPostIndex(requestsLength)
        } else if (type === "o" &&
            (postIndex < offersLength || postIndex > offersLength)) {
            setPostIndex(offersLength)
        }
    }, [requestsLength, offersLength])

    const loadNumPosts = 5 //Change if number of posts to load changes

    const loadPosts = async () => {
        const json = JSON.stringify({
            postIndex: (postIndex === 0 ? postIndex : postIndex - 1)
            , postType: type
        })
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
        if ((type === "r" && (requestsLength < array.length) && requestsLength != 0) ||
            (type === "o" && (offersLength < array.length) && offersLength != 0)) {
            array.pop()
        }
    }, [array])

    useEffect(() => {
        if ((type === "r" && requestsLength > 0 && endReached) ||
            (type === "o" && offersLength > 0 && endReached)) {
            loadPosts()
        }
    }, [postIndex])


    // const handleDelete = (postId: Number) => {
    //     deletePost(type, postId, accessToken).then(res => {
    //         if (res.msg == "success") {
    //             setArray(array.filter(item => item.postId != postId))
    //             alert!({ type: 'open', message: res.res, alertType: 'success' })
    //         } else {
    //             alert!({ type: 'open', message: res.res, alertType: 'error' })
    //         }
    //     })
    // }

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
                username,
                array,
                setArray
            })
            :
            navigation.navigate('OfferDetailsScreen', {
                title,
                imagesLink,
                postedOn,
                postedBy,
                description,
                postId,
                username,
                array,
                setArray
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
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={globalStyles.H4}>{title}</Text>
                        <TouchableOpacity style={{ marginLeft: 'auto' }}>
                            <Ionicons
                                name='ellipsis-horizontal'
                                style={styles.postEllipsis}
                                width={20}
                                height={12} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <Text style={globalStyles.Small1}>{username}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Ionicons name='location-outline' size={13} style={{ marginRight: 4 }} />
                            {/* Placeholder distance away */}
                            <Text style={globalStyles.Small1}>{1} km away</Text>
                        </View>
                    </View>
                    <View style={styles.secondaryBtn}>
                        {/* Placeholder need by date */}
                        <Text style={styles.secondaryBtnLabel}>Need in {3} days</Text>
                    </View>
                    {/* <Text style={styles.quantityText}>Quantity: </Text> */}
                </View>
                {/* <View> */}
                {/* <TouchableOpacity>
                        <Ionicons name='ellipsis-horizontal' style={styles.postEllipsis} width={20} />
                    </TouchableOpacity> */}
                {/* <Text style={styles.postedOnText}>Posted On: {postedOn}</Text> */}
                {/* {user && user['username'] === username &&
                        <Button buttonColor="red"
                            mode="contained"
                            onPress={() => handleDelete(postId)}
                        >Delete Post</Button>} */}
                {/* </View> */}
            </TouchableOpacity>
        )
    }

    const renderItem = ({ item }) => {
        if (!item || !item.postId) return

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
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    {/* Temporary refresh button for web */}
                    {/* <TouchableOpacity onPress={loadPosts}>
                    <Text style={[styles.refreshBtnText]}>Refresh</Text>
                    </TouchableOpacity> */}
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
                    {/* {endReached && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>End Reached</Text>
                </View>
            )} */}
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
        marginTop: 12,
        marginBottom: 0,
        marginLeft: 12,
        marginRight: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: Colors.offWhite,
    },
    subContainer: {
        flex: 1,
        marginTop: 8,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 8,
        color: Colors.offWhite,
        // flexDirection: 'row',
        // flexDirection: 'row'
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
    },
    postEllipsis: {
        alignSelf: 'flex-end',
        padding: 8,
        marginRight: 8
    },
    secondaryBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 5,
        alignSelf: 'flex-end',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: Colors.primaryLight,
    },
    secondaryBtnLabel: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
})

export default PostRenderer