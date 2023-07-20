import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../config";

export default function useFetchPosts(accessToken: string, type: "r" | "o", orderByNewest: boolean) {
    const getPosts = async ({ pageParam = 0 }) => {
        const res = await axiosInstance.get(`posts/requestPostsForFeed`, {
            headers: {
                Authorization: accessToken
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

    return useInfiniteQuery(["posts"], getPosts, {
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < 5) return undefined;

            return lastPage.nextPage;
        },
    });
}