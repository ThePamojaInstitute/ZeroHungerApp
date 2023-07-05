import { View, Text, StyleSheet, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
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
import GestureRecognizer from 'react-native-swipe-gestures';

export const PostRenderer = ({ type, navigation, setShowRequests }) => {
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
    const [refreshing, setRefreshing] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    const fetchLengths = async () => {
        const res = await axiosInstance.get("posts/requestPostsForFeed")
        if (res.data["r"] !== requestsLength) setRequestsLength(res.data["r"])
        else if (res.data["o"] !== offersLength) setOffersLength(res.data["o"])
    }

    // on component mount
    useEffect(() => {
        if (!user) return
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
            postIndex: (postIndex === 0 ? postIndex : postIndex)
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
                // console.log('All posts displayed')
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
            setFirstLoad(false)
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

    const refresh = () => {
        if (refreshing) return

        setRefreshing(true)
        setArray([])
        setPostIndex(0)
        setTimeout(() => setRefreshing(false), 2500)
    }

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

    const handlePress = (
        title: string,
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
            <GestureRecognizer
                onSwipeRight={() => setShowRequests(true)}
                onSwipeLeft={() => setShowRequests(false)}
                style={{ backgroundColor: Colors.Background }}
            >
                <TouchableOpacity style={styles.container}
                    onPress={() => handlePress(
                        title,
                        imagesLink,
                        postedOn,
                        postedBy,
                        description,
                        postId,
                        username)}
                    activeOpacity={0.6}
                >
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
            </GestureRecognizer>
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
                key={item.postId}
            />
        )
    }

    return (
        <>
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    {noPosts && <Text style={styles.noPostsText}>No posts available</Text>}
                    {user &&
                        <>
                            {
                                <FlashList
                                    renderItem={renderItem}
                                    data={array}
                                    onEndReached={loadPosts}
                                    onEndReachedThreshold={0.7}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    estimatedItemSize={125}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[Colors.primary, Colors.primaryLight]} />
                                    }
                                    ListEmptyComponent={() => {
                                        if (noPosts) {
                                            return <Text style={styles.noPostsText}>No posts available</Text>
                                        }
                                        else if (firstLoad) {
                                            return <ActivityIndicator animating size="large" color={Colors.primary} />
                                        }
                                    }}
                                    extraData={(type === "r" ? requestsLength : offersLength)}
                                />}
                        </>
                    }
                    {!endReached && isLoading && <Text>Loading...</Text>}
                </>
            }
        </>
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