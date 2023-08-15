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
    accessNeeds: Char,
    distance: Number
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
                'accessNeeds': accessNeeds,
                'distance': distance
            }
        })
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