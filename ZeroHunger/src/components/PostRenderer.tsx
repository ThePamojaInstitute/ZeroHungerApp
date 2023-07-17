import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import styles from "../../styles/components/postRendererStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { createPostObj, deletePost, isJson } from "../controllers/post";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { Entypo, Ionicons } from '@expo/vector-icons';
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
        if (endReached) return

        const json = JSON.stringify({
            postIndex: postIndex
            , postType: type
        })
        await axiosInstance.post("posts/requestPostsForFeed", json, {
        }).then((res) => {
            if (((isJson(res.data) && JSON.parse(res.data).length === 0) ||
                (Object.keys(res.data).length === 0))) {
                if (postIndex === 0) {
                    console.log('No posts available')
                    setNoPosts(true)
                } else if (postIndex > 0) {
                    console.log('All posts displayed')
                    setEndReached(true)
                }
            }
            else {
                setIsLoading(true)
                try {
                    setPostIndex((postIndex + loadNumPosts))

                    let data: object[]
                    if (isJson(res.data)) data = JSON.parse(res.data)
                    else if (res.data) data = res.data
                    else return

                    data.forEach((post: object) => {
                        const newPost = createPostObj(post['fields'], post['pk'], post['username'])
                        setArray(arr => [...arr, newPost])
                    })
                }
                catch (e) {
                    console.log(e)
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
                    testID="Posts.btn"
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
                    <View style={{ backgroundColor: Colors.Background }}>
                        <Image
                            testID="Posts.Img"
                            style={styles.image}
                            source={{
                                uri:
                                    imagesLink ?
                                        imagesLink :
                                        "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"
                            }}
                        />
                    </View>
                    <View testID="Posts.subContainer" style={styles.subContainer}>
                        <View testID="Posts.contentCont" style={{ flexDirection: 'row' }}>
                            <Text testID="Posts.title" style={[globalStyles.H4, { marginLeft: 10, marginBottom: 5 }]}>{title}</Text>
                            <TouchableOpacity testID="Posts.ellipsis" style={{ marginLeft: 'auto' }}>
                                <Entypo name="dots-three-horizontal" size={16} color="black" style={styles.postEllipsis} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 3, marginLeft: 11 }}>
                            <Text testID="Posts.username" style={globalStyles.Small1}>{username}</Text>
                            <View testID="Posts.locationCont" style={styles.locationCont}>
                                <Ionicons testID="Posts.locationIcon" name='location-outline' size={13} style={{ marginRight: 4 }} />
                                {/* Placeholder distance away */}
                                <Text testID="Posts.locationText" style={globalStyles.Small1}>{1} km away</Text>
                            </View>
                        </View>
                        <View testID="Posts.tag" style={styles.postTag}>
                            {/* Placeholder need by date */}
                            <Text testID="Posts.tagLabel" style={styles.postTagLabel}>Need in {3} days</Text>
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
                    {noPosts && <Text testID="Posts.noPostsText" style={styles.noPostsText}>No {type === "r" ? 'requests' : 'offers'} available</Text>}
                    {user &&
                        <>
                            {
                                <FlashList
                                    testID="Posts.list"
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
                                        if (firstLoad) {
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

export default PostRenderer
