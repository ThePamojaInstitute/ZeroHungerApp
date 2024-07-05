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
import { Colors, globalStyles } from "../../styles/globalStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/ChatNotificationContext";
import FeedPostRenderer from "../components/FeedPostRenderer";
import { useTranslation } from "react-i18next";
import { default as _PostsFilters } from "../components/PostsFilters";
import { getPreferences } from "../controllers/preferences";
import { Char } from "../../types";
import { Entypo } from "@expo/vector-icons";
import { axiosInstance, getItemFromLocalStorage, setLocalStorageItem, storage } from "../../config";
import { getNotifications, logOutUser } from "../controllers/auth";
import { ENV } from "../../env";
import { useAlert } from "../context/Alert";
import { HomeWebCustomHeader } from "../components/headers/HomeWebCustomHeader";
import { HomeCustomHeaderRight } from "../components/headers/HomeCustomHeaderRight";
import { Button, Searchbar } from "react-native-paper";
import {Alert, Modal} from 'react-native';
import SurveyModal, { default as _SurveyModal } from "../components/SurveyModal";


const ThisSurveyModal = forwardRef(_SurveyModal)
const PostsFilters = forwardRef(_PostsFilters)

export const HomeScreen = ({ navigation, route }) => {
    const modalRef = useRef(null)
    const surveyRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
       
    }

    const openSurvey = () => {
        surveyRef.current.publicHandler()
    }
    const { user, dispatch } = useContext(AuthContext)
    const { setChatIsOpen } = useContext(NotificationContext)
    const { dispatch: alert } = useAlert()

    const [showRequests, setShowRequests] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
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
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)


    // on navigation change
    useFocusEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    })

    const clearFilters = () => {
        setCategories([])
        setDiet([])
        setLogistics([])
        setDistance(30)
    }

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

    const handleGetNotifications = async () => {
        const allowExpiringPosts = ENV === 'production' ?
            storage.getString('allowExpiringPosts')
            : await getItemFromLocalStorage('allowExpiringPosts')

        if (allowExpiringPosts === undefined || allowExpiringPosts === 'false') return

        const lastSeen = ENV === 'production' ?
            storage.getString('lastSeen')
            : await getItemFromLocalStorage('lastSeen')
        if (lastSeen === new Date().toDateString()) return

        try {
            const res = await getNotifications('notifications')

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
            const data = await getPreferences()

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
        handleGetNotifications()

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
        if (Platform.OS === 'web') {
            navigation.setOptions({
                header: () => (
                    <HomeWebCustomHeader
                        navigation={navigation}
                        updater={updater}
                        expiringPosts={expiringPosts}
                        setExpiringPosts={setExpiringPosts}
                        setShowSearch={setShowSearch}
                        t={t}
                    />
                )
            })
        } else {
            navigation.setOptions({
                headerRight: () => (
                    <HomeCustomHeaderRight
                        navigation={navigation}
                        expiringPosts={expiringPosts}
                        setExpiringPosts={setExpiringPosts}
                    />
                )
            })
        }
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

    const onChangeSearch = query => setSearchQuery(query)

   

    const { t, i18n } = useTranslation();
    return (
        <View testID="Home.container" style={styles.container}>
            

           


            {/* <Pressable onPress={() => setShowSearch(!showSearch)}>
                <Text>Open search</Text>
            </Pressable> */}
            {showSearch ? 
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    onIconPress={() => updater()} //Search button
                    onSubmitEditing={() => updater()} //Enter button
                    style={styles.webContainer}
                />
                : <></>
            }
            <View testID="Home.subContainer" style={styles.subContainer}>
                <View style={Platform.OS === 'web' ? styles.webContainer : { flexDirection: 'row' }}>

                <Pressable 
                style={styles.pressableText} 
                onPress={() => openSurvey()}>  
                <Text style={globalStyles.H3}> {"Test Popup"} </Text> </Pressable>


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
            </View>
            <View style={{ backgroundColor: Colors.offWhite }}>
                <ThisSurveyModal ref = {surveyRef} />
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    testID="FoodCategories.container"
                    style={[styles.filtersList, Platform.OS === 'web' ? styles.webFiltersContainer : {}]}
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
                                    searchQuery={searchQuery}
                                    setUpdater={setUpdater}
                                    clearFilters={clearFilters}
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
                                    searchQuery={searchQuery}
                                    setUpdater={setUpdater}
                                    clearFilters={clearFilters}
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
