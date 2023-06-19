import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { AuthContext } from "./AuthContext";

const DefaultProps = {
    unreadMessageCount: 0,
    connectionStatus: "Uninstantiated",
    chatIsOpen: false,
    unreadFromUsers: [],
    setChatIsOpen: () => { },
};

export interface NotificationProps {
    unreadMessageCount: number;
    connectionStatus: string;
    chatIsOpen: boolean;
    unreadFromUsers: string[];
    setChatIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotificationContext = createContext<NotificationProps>(DefaultProps);

export const NotificationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, accessToken } = useContext(AuthContext);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [chatIsOpen, setChatIsOpen] = useState(false)
    const [unreadFromUsers, setUnreadFromUsers] = useState<string[]>([])

    const { readyState } = useWebSocket(user ? `ws://zh-backend-azure-webapp.azurewebsites.net/notifications/` : null, {
        queryParams: {
            token: user ? accessToken : ""
        },
        onOpen: () => {
            console.log("Connected to Notifications!");
        },
        onClose: () => {
            console.log("Disconnected from Notifications!");
        },
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case "unread_count":
                    setUnreadMessageCount(data.unread_count);
                    setUnreadFromUsers(data.from_users)
                    break;
                case "new_message_notification":
                    setUnreadMessageCount((count) => (count += 1));
                    break;
                default:
                    console.error("Unknown message type!");
                    break;
            }
        }
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
    }[readyState];

    return (
        <NotificationContext.Provider value={{
            unreadMessageCount,
            connectionStatus,
            chatIsOpen,
            setChatIsOpen,
            unreadFromUsers,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};