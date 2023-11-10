import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import type { Subscription } from 'expo-modules-core';
import type { Notification } from 'expo-notifications';

// Will need a paid Apple developer account in order to add the Apple certificate at build time.

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: "test push",
        body: 'And here is the body!',
    };

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })

}

export default function NotificationsTest({ setExpoToken }) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notification>();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();


    useEffect(() => {

        registerForPushNotificationsAsync().then(token => {
            console.log(token);
            setExpoToken(token)
            setExpoPushToken(token)
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current)
        };
    }, []);



    return (
        <View
            style={{
                // flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
            {/* <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            <Button
                title="Press to schedule a notification"
                onPress={async () => {
                    await schedulePushNotification();
                }}
            />
            <Button
                title="Press"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            /> */}
        </View>
    );
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token: string;

    if (Platform.OS === 'android') {
        const res = await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });

        console.log(`channel: ${res.id}`);
    }

    // if (Platform.OS === 'android' && parseInt(Device.osVersion) >= 13) {
    //     token = (await Notifications.getExpoPushTokenAsync()).data;
    //     // console.log(token);
    //     return token
    // }

    if (Device.isDevice && Platform.OS != 'web') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            console.log(status);

            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        if (Platform.OS !== 'web') {
            alert('Must use physical device for Push Notifications');
        }
    }

    return token;
}
