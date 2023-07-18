export interface PostModel {
    title: string;
    imageLink: string;
    postedOn: string;
    postedBy: number;
    description: string;
    fulfilled: boolean;
    postId: number;
    username: string;
    type: "r" | "o";
}