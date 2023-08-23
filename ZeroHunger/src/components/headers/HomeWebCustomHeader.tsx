import { Text, View } from "react-native"
import { Colors, Fonts, globalStyles } from "../../../styles/globalStyleSheet"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"


export const HomeWebCustomHeader = ({ navigation, updater, expiringPosts, setExpiringPosts, t }) => (
    <View style={{ backgroundColor: Colors.offWhite }}>
        <View style={{ maxWidth: 700, marginHorizontal: 'auto', width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                <Ionicons
                    style={{
                        marginRight: 15,
                    }}
                    name="menu"
                    size={24}
                    onPress={navigation.openDrawer}
                    testID="Home.drawerBtn"
                />
                <Text style={globalStyles.H4}>{t("app.title")}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                <MaterialIcons
                    style={{ paddingHorizontal: 10 }}
                    name="refresh"
                    size={26}
                    color="black"
                    onPress={updater}
                />
                <View>
                    <Ionicons
                        style={{ marginHorizontal: 16 }}
                        name="notifications-sharp"
                        size={22}
                        onPress={() => {
                            navigation.navigate("NotificationsScreen", { posts: expiringPosts })
                            setExpiringPosts([])
                        }}
                        testID="Home.notificationBtn"
                    />
                    {!!expiringPosts?.length &&
                        <View style={{
                            height: 15,
                            minWidth: 15,
                            backgroundColor: Colors.alert2,
                            borderRadius: 7.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: -5,
                            right: 10,
                        }}>
                            <Text style={{
                                color: Colors.white,
                                fontFamily: Fonts.PublicSans_SemiBold,
                                fontWeight: '600',
                                fontSize: 11,
                                marginHorizontal: 4,
                            }}>{expiringPosts.length > 9 ? '9+' : expiringPosts.length}</Text>
                        </View>
                    }
                </View>
            </View>
        </View>
    </View>
)