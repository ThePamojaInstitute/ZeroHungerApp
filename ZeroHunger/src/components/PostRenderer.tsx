import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions } from "react-native";
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
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GestureRecognizer from 'react-native-swipe-gestures';
import useFetchPosts from "../hooks/useFetchPosts";
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import bottomTabStyles from "../../styles/components/bottomTabStyleSheet";
import historyStyles from "../../styles/screens/postsHistory";

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

    const [refreshing, setRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState(0)

    const isFocused = useIsFocused();

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        refetch
    } = useFetchPosts("requestPostsForFeed", accessToken, type, true)

    // on navigation
    useEffect(() => {
        if (isFocused) {
            refetch()
        }
    }, [isFocused])

    if (isLoading) return <ActivityIndicator animating size="large" color={Colors.primary} />

    if (isError) return <Text>An error occurred while fetching data</Text>

    const flattenData = data.pages.flatMap((page) => page.data)

    if (flattenData.length === 0) {
        return <Text
            testID="Posts.noPostsText"
            style={styles.noPostsText}
        >No {type === "r" ? 'requests' : 'offers'} available</Text>
    }

    const loadNext = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }

    const handleDelete = (postId: Number) => {
        deletePost(type, postId, accessToken).then(res => {
            if (res.msg == "success") {
                refetch()
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
        })
    }

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
            })
    }

    const ModalComponent = () => (
        <View>
            <Modal
                testID="Bottom.postNavModal"
                isVisible={modalVisible}
                animationIn="slideInUp"
                backdropOpacity={0.5}
                onBackButtonPress={() => setModalVisible(!modalVisible)}
                onBackdropPress={() => setModalVisible(!modalVisible)}
                onSwipeComplete={() => setModalVisible(!modalVisible)}
                swipeDirection={['down']}
                style={[bottomTabStyles.modal,
                { marginTop: Dimensions.get('window').height * 0.85 }]}
            >
                <View style={{ marginBottom: 25 }}>
                    <View
                        testID="Bottom.postNavModalCont"
                        style={bottomTabStyles.modalContent}>
                        <Text
                            testID="Bottom.postNavModalLabel"
                            style={[globalStyles.H3, { alignSelf: 'center' }]}
                        >Ticket options</Text>
                    </View>
                    <TouchableOpacity
                        testID="Bottom.postNavModalClose"
                        style={bottomTabStyles.modalClose}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Ionicons name="close" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "flex-start", gap: 12 }}>
                    <TouchableOpacity
                        style={historyStyles.modalItem}
                        onPress={() => {
                            handleDelete(selectedPost)
                            setModalVisible(false)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color="black"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={globalStyles.Body}>Delete ticket</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )

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
                            {user['username'] === username &&
                                <TouchableOpacity
                                    testID="Posts.ellipsis"
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => {
                                        setSelectedPost(postId)
                                        setModalVisible(true)
                                    }}
                                >
                                    <Entypo name="dots-three-horizontal" size={16} color="black" style={styles.postEllipsis} />
                                </TouchableOpacity>}
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
                    </View>
                </TouchableOpacity>
            </GestureRecognizer>
        )
    }

    const renderItem = ({ item }) => {
        if (!item || !item.pk) return

        return (
            <Post
                title={item['fields'].title}
                imagesLink={item['fields'].imagesLink}
                postedOn={item['fields'].postedOn}
                postedBy={item['fields'].postedBy}
                description={item['fields'].description}
                postId={item.pk}
                username={item.username}
                key={item.pk}
            />
        )
    }

    return (
        <>
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    {user &&
                        <>
                            <FlashList
                                testID="Posts.list"
                                renderItem={renderItem}
                                data={flattenData}
                                onEndReached={loadNext}
                                onEndReachedThreshold={0.7}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                estimatedItemSize={125}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refetch} colors={[Colors.primary, Colors.primaryLight]} />
                                }
                            />
                            <ModalComponent />
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostRenderer
