import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { Text, ActivityIndicator, RefreshControl, View, Dimensions, Pressable } from "react-native"
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { deletePost, markAsFulfilled } from "../controllers/post";
import { useAlert } from "../context/Alert";
import useFetchHistoryPosts from "../hooks/useFetchHistoryPosts";
import { PostModel } from "../models/Post";
import { Post } from "./Post";
import { default as _MyPostModal } from "./MyPostModal";


const MyPostModal = forwardRef(_MyPostModal)

const NoPosts = ({ type, navigate }) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.15,
        paddingHorizontal: 50,
    }}>
        <Text
            style={[globalStyles.H2, { marginBottom: 10, textAlign: 'center' }]}>
            No {type === 'r' ? 'requests' : 'offers'} yet
        </Text>
        <Text style={[globalStyles.Body, { textAlign: 'center' }]}>
            You will see your history once you make your first food {type === 'r' ? 'request' : 'offer'}
        </Text>
        <Pressable
            style={[globalStyles.defaultBtn, { width: '90%' }]}
            onPress={() => navigate(`${type === 'r' ? 'Request' : 'Offer'}FormScreen`)}
        >
            <Text style={globalStyles.defaultBtnLabel}>
                {type === 'r' ? 'Request' : 'Offer'} Food
            </Text>
        </Pressable>
    </View>
)

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
        return (
            <NoPosts type={type} navigate={navigation.navigate} />
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
