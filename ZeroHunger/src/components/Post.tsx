import { View, Text, Image, TouchableOpacity } from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import styles from "../../styles/components/postStyleSheet";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostModel } from "../models/Post";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { handleExpiryDate } from "../controllers/post";

interface Props {
    post: PostModel,
    navigation: NavigationProp<ParamListBase>,
    setShowRequests: React.Dispatch<React.SetStateAction<boolean>>,
    selectedPost: React.MutableRefObject<number>,
    openModal: () => void,
    from: string
}

export const Post: React.FC<Props> = ({ post, navigation, setShowRequests, selectedPost, openModal, from }) => {
    const { user } = useContext(AuthContext);

    const handlePress = (post: PostModel) => {
        post.type === "r" ?
            navigation.navigate('RequestDetailsScreen', post) :
            navigation.navigate('OfferDetailsScreen', post)
    }

    return (
        <GestureRecognizer
            onSwipeRight={() => setShowRequests(true)}
            onSwipeLeft={() => setShowRequests(false)}
            style={{ backgroundColor: Colors.Background }}
        >
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
                        marginTop: from === "home" ? 3 : 5,
                        marginLeft: from === "home" ? 11 : 10
                    }}>
                        {from === "home" &&
                            <Text testID="Posts.username" style={globalStyles.Small1}>{post.username}</Text>
                        }
                        {(user['username'] !== post.username) && post.distance &&
                            <View testID="Posts.locationCont" style={styles.locationCont}>
                                <Ionicons testID="Posts.locationIcon" name='location-outline' size={13} style={{ marginRight: 4 }} />
                                <Text testID="Posts.locationText" style={globalStyles.Small1}>{post.distance ? post.distance.toFixed(1) : 'x'} km away</Text>
                            </View>
                        }
                    </View>
                    {from === "history" &&
                        <Text style={[globalStyles.Tag, styles.fulfillment,
                        { marginTop: 15, color: post.fulfilled ? Colors.primaryDark : Colors.alert2 }]}
                        >{post.fulfilled ? 'Fulfilled' : 'Not fulfilled'}</Text>
                    }
                    <View
                        testID="Posts.tag"
                        style={[styles.postTag, [(user['username'] === post.username && from !== "history") ? { marginTop: 20 } : {}]]}>
                        {/* Placeholder need by date */}
                        <Text testID="Posts.tagLabel" style={styles.postTagLabel}>{handleExpiryDate(post.expiryDate, post.type)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </GestureRecognizer>
    )
}

export default Post