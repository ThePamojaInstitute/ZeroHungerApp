import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance, storage } from "../../config";
import { Char } from "../../types";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../../env";

export default function useFetchPosts(
    type: "r" | "o",
    sortBy: "new" | "old" | "distance",
    categories: Char[],
    diet: Char[],
    logistics: Char[],
    distance: number
) {
    const getPosts = async ({ pageParam = 0 }) => {
        let accessToken: string
        if (ENV === 'production') {
            accessToken = storage.getString('access_token')
        } else {
            if (Platform.OS === 'web') {
                accessToken = storage.getString('access_token')
            } else {
                accessToken = await AsyncStorage.getItem('access_token')
            }
        }

        // //Web caching
        // var data;
        // var page;
        // // storage.delete("cachedPosts")
        // // storage.delete("pageParam")
        // if (Platform.OS === "web") {
        //     data = storage.getString("cachedPosts")

        //     //Call backend to load new posts
        //     if (!data) {
        //         const res = await axiosInstance.get(`posts/requestPostsForFeed`, {
        //             headers: {
        //                 Authorization: accessToken
        //             },
        //             params: {
        //                 'postsType': type,
        //                 'page': pageParam,
        //                 'sortBy': sortBy,
        //                 'categories': categories,
        //                 'diet': diet,
        //                 'logistics': logistics,
        //                 'distance': distance
        //             }
        //         })

        //         console.log("Calling backend")

        //         data = res.data
        //         page = pageParam + 1
        //     }

        //     //Parse data and get page counter from cache
        //     else {
        //         data = JSON.parse(data)
        //         page = +(storage.getString("pageParam")) + 1
        //     }
        // }

        // //Android and IOS
        // else {
        //     data = AsyncStorage.getItem("cachedPosts")
        //     if (!data) {
        //         const res = await axiosInstance.get(`posts/requestPostsForFeed`, {
        //             headers: {
        //                 Authorization: accessToken
        //             },
        //             params: {
        //                 'postsType': type,
        //                 'page': pageParam,
        //                 'sortBy': sortBy,
        //                 'categories': categories,
        //                 'diet': diet,
        //                 'logistics': logistics,
        //                 'distance': distance
        //             }
        //         })
        //         // console.log(pageParam)
        //         console.log("Calling backend")

        //         data = res.data
        //         page = pageParam + 1
        //     }

        //     //Parse data and get page counter from cache
        //     else {
        //         data = JSON.parse(data)
        //         page = +(AsyncStorage.getItem("pageParam")) + 1
        //     }
        // }

        // return {
        //     data: data,
        //     nextPage: page
        // }
        
        const res = await axiosInstance.get(`posts/requestPostsForFeed`, {
            headers: {
                Authorization: accessToken
            },
            params: {
                'postsType': type,
                'page': pageParam,
                'sortBy': sortBy,
                'categories': categories,
                'diet': diet,
                'logistics': logistics,
                'distance': distance
            }
        })
        console.log("Calling backend")
        return {
            data: res.data,
            nextPage: pageParam + 1,
        };
    };

    return useInfiniteQuery(["posts"], getPosts, {
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < 5) return undefined;

            return lastPage.nextPage;
        },
        refetchOnMount: false
    });
}