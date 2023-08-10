import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import styles from "../../styles/screens/homeStyleSheet"
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import FeedPostRenderer from "../components/FeedPostRenderer";
import { useTranslation } from "react-i18next";
import { default as _PostsFilters } from "../components/PostsFilters";
import { getPreferencesLogistics } from "../controllers/preferences";
import { Char } from "../../types";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { axiosInstance, storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";


const PostsFilters = forwardRef(_PostsFilters)

export const HomeScreen = ({ navigation }) => {
    const modalRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
    }

    const { user } = useContext(AuthContext)
    const { setChatIsOpen } = useContext(NotificationContext);

    const [showRequests, setShowRequests] = useState(true)
    const [sortBy, setSortBy] = useState<'new' | 'old' | 'distance'>('new')
    const [categories, setCategories] = useState<Char[]>([])
    const [diet, setDiet] = useState<Char[]>([])
    const [prefLogistics, setPrefLogistics] = useState<Char[]>([])
    const [logistics, setLogistics] = useState<Char[]>([])
    const [accessNeeds, setAccessNeeds] = useState<Char>()
    const [updater, setUpdater] = useState(() => () => { })
    const [showFilter, setShowFilter] = useState<'' | 'sort' | 'category' | 'diet' | 'logistics' | 'location'>('')
    const [distance, setDistance] = useState(50)
    const [expiringPosts, setExpiringPosts] = useState<object[]>()

    // on navigation change
    useFocusEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    })

    const getNotifications = async () => {
        const lastSeen = Platform.OS === 'web' ?
            storage.getString('lastSeen') : await AsyncStorage.getItem('lastSeen')

        if (lastSeen === new Date().toDateString()) return

        const accessToken = Platform.OS === 'web' ?
            storage.getString('access_token') : await AsyncStorage.getItem('access_token')

        if (!accessToken) return

        try {
            const res = await axiosInstance.get('/users/getNotifications', {
                headers: {
                    Authorization: accessToken
                }
            })
            setExpiringPosts(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    // on mount
    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
            return
        }

        // This is temporary till the redis server and Celery are setup
        try {
            axiosInstance.post('/posts/deleteExpiredPosts')
        } catch (error) {
            console.log(error);
        }
        getNotifications()

        setChatIsOpen(false)
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {Platform.OS === "web" &&
                        <MaterialIcons
                            style={{ padding: Platform.OS === 'web' ? 16 : 0 }}
                            name="refresh"
                            size={26}
                            color="black"
                            onPress={updater}
                        />
                    }
                    <View>
                        <Ionicons
                            style={{ margin: Platform.OS === 'web' ? 16 : 0 }}
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
                                top: Platform.OS === 'web' ? 13 : -4,
                                right: Platform.OS === 'web' ? 10 : expiringPosts.length > 9 ? -11 : -5,
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
        })
    }, [updater, expiringPosts])

    // useEffect(() => {
    //     if (unreadMessageCount > 0 && !chatIsOpen) {
    //         alert!({
    //             type: 'open', message: `You have ${unreadMessageCount} new ${unreadMessageCount > 1
    //                 ? 'messages' : 'message'}`, alertType: 'info'
    //         })
    //     }
    // }, [unreadMessageCount])

    useEffect(() => {
        setLogistics([])
        setAccessNeeds(null)
        getPreferencesLogistics(prefLogistics, setAccessNeeds, setLogistics)
    }, [prefLogistics])

    const handleOpen = (item: string) => {
        switch (item) {
            case 'Sort':
                setShowFilter('sort')
                openModal()
                return
            case 'Food':
                setShowFilter('category')
                openModal()
                return
            case 'Diet':
                setShowFilter('diet')
                openModal()
                return
            case 'Deli':
                setShowFilter('logistics')
                openModal()
                return
            case 'Loca':
                setShowFilter('location')
                openModal()
                return
            default:
                setShowFilter('')
                openModal()
                return
        }
    }

    const renderFilter = (item: string) => {
        return (
            <View key={item} style={styles.filter}>
                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => handleOpen(item.slice(0, 4))}>
                    <Text style={styles.filterBtnLabel}
                    >{item}</Text>
                    <Entypo name={`chevron-${'down'}`} size={14} color="black" style={{ marginLeft: -5, marginVertical: -5 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const filters = [
        'Sort',
        `Food category${categories.length > 0 ? ` (${categories.length})` : ''}`,
        `Dietary preference${diet.length > 0 ? ` (${diet.length})` : ''}`,
        `Delivery / Pick up${prefLogistics.length > 0 ? ` (${prefLogistics.length})` : ''}`,
        'Location'
    ]

    const { t, i18n } = useTranslation();
    return (
        <View testID="Home.container" style={styles.container}>
            <View testID="Home.subContainer" style={styles.subContainer}>
                <View testID="Home.requestsContainer" style={[
                    {
                        borderBottomColor: showRequests ?
                            'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                    },
                    styles.pressable
                ]}>
                    <Pressable
                        style={styles.pressableText}
                        onPress={() => setShowRequests(true)}
                        testID="Home.requestsBtn"
                    >
                        <Text testID="Home.requestsLabel" style={globalStyles.H3}>{t("home.requests.label")}</Text>
                    </Pressable>
                </View>
                <View testID="Home.offersContainer" style={[
                    {
                        borderBottomColor: !showRequests ?
                            'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                    },
                    styles.pressable
                ]}>
                    <Pressable
                        style={styles.pressableText}
                        onPress={() => setShowRequests(false)}
                        testID="Home.offersBtn"
                    >
                        <Text testID="Home.offersLabel" style={globalStyles.H3}>{t("home.offers.label")}</Text>
                    </Pressable>
                </View>
            </View>
            <View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    testID="FoodCategories.container"
                    style={styles.filtersList}
                >
                    <View style={styles.filter}>
                        <TouchableOpacity style={styles.filterBtn} onPress={() => openModal()}>
                            <Image
                                source={require('../../assets/Filter.png')}
                                style={{
                                    resizeMode: 'cover',
                                    width: 16,
                                    height: 14,
                                }} />
                        </TouchableOpacity>
                    </View>
                    {filters.map(item => {
                        return renderFilter(item)
                    })}
                </ScrollView>
            </View>
            <PostsFilters
                ref={modalRef}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                setCategories={setCategories}
                diet={diet}
                setDiet={setDiet}
                logistics={prefLogistics}
                setLogistics={setPrefLogistics}
                distance={distance}
                setDistance={setDistance}
                updater={updater}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
            />
            {showRequests &&
                <FeedPostRenderer
                    type={"r"}
                    navigation={navigation}
                    setShowRequests={setShowRequests}
                    sortBy={sortBy}
                    categories={categories}
                    diet={diet}
                    logistics={logistics}
                    accessNeeds={accessNeeds}
                    setUpdater={setUpdater}
                />}
            {!showRequests &&
                <FeedPostRenderer
                    type={"o"}
                    navigation={navigation}
                    setShowRequests={setShowRequests}
                    sortBy={sortBy}
                    categories={categories}
                    diet={diet}
                    logistics={logistics}
                    accessNeeds={accessNeeds}
                    setUpdater={setUpdater}
                />}
        </View>
    )
}

export default HomeScreen
