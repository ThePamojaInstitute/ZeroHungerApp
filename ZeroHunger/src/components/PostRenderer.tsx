import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { Text, RefreshControl, ActivityIndicator } from "react-native";
import styles from "../../styles/components/postRendererStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";
import { axiosInstance } from "../../config";
import { useAlert } from "../context/Alert";
import { AuthContext } from "../context/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { deletePost, markAsFulfilled } from "../controllers/post";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import useFetchPosts from "../hooks/useFetchPosts";
import { useIsFocused } from '@react-navigation/native';
import { Post } from "./Post";
import { PostModel } from "../models/Post";
import { default as _MyPostModal } from "./MyPostModal";
import {
    BlobServiceClient,
    generateAccountSASQueryParameters,
    AccountSASPermissions,
    AccountSASServices,
    AccountSASResourceTypes,
    StorageSharedKeyCredential,
    SASProtocol
} from '@azure/storage-blob';


const MyPostModal = forwardRef(_MyPostModal)

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

    const selectedPost = useRef(0)
    const modalRef = useRef(null)

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
        refetch
    } = useFetchPosts("requestPostsForFeed", accessToken, type, true)

    // on navigation
    useEffect(() => {
        if (isFocused) {
            refetch()
        } else return
    }, [isFocused])

    if (!user) return navigation.navigate('LoginScreen')

    if (!loaded) return <Text>Loading...</Text>

    if (!data) return <Text>An error occurred while fetching data</Text>

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

    // const constants = {
    //     accountName:
    //     accountKey: 
    // };
    // const sharedKeyCredential = new StorageSharedKeyCredential(
    //     constants.accountName,
    //     constants.accountKey
    // );

    // async function createAccountSas() {

    //     const sasOptions = {

    //         services: AccountSASServices.parse("btqf").toString(),          // blobs, tables, queues, files
    //         resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
    //         permissions: AccountSASPermissions.parse("rwdlacupi"),          // permissions
    //         protocol: SASProtocol.Https,
    //         startsOn: new Date(),
    //         expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),   // 10 minutes
    //     };

    //     // const sasToken = generateAccountSASQueryParameters(
    //     //     sasOptions,
    //     //     sharedKeyCredential 
    //     // ).toString();

    //     console.log(`sasToken = '${sasToken}'\n`);

    //     // prepend sasToken with `?`
    //     return (sasToken[0] === '?') ? sasToken : `?${sasToken}`;
    // }



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
                from="home"
                key={item.pk}
            />
        )
    }

    return (
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
            <MyPostModal
                ref={modalRef}
                selectedPost={selectedPost}
                handleDelete={handleDelete}
                handleMarkAsFulfilled={handleMarkAsFulfilled}
            />
        </>
    )
}

export default PostRenderer
