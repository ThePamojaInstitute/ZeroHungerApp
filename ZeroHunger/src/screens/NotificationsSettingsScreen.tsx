import { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, Switch } from "react-native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { Platform } from "expo-modules-core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV, axiosInstance, storage } from "../../config";


const setLocalStorageItem = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
        storage.set(key, value)
    } else {
        await AsyncStorage.setItem(key, value)
    }
    return
}

const getAccessToken = async () => {
    const accessToken = Platform.OS === 'web' ?
        storage.getString('access_token') : await AsyncStorage.getItem('access_token')

    return accessToken
}

const getNotificationsSettings = async () => {
    try {
        const accessToken = ENV === 'production' ?
            storage.getString('access_token') :
            await getAccessToken()

        const res = await axiosInstance.get('/users/getNotificationsSettings', {
            headers: {
                Authorization: accessToken
            }
        })

        return res.data
    } catch (error) {
        console.log(error);
    }
}

const getSettings = async (
    setAllowExpiringPosts: React.Dispatch<React.SetStateAction<boolean>>,
    setAllowNewMessages: React.Dispatch<React.SetStateAction<boolean>>,
    setSettings: React.Dispatch<React.SetStateAction<object>>
) => {
    const settings = await getNotificationsSettings()

    setSettings(settings)
    setAllowExpiringPosts(settings['expiringPosts'])
    setAllowNewMessages(settings['newMessages'])
    if (ENV === 'production') {
        storage.set('allowExpiringPosts', settings['expiringPosts'])
    } else {
        setLocalStorageItem('allowExpiringPosts', settings['expiringPosts'])
    }
}

const updateSettings = async (allowExpiringPosts: boolean, allowNewMessages: boolean) => {
    const accessToken = ENV === 'production' ?
        storage.getString('access_token') :
        await getAccessToken()

    try {
        await axiosInstance.put('/users/updateNotificationsSettings', {
            headers: {
                Authorization: accessToken
            },
            data: {
                'allowExpiringPosts': allowExpiringPosts,
                'allowNewMessages': allowNewMessages
            }
        })

        setLocalStorageItem('allowExpiringPosts', allowExpiringPosts.toString())
    } catch (error) {
        console.log(error);

    }
}

const useIsMounted = () => {
    const isMounted = useRef(false)
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])
    return () => isMounted.current
}

export const NotificationsSettingsScreen = ({ navigation }) => {
    const [settings, setSettings] = useState<object>({})
    const [allowExpiringPosts, setAllowExpiringPosts] = useState(true)
    const [allowNewMessages, setAllowNewMessages] = useState(false)

    const mounted = useIsMounted()

    useEffect(() => {
        getSettings(setAllowExpiringPosts, setAllowNewMessages, setSettings)
    }, [])

    useEffect(() => {
        return () => {
            // update settings before unmounting if changed
            if (!mounted()) {
                if (allowExpiringPosts !== settings['expiringPosts'] ||
                    allowNewMessages !== settings['newMessages']) {
                    updateSettings(allowExpiringPosts, allowNewMessages)
                }
            }
        };
    }, [allowExpiringPosts, allowNewMessages, settings])

    return (
        <ScrollView style={{ padding: 12, backgroundColor: Colors.offWhite }}>
            {/* Eventual preferences */}
            {/* <View style={{ flexDirection: "row", paddingBottom: 16 }}>
                <Text style={globalStyles.Body}>Community requests that match your offers</Text>
                <View style={{marginLeft: "auto", paddingLeft: 16}}>
                    <Switch
                        trackColor={{false: Colors.mid, true: Colors.primary}}
                        thumbColor={Colors.white}
                        onValueChange={sets2}
                        value={s2}
                    />
                </View>
            </View> */}
            {/* <View style={{ flexDirection: "row", paddingBottom: 16 }}>
                <Text style={globalStyles.Body}>Community offers that match your requests</Text>
                <View style={{marginLeft: "auto", paddingLeft: 16}}>
                    <Switch
                        trackColor={{false: Colors.mid, true: Colors.primary}}
                        thumbColor={Colors.white}
                        onValueChange={sets2}
                        value={s2}
                    />
                </View>
            </View> */}
            <View style={{ marginBottom: 24 }}>
                <Text style={[globalStyles.H3, { marginBottom: 16 }]}>Preferences</Text>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Text style={globalStyles.Body}>Post expiring soon</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Switch
                            trackColor={{ false: Colors.mid, true: Colors.primary }}
                            thumbColor={Colors.white}
                            onValueChange={setAllowExpiringPosts}
                            value={allowExpiringPosts}
                        />
                    </View>
                </View>
            </View>
            <View>
                <Text style={[globalStyles.H3, { marginBottom: 16 }]}>Push Notifications</Text>
                {/* <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 20 }}>
                    <Text style={globalStyles.Body}>Enable notifications</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Switch
                            trackColor={{ false: Colors.mid, true: Colors.primary }}
                            thumbColor={Colors.white}
                            onValueChange={sets2}
                            value={s2}
                        />
                    </View>
                </View> */}
                <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                    <Text style={globalStyles.Body}>New messages</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Switch
                            trackColor={{ false: Colors.mid, true: Colors.primary }}
                            thumbColor={Colors.white}
                            onValueChange={setAllowNewMessages}
                            value={allowNewMessages}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default NotificationsSettingsScreen