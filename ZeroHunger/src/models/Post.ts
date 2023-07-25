import { Char } from "../../types";

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
    logistics: string;
    postalCode: string;
    accessNeeds: Char;
    distance: number;
    categories: string;
    diet: string;
}