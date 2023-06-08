import React from "react";
import { Text } from "react-native";
import { act, render } from "@testing-library/react-native";
import { NotificationContext, NotificationContextProvider } from "../../src/context/ChatNotificationContext";

describe("NotificationContextProvider", () => {
    it("provides default notification context values", () => {
        const TestComponent = () => {
            const notificationContext = React.useContext(NotificationContext);
            return (
                <>
                    <Text testID="unreadMessageCount">{notificationContext.unreadMessageCount}</Text>
                    <Text testID="connectionStatus">{notificationContext.connectionStatus}</Text>
                    <Text testID="chatIsOpen">{notificationContext.chatIsOpen.toString()}</Text>
                    <Text testID="unreadFromUsers">{notificationContext.unreadFromUsers.join(",")}</Text>
                </>
            )
        }

        const { getByTestId } = render(
            <NotificationContextProvider>
                <TestComponent />
            </NotificationContextProvider>
        )

        expect(getByTestId("unreadMessageCount").props.children).toBe(0)
        expect(getByTestId("connectionStatus").props.children).toBe("Uninstantiated")
        expect(getByTestId("chatIsOpen").props.children).toBe("false")
        expect(getByTestId("unreadFromUsers").props.children).toBe("")
    });

    it("updates notification context values when chat is opened", async () => {
        const TestComponent = () => {
            const notificationContext = React.useContext(NotificationContext);

            React.useEffect(() => {
                // Simulate opening chat
                act(() => {
                    notificationContext.setChatIsOpen(true);
                })
            }, [])

            return <Text testID="chatIsOpen">{notificationContext.chatIsOpen.toString()}</Text>
        }

        const { getByTestId } = render(
            <NotificationContextProvider>
                <TestComponent />
            </NotificationContextProvider>
        )

        expect(getByTestId("chatIsOpen").props.children).toBe("true");
    })
})