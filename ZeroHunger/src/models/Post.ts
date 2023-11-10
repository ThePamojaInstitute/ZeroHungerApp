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
    logistics: Char[];
    postalCode: string;
    accessNeeds: string;
    distance: number | null;
    categories: Char[];
    diet: Char[];
    expiryDate: string;
}