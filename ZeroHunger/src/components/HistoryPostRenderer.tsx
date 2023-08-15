import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { Text, ActivityIndicator, RefreshControl } from "react-native"
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Colors } from "../../styles/globalStyleSheet";
import rendererStyles from "../../styles/components/postRendererStyleSheet";
import { deletePost, markAsFulfilled } from "../controllers/post";
import { useAlert } from "../context/Alert";
import useFetchHistoryPosts from "../hooks/useFetchHistoryPosts";
import { PostModel } from "../models/Post";
import { Post } from "./Post";
import { default as _MyPostModal } from "./MyPostModal";
import { getAccessToken } from "../../config";


const MyPostModal = forwardRef(_MyPostModal)

export const HistoryPostRenderer = ({ navigation, type, setShowRequests, orderByNewest }) => {
    const { user } = useContext(AuthContext);
    const { dispatch: alert } = useAlert()

    const [refreshing, setRefreshing] = useState(false)

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
        refetch,
        isFetchedAfterMount
    } = useFetchHistoryPosts(type, orderByNewest)

    useEffect(() => {
        refetch()
    }, [orderByNewest])

    if (!user) navigation.navigate('LoginScreen')

    if (isLoading) return <ActivityIndicator animating size="large" color={Colors.primary} />

    if (isError) return <Text>An error occurred while fetching data</Text>

    const flattenData = data.pages.flatMap((page) => page.data)

    if (flattenData.length === 0 && isFetchedAfterMount) {
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

    const handleDelete = async (postId: Number) => {
        const accessToken = await getAccessToken()

        deletePost(type, postId, accessToken).then(res => {
            if (res.msg == "success") {
                refetch()
                alert!({ type: 'open', message: res.res, alertType: 'success' })
            } else {
                alert!({ type: 'open', message: res.res, alertType: 'error' })
            }
        })
    }

    const handleMarkAsFulfilled = async (postId: Number) => {
        const accessToken = await getAccessToken()

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
        if (!item || !item.postId) return

        const post: PostModel = {
            title: item.title,
            imageLink: item.images,
            postedOn: item.postedOn,
            postedBy: item.postedBy,
            description: item.description,
            logistics: item.logistics,
            fulfilled: item.fulfilled,
            postalCode: item.postalCode,
            accessNeeds: item.accessNeeds,
            distance: item?.distance,
            categories: item?.categories,
            diet: item?.diet,
            expiryDate: item?.expiryDate,
            postId: item.postId,
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
                key={item.postId}
            />
        )
    }

    return (
        <>
            {isFetchedAfterMount ?
                <FlashList
                    data={flattenData}
                    renderItem={renderItem}
                    onEndReached={loadNext}
                    onEndReachedThreshold={0.3}
                    estimatedItemSize={125}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refetch} colors={[Colors.primary, Colors.primaryLight]} />
                    }
                /> :
                <ActivityIndicator animating size="large" color={Colors.primary} />
            }
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
