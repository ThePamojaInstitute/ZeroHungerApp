import { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, Switch, Platform, Dimensions } from "react-native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { setLocalStorageItem, storage } from "../../config";
import { ENV } from "../../env";
import { getNotificationsSettings, updateNotificationsSettings } from "../controllers/notifications";


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
                    updateNotificationsSettings(allowExpiringPosts, allowNewMessages)
                }
            }
        };
    }, [allowExpiringPosts, allowNewMessages, settings])

    const screenWidth = Dimensions.get('window').width
    const width = screenWidth > 700 ? 700 : screenWidth

    return (
        <View style={{ height: '100%', backgroundColor: Colors.offWhite }}>
            <ScrollView
                style={[{ padding: 12 }, Platform.OS === 'web' ?
                    { maxWidth: 700, alignSelf: 'center', width: width } : {}]}
            >
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
        </View>
    )
}

export default NotificationsSettingsScreen