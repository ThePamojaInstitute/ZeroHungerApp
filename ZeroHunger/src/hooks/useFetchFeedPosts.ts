import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../config";

export default function useFetchPosts(
    accessToken: string,
    type: "r" | "o",
    sortBy: "new" | "old" | "distance",
    categories: number[],
    diet: number[],
) {
    const getPosts = async ({ pageParam = 0 }) => {
        console.log("updating...");
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