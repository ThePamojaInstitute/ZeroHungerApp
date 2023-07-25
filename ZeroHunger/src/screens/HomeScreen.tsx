import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    Pressable,
    Button,
} from "react-native";
import styles from "../../styles/screens/homeStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet"
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/Alert";
import { NotificationContext } from "../context/ChatNotificationContext";
import FeedPostRenderer from "../components/FeedPostRenderer";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import { default as _PostsFilters } from "../components/PostsFilters";
import { getPreferencesLogistics } from "../controllers/preferences";
import { Char } from "../../types";


const PostsFilters = forwardRef(_PostsFilters)

export const HomeScreen = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const modalRef = useRef(null)

    const openModal = () => {
        modalRef.current.publicHandler()
    }

    const { user } = useContext(AuthContext)
    const { unreadMessageCount, chatIsOpen, setChatIsOpen } = useContext(NotificationContext);
    const { dispatch: alert } = useAlert()

    const [showRequests, setShowRequests] = useState(true)
    const [sortBy, setSortBy] = useState<'new' | 'old' | 'distance'>('new')
    const [categories, setCategories] = useState<Char[]>([])
    const [diet, setDiet] = useState<Char[]>([])
    const [prefLogistics, setPrefLogistics] = useState<Char[]>([])
    const [logistics, setLogistics] = useState<Char[]>([])
    const [accessNeeds, setAccessNeeds] = useState<Char>()
    const [updater, setUpdater] = useState(() => () => { })

    // on navigation change
    useFocusEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    })

    // on mount
    useEffect(() => {
        if (!user) {
            navigation.navigate('LoginScreen')
        }
        setChatIsOpen(false)
    }, [])

    useEffect(() => {
        if (unreadMessageCount > 0 && !chatIsOpen) {
            alert!({
                type: 'open', message: `You have ${unreadMessageCount} new ${unreadMessageCount > 1
                    ? 'messages' : 'message'}`, alertType: 'info'
            })
        }
    }, [unreadMessageCount])

    useEffect(() => {
        setLogistics([])
        setAccessNeeds(null)
        getPreferencesLogistics(prefLogistics, setAccessNeeds, setLogistics)
    }, [prefLogistics])

    return (
        <View testID="Home.container" style={styles.container}>
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View testID="Home.categoriesContainer" style={styles.categoriesContainer}>
                        <Button title="filter" onPress={() => openModal()}></Button>
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
                            updater={updater}
                        />
                    </View>
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
                                <Text testID="Home.requestsLabel" style={globalStyles.H3}>Requests</Text>
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
                                <Text testID="Home.offersLabel" style={globalStyles.H3}>Offers</Text>
                            </Pressable>
                        </View>
                    </View>
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
                </>
            }
        </View>
    )
}

export default HomeScreen
