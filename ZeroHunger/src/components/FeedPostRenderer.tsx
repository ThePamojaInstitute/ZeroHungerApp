import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Text, RefreshControl, ActivityIndicator } from "react-native";
import styles from "../../styles/components/postRendererStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";
import { useAlert } from "../context/Alert";
import { FlashList } from "@shopify/flash-list";
import { deletePost, markAsFulfilled } from "../controllers/post";
import useFetchFeedPosts from "../hooks/useFetchFeedPosts";
import { useIsFocused } from '@react-navigation/native';
import { Post } from "./Post";
import { PostModel } from "../models/Post";
import { default as _MyPostModal } from "./MyPostModal";
import { getAccessToken } from "../../config";


const MyPostModal = forwardRef(_MyPostModal)

export const FeedPostRenderer = ({ type, navigation, setShowRequests, sortBy, categories, diet, logistics, accessNeeds, distance, setUpdater }) => {
    const { dispatch: alert } = useAlert()

    const [refreshing, setRefreshing] = useState(false)

    const selectedPost = useRef(0)
    const modalRef = useRef(null)
    const listRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
    }

    const isFocused = useIsFocused();

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        refetch,
        isFetchedAfterMount
    } = useFetchFeedPosts(type, sortBy, categories, diet, logistics, accessNeeds, distance)

    useEffect(() => {
        const updater = () => {
            listRef?.current?.scrollToOffset({ animated: false, offset: 0 })
            refetch()
        }
        setUpdater(() => () => updater())
    }, [])


    // on navigation
    useEffect(() => {
        if (isFocused) {
            refetch()
        } else return
    }, [isFocused])

    if (isLoading) return <ActivityIndicator animating size="large" color={Colors.primary} />

    if (isError) return <Text>An error occurred while fetching data</Text>

    const flattenData = data.pages.flatMap((page) => page.data)

    if (flattenData.length === 0 && isFetchedAfterMount) {
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
                from="home"
                key={item.postId}
            />
        )
    }

    return (
        <>
            {isFetchedAfterMount ?
                <FlashList
                    ref={listRef}
                    testID="Posts.list"
                    renderItem={renderItem}
                    data={flattenData}
                    onEndReached={loadNext}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={125}
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

export default FeedPostRenderer
