import { useState } from "react";
import { View, ScrollView, Text, Switch } from "react-native"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";

export const NotificationsSettingsScreen = ({ navigation }) => {
    //Temporary switch states
    const [s1, sets1] = useState(false)
    const [s2, sets2] = useState(false)
    const [s3, sets3] = useState(false)

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
                            onValueChange={sets1}
                            value={s1}
                        />
                    </View>
                </View>
            </View>
            <View>
                <Text style={[globalStyles.H3, { marginBottom: 16 }]}>Push Notifications</Text>
                <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 20 }}>
                    <Text style={globalStyles.Body}>Enable notifications</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Switch
                            trackColor={{ false: Colors.mid, true: Colors.primary }}
                            thumbColor={Colors.white}
                            onValueChange={sets2}
                            value={s2}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                    <Text style={globalStyles.Body}>New messages</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Switch
                            trackColor={{ false: Colors.mid, true: Colors.primary }}
                            thumbColor={Colors.white}
                            onValueChange={sets3}
                            value={s3}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default NotificationsSettingsScreen