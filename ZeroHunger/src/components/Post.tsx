import { View, Text, Image, TouchableOpacity, Pressable, Platform } from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import styles from "../../styles/components/postStyleSheet";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostModel } from "../models/Post";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { extendExpiryDate, formatPostalCode, handleExpiryDate } from "../controllers/post";
import { useAlert } from "../context/Alert";

interface Props {
    post: PostModel,
    navigation: NavigationProp<ParamListBase>,
    setShowRequests: React.Dispatch<React.SetStateAction<boolean>>,
    selectedPost: React.MutableRefObject<number>,
    openModal: () => void,
    from: string,
    refetch
}

export const Post: React.FC<Props> = ({ post, navigation, setShowRequests, selectedPost, openModal, from, refetch }) => {
    const { user } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    if (!user) return null

    const handlePress = (post: PostModel) => {
        post.type === "r" ?
            navigation.navigate('RequestDetailsScreen', post) :
            navigation.navigate('OfferDetailsScreen', post)
    }

    const handleExtendExpiryDate = async (postId: number, postType: "r" | "o") => {
        const res = await extendExpiryDate(postId, postType)

        if (res.msg === 'success') {
            alert!({ type: 'open', message: 'Post updated successfully!', alertType: 'success' })
            refetch()
        } else {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        }
    }

    const [expiryStr, expiryInDays] = handleExpiryDate(post.expiryDate, post.type)

    return (
        // <GestureRecognizer
        //     onSwipeRight={() => setShowRequests(true)}
        //     onSwipeLeft={() => setShowRequests(false)}
        //     style={{ backgroundColor: Colors.Background }}
        // >
        <TouchableOpacity style={styles.container}
            testID="Posts.btn"
            onPress={() => handlePress(post)}
            activeOpacity={0.6}
        >
            <View style={{ backgroundColor: Colors.Background }}>
                <Image
                    testID="Posts.Img"
                    style={styles.image}
                    source={
                        post.imageLink ?
                            { uri: post.imageLink } : require('../../assets/Post.png')
                    }
                />
            </View>
            <View testID="Posts.subContainer" style={styles.subContainer}>
                <View testID="Posts.contentCont" style={{ flexDirection: 'row' }}>
                    <Text
                        testID="Posts.title"
                        style={[globalStyles.H4, { marginLeft: 10 },
                        { marginBottom: from === "home" ? 5 : 0 }]}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >{post.title}</Text>
                    {user['username'] === post.username &&
                        <TouchableOpacity
                            testID="Posts.ellipsis"
                            style={{ marginLeft: 'auto' }}
                            onPress={() => {
                                selectedPost.current = post.postId
                                openModal()
                            }}
                        >
                            <Entypo name="dots-three-horizontal" size={16} color="black" style={styles.postEllipsis} />
                        </TouchableOpacity>}
                </View>
                <View style={{
                    marginTop: from === "home" ?
                        Platform.OS === 'web' ? 3 : 0
                        : 5,
                    marginLeft: from === "home" ? 11 : 10,
                    marginBottom: from === "home" ? 3 : 0
                }}>
                    {from === "home" &&
                        <Text testID="Posts.username" style={globalStyles.Small1}>{post.username}</Text>
                    }
                    {(user['username'] !== post.username) && post.distance !== null &&
                        <View testID="Posts.locationCont" style={styles.locationCont}>
                            <Ionicons testID="Posts.locationIcon" name='location-outline' size={13} style={{ marginRight: 4 }} />
                            <Text testID="Posts.locationText" style={globalStyles.Small1}>{post.distance !== null ? post.distance.toFixed(1) : 'x'} km away</Text>
                        </View>
                    }
                    {(user['username'] === post.username) && post.postalCode !== null &&
                        <View testID="Posts.locationCont" style={styles.locationCont}>
                            <Ionicons testID="Posts.locationIcon" name='location-outline' size={13} style={{ marginRight: 4 }} />
                            <Text testID="Posts.locationText" style={globalStyles.Small1}>{formatPostalCode(post?.postalCode)}</Text>
                        </View>
                    }
                </View>
                {from === "history" &&
                    <Text style={[globalStyles.Tag, styles.fulfillment,
                    { marginTop: post.fulfilled ? 20 : -5, color: post.fulfilled ? Colors.primaryDark : Colors.alert2 }]}
                    >{post.fulfilled ? 'Fulfilled' : 'Not fulfilled'}</Text>
                }
                {!post.fulfilled &&
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', position: 'absolute', right: 0 }}>
                            {(user['username'] === post.username) && expiryInDays < 2 &&
                                <Pressable
                                    style={[globalStyles.defaultBtn, { height: 20, marginTop: 3, width: 135, }]}
                                    onPress={() => { handleExtendExpiryDate(post.postId, post.type) }}
                                >
                                    <Image source={require('../../assets/Extend.png')} style={{
                                        resizeMode: 'cover',
                                        width: 13,
                                        height: 13,
                                    }} />
                                    <Text style={[globalStyles.Tag, { color: Colors.white, marginLeft: -5 }]}>Extend by 1 week</Text>
                                </Pressable>
                            }
                            <View
                                testID="Posts.tag"
                                style={[styles.postTag, { backgroundColor: expiryInDays < 2 ? Colors.alert3 : Colors.primaryLightest, marginLeft: 5 }]}>
                                <Text testID="Posts.tagLabel" style={styles.postTagLabel}>{expiryStr}</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        </TouchableOpacity>
        // </GestureRecognizer>
    )
}

export default Post