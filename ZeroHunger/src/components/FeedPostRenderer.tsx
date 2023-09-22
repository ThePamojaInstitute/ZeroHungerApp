import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Text, RefreshControl, ActivityIndicator, View, Pressable, Dimensions, Platform } from "react-native";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { useAlert } from "../context/Alert";
import { FlashList } from "@shopify/flash-list";
import { deletePost, markAsFulfilled } from "../controllers/post";
import useFetchFeedPosts from "../hooks/useFetchFeedPosts";
import { useIsFocused } from '@react-navigation/native';
import { Post } from "./Post";
import { PostModel } from "../models/Post";
import { default as _MyPostModal } from "./MyPostModal";
import { getItemFromLocalStorage, setLocalStorageItem, storage } from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';


const MyPostModal = forwardRef(_MyPostModal)

const NoPosts = ({ type, filtersAreOn, navigate, clearFilters, width }) => (
    <View style={{
        marginTop: Dimensions.get('window').height * 0.15,
    }}>
        <View style={Platform.OS === 'web' ? {
            maxWidth: 700,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: width
        } : {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 50,
        }}>
            <Text
                style={[globalStyles.H2, { marginBottom: 10, textAlign: 'center' }]}>
                {filtersAreOn ?
                    `No ${type === 'r' ? 'requests' : 'offers'} matching your filters`
                    : `No ${type === 'r' ? 'requests' : 'offers'} yet`}
            </Text>
            <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
                {filtersAreOn ?
                    'Try removing some of your filters to get more results'
                    : `Make your first ${type === 'r' ? 'request' : 'offer'}!`}
            </Text>
            <Pressable
                style={[globalStyles.defaultBtn, { width: '90%' }]}
                onPress={() => {
                    if (filtersAreOn) {
                        clearFilters()
                    } else {
                        navigate(`${type === 'r' ? 'Request' : 'Offer'}FormScreen`)
                    }
                }}
            >
                <Text style={globalStyles.defaultBtnLabel}>
                    {filtersAreOn ?
                        'Clear filters'
                        : `${type === 'r' ? 'Request' : 'Offer'} Food`}
                </Text>
            </Pressable>
        </View>
    </View>
)

export const FeedPostRenderer = ({
    type,
    navigation,
    setShowRequests,
    sortBy,
    categories,
    diet,
    logistics,
    distance,
    setUpdater,
    clearFilters
}) => {

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
        isFetchedAfterMount,
        isFetching
    } = useFetchFeedPosts(type, sortBy, categories, diet, logistics, distance)

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

    if (isLoading || isFetching) return <ActivityIndicator animating size="large" color={Colors.primary} />

    if (isError) return <Text>An error occurred while fetching data</Text>

    const flattenData = data.pages.flatMap((page) => page.data)

    //Store data in cache as JSON
    if (Platform.OS === "web") {
        storage.set("cachedPosts", JSON.stringify(flattenData))
    }
    else {
        AsyncStorage.setItem("cachedPosts", JSON.stringify(flattenData))
    }

    if (flattenData.length === 0 && isFetchedAfterMount) {
        let filtersAreOn = false
        if (categories.length || diet.length || logistics.length || distance < 30) {
            filtersAreOn = true
        }

        const screenWidth = Dimensions.get('window').width
        const width = screenWidth > 700 ? 700 : screenWidth

        return (
            <NoPosts
                type={type}
                filtersAreOn={filtersAreOn}
                navigate={navigation.navigate}
                clearFilters={clearFilters}
                width={width}
            />
        )
    }

    const loadNext = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }

    const handleDelete = async (postId: number) => {
        const res = await deletePost(type, postId)
        if (res.msg == "success") {
            refetch()
            alert!({ type: 'open', message: res.res, alertType: 'success' })
        } else {
            alert!({ type: 'open', message: res.res, alertType: 'error' })
        }
    }

    const handleMarkAsFulfilled = async (postId: number) => {
        const res = await markAsFulfilled(type, postId)
        if (res.msg == "success") {
            refetch()
            alert!({ type: 'open', message: res.res, alertType: 'success' })
        } else {
            alert!({ type: 'open', message: res.res, alertType: 'error' })
        }
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
                refetch={refetch}
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
