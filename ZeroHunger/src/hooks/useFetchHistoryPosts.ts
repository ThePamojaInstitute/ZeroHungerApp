import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance, storage } from "../../config";

export default function useFetchHistoryPosts(type: "r" | "o", orderByNewest: boolean) {
    const getPosts = async ({ pageParam = 0 }) => {
        const res = await axiosInstance.get(`posts/postsHistory`, {
            headers: {
                Authorization: storage.getString('access_token')
            },
            params: {
                'postsType': type,
                'orderByNewest': orderByNewest,
                'page': pageParam,
            }
        })
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