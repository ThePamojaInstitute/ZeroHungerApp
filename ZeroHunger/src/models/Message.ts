import { UserModel } from "./User";

export interface MessageModel {
    id: string;
    room: string;
    from_user: UserModel;
    from_username: string;
    to_user: UserModel;
    to_username: string;
    content: string;
    timestamp: string;
    read: boolean;
}