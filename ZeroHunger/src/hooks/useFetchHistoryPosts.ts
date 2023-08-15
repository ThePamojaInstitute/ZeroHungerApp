import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance, storage } from "../../config";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../../env";

export default function useFetchHistoryPosts(
    type: "r" | "o",
    orderByNewest: boolean,
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>
) {
    const getPosts = async ({ pageParam = 0 }) => {
        let accessToken
        if (ENV === 'production') {
            accessToken = storage.getString('access_token')
        } else {
            if (Platform.OS === 'web') {
                accessToken = storage.getString('access_token')
            } else {
                accessToken = await AsyncStorage.getItem('access_token')
            }
        }

        const res = await axiosInstance.get(`posts/postsHistory`, {
            headers: {
                Authorization: accessToken
            },
            params: {
                'postsType': type,
                'orderByNewest': orderByNewest,
                'page': pageParam,
            }
        })
        setLoaded(true)

        return {
            data: res.data,
            nextPage: pageParam + 1,
        };
    };

    return useInfiniteQuery(["historyPosts"], getPosts, {
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < 5) return undefined;

            return lastPage.nextPage;
        },
        refetchOnMount: false
    });
}