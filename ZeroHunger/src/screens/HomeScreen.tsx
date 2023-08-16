import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    ActivityIndicator
} from "react-native";
import styles from "../../styles/screens/homeStyleSheet"
import { Colors, Fonts, globalStyles } from "../../styles/globalStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import FeedPostRenderer from "../components/FeedPostRenderer";
import { useTranslation } from "react-i18next";
import { default as _PostsFilters } from "../components/PostsFilters";
import { getPreferences } from "../controllers/preferences";
import { Char } from "../../types";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { axiosInstance, storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOutUser } from "../controllers/auth";
import { ENV } from "../../env";


const getItemFromLocalStorage = async (key: string) => {
    let item: string
    if (Platform.OS === 'web') {
        item = storage.getString(key)
    } else {
        item = await AsyncStorage.getItem(key)
    }
    return item
}

const setLocalStorageItem = async (key: string, value: string) => {
    if (ENV === 'production') {
        storage.set(key, value.toString())
    } else {
        if (Platform.OS === 'web') {
            storage.set(key, value.toString())
        } else {
            await AsyncStorage.setItem(key, value.toString())
        }
    }
    return
}

const PostsFilters = forwardRef(_PostsFilters)

export const HomeScreen = ({ navigation, route }) => {
    const modalRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
        setModalIsOpen(true)
    }

    const { user, dispatch } = useContext(AuthContext)
    const { setChatIsOpen } = useContext(NotificationContext);

    const [showRequests, setShowRequests] = useState(true)
    const [sortBy, setSortBy] = useState<'new' | 'old' | 'distance'>('new')
    const [categories, setCategories] = useState<Char[]>([])
    const [diet, setDiet] = useState<Char[]>([])
    const [logistics, setLogistics] = useState<Char[]>([])
    const [updater, setUpdater] = useState(() => () => { })
    const [showFilter, setShowFilter] = useState<'' | 'sort' | 'category' | 'diet' | 'logistics' | 'location'>('')
    const [distance, setDistance] = useState(15)
    const [expiringPosts, setExpiringPosts] = useState<object[]>()
    const [initialized, setInitialized] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    // on navigation change
    useFocusEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    })

    const handlelogOut = () => {
        logOutUser().then(() => {
            dispatch({ type: "LOGOUT", payload: null })
        }).then(() => {
            alert!({ type: 'open', message: 'Logged out successfully!', alertType: 'success' })
            navigation.navigate('LoginScreen')
        }).catch(() => {
            alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        })
    }

    const getNotifications = async () => {
        const allowExpiringPosts = ENV === 'production' ?
            storage.getString('allowExpiringPosts')
            : await getItemFromLocalStorage('allowExpiringPosts')

        if (allowExpiringPosts === undefined || allowExpiringPosts === 'false') return

        const lastSeen = ENV === 'production' ?
            storage.getString('lastSeen')
            : await getItemFromLocalStorage('lastSeen')
        if (lastSeen === new Date().toDateString()) return

        const accessToken = ENV === 'production' ?
            storage.getString('access_token')
            : await getItemFromLocalStorage('access_token')
        if (!accessToken) {
            handlelogOut()
            return
        }

        try {
            const res = await axiosInstance.get('/users/getNotifications', {
                headers: {
                    Authorization: accessToken
                }
            })

            if (res.status === 200) {
                setExpiringPosts(res.data)
            } else if (res.status === 204) {
                setLocalStorageItem('allowExpiringPosts', 'false')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const initializeFilters = async () => {
        try {
            const accessToken = ENV === 'production' ?
                storage.getString('access_token')
                : await getItemFromLocalStorage('access_token')

            if (!accessToken) {
                handlelogOut()
                return
            }

            const data = await getPreferences(accessToken)

            setDistance(data['distance'])
            setDiet(data['diet'])
            setLogistics(data['logistics'])
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

        initializeFilters().finally(() => setInitialized(true)).catch(err => {
            console.log(err);
            setInitialized(true)
        })
        getNotifications()

        setChatIsOpen(false)
    }, [])

    useEffect(() => {
        if (route.params?.reload) {
            setIsLoading(true)
            initializeFilters()

            route.params.reload = false
        }
    }, [route.params?.reload])

    useEffect(() => {
        if (modalIsOpen) return

        updater()
        setIsLoading(false)
    }, [distance, diet, logistics])

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
        `Delivery / Pick up${logistics.length > 0 ? ` (${logistics.length})` : ''}`,
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
            {initialized ?
                <>
                    <PostsFilters
                        ref={modalRef}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        categories={categories}
                        setCategories={setCategories}
                        diet={diet}
                        setDiet={setDiet}
                        logistics={logistics}
                        setLogistics={setLogistics}
                        distance={distance}
                        setDistance={setDistance}
                        updater={updater}
                        showFilter={showFilter}
                        setShowFilter={setShowFilter}
                        setModalIsOpen={setModalIsOpen}
                    />
                    {!isLoading ?
                        <>
                            {showRequests &&
                                <FeedPostRenderer
                                    type={"r"}
                                    navigation={navigation}
                                    setShowRequests={setShowRequests}
                                    sortBy={sortBy}
                                    categories={categories}
                                    diet={diet}
                                    logistics={logistics}
                                    distance={distance}
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
                                    distance={distance}
                                    setUpdater={setUpdater}
                                />}
                        </> :
                        <ActivityIndicator animating size="large" color={Colors.primary} />
                    }
                </> :
                <ActivityIndicator animating size="large" color={Colors.primary} />
            }
        </View>
    )
}

export default HomeScreen
