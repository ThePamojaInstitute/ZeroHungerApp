import React, { forwardRef, useContext, useEffect, useRef } from "react";
import { Text, ActivityIndicator } from "react-native"
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Colors } from "../../styles/globalStyleSheet";
import rendererStyles from "../../styles/components/postRendererStyleSheet";
import { deletePost, markAsFulfilled } from "../controllers/post";
import { useAlert } from "../context/Alert";
import useFetchPosts from "../hooks/useFetchPosts";
import { PostModel } from "../models/Post";
import { Post } from "./Post";
import { default as _MyPostModal } from "./MyPostModal";


const MyPostModal = forwardRef(_MyPostModal)

export const HistoryPostRenderer = ({ navigation, type, setShowRequests, orderByNewest }) => {
    const { user, accessToken } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    // const [refreshing, setRefreshing] = useState(false)
    const selectedPost = useRef(0)
    const modalRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
    }

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

    if (!user) navigation.navigate('LoginScreen')

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

    const renderItem = ({ item }) => {
        if (!item || !item.pk) return

        const post: PostModel = {
            title: item['fields'].title,
            imageLink: item['fields'].images,
            postedOn: item['fields'].postedOn,
            postedBy: item['fields'].postedBy,
            description: item['fields'].description,
            fulfilled: item['fields'].fulfilled,
            postId: item.pk,
            username: item.username,
            type: type
        }

        return (
            <Post
                post={post}
                navigation={navigation}
                openModal={openModal}
                selectedPost={selectedPost}
                setShowRequests={setShowRequests}
                from="history"
                key={item.pk}
            />
        )
    }

    return (
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
            <MyPostModal
                ref={modalRef}
                selectedPost={selectedPost}
                handleDelete={handleDelete}
                handleMarkAsFulfilled={handleMarkAsFulfilled}
            />
        </>
    )
}

export default React.memo(HistoryPostRenderer)
