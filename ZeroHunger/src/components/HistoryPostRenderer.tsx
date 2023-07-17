import { useContext, useEffect, useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity, Image, Dimensions } from "react-native"
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import rendererStyles from "../../styles/components/postRendererStyleSheet";
import historyStyles from "../../styles/screens/postsHistory";
import bottomTabStyles from "../../styles/components/bottomTabStyleSheet";
import GestureRecognizer from "react-native-swipe-gestures";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { deletePost, markAsFulfilled } from "../controllers/post";
import Modal from 'react-native-modal';
import { useAlert } from "../context/Alert";
import useFetchPosts from "../hooks/useFetchPosts";


export const HistoryPostRenderer = ({ navigation, type, setShowRequests, orderByNewest }) => {
    const { user, accessToken } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    // const [refreshing, setRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState(0)

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        refetch
    } = useFetchPosts("postsHistory", accessToken, type, orderByNewest)

    useEffect(() => {
        refetch()
    }, [orderByNewest])

    if (isLoading) return <ActivityIndicator animating size="large" color={Colors.primary} />

    if (isError) return <Text>An error occurred while fetching data</Text>

    const flattenData = data.pages.flatMap((page) => page.data)

    if (flattenData.length === 0) {
        return <Text
            testID="Posts.noPostsText"
            style={rendererStyles.noPostsText}
        >No {type === "r" ? 'requests' : 'offers'} available</Text>
    }

    const loadNext = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
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

    const handleMarkAsFulfilled = (postId: Number) => {
        markAsFulfilled(type, postId, accessToken).then(res => {
            if (res.msg == "success") {
                refetch()
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
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
                { marginTop: Dimensions.get('window').height * 0.78 }]}
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
                        style={[historyStyles.modalItem, historyStyles.modalItemBorder]}
                        onPress={() => {
                            handleMarkAsFulfilled(selectedPost)
                            setModalVisible(false)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={24} color="black"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={globalStyles.Body}>Mark as fulfilled</Text>
                    </TouchableOpacity>
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

    const Post = ({ title, imagesLink, postedOn, postedBy, description, fulfilled, postId, username }) => {
        return (
            <GestureRecognizer
                onSwipeRight={() => setShowRequests(true)}
                onSwipeLeft={() => setShowRequests(false)}
                style={{ backgroundColor: Colors.Background }}
            >
                <TouchableOpacity style={rendererStyles.container}
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
                            style={rendererStyles.image}
                            source={{
                                uri:
                                    imagesLink ?
                                        imagesLink :
                                        "https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600"
                            }}
                        />
                    </View>
                    <View testID="Posts.subContainer" style={rendererStyles.subContainer}>
                        <View testID="Posts.contentCont" style={{ flexDirection: 'row' }}>
                            <Text
                                testID="Posts.title"
                                style={[globalStyles.H4, { marginLeft: 10 }]}
                            >{title}</Text>
                            <TouchableOpacity
                                testID="Posts.ellipsis"
                                style={{ marginLeft: 'auto' }}
                                onPress={() => {
                                    setSelectedPost(postId)
                                    setModalVisible(true)
                                }}
                            >
                                <Entypo
                                    name="dots-three-horizontal"
                                    size={16}
                                    color="black"
                                    style={rendererStyles.postEllipsis} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 5, marginLeft: 10 }}>
                            <View testID="Posts.locationCont" style={rendererStyles.locationCont}>
                                <Ionicons
                                    testID="Posts.locationIcon"
                                    name='location-outline'
                                    size={13}
                                    style={{ marginRight: 4 }} />
                                {/* Placeholder distance away */}
                                <Text testID="Posts.locationText" style={globalStyles.Small1}>{1} km away</Text>
                            </View>
                        </View>
                        <Text style={[globalStyles.Tag, historyStyles.fulfillment,
                        { color: fulfilled ? Colors.primaryDark : Colors.alert2 }]}
                        >{fulfilled ? 'Fulfilled' : 'Not fulfilled'}</Text>
                        <View testID="Posts.tag" style={rendererStyles.postTag}>
                            {/* Placeholder need by date */}
                            <Text testID="Posts.tagLabel" style={rendererStyles.postTagLabel}>Need in {3} days</Text>
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
                fulfilled={item['fields'].fulfilled}
                postId={item.pk}
                username={item.username}
                key={item.pk}
            />
        )
    }

    return (
        <>
            {user &&
                <>
                    <FlashList
                        data={flattenData}
                        renderItem={renderItem}
                        onEndReached={loadNext}
                        onEndReachedThreshold={0.3}
                        estimatedItemSize={125}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                    <ModalComponent />
                </>
            }
        </>
    )
}

export default HistoryPostRenderer
