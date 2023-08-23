import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { Colors, Fonts } from "../../../styles/globalStyleSheet"


export const HomeCustomHeaderRight = ({ navigation, expiringPosts, setExpiringPosts }) => (
    <View style={{ flexDirection: 'row' }}>
        <View>
            <Ionicons
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
                    top: -4,
                    right: expiringPosts.length > 9 ? -11 : -5,
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
        {/* <Ionicons
            style={{ padding: 16 }}
            name="md-search"
            size={22}
            // onPress={() => { }}
            testID="Home.searchBtn"
        /> */}
    </View>
)