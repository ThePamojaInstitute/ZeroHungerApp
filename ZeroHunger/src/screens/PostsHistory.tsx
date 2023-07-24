import { useEffect, useState } from "react";
import { Text, View, Pressable, TouchableOpacity, Dimensions } from "react-native"
import HistoryPostRenderer from "../components/HistoryPostRenderer";
import homeStyles from "../../styles/screens/homeStyleSheet"
import bottomTabStyles from "../../styles/components/bottomTabStyleSheet";
import styles from "../../styles/screens/postsHistory";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    useFonts,
    PublicSans_600SemiBold,
    PublicSans_500Medium,
    PublicSans_400Regular
} from '@expo-google-fonts/public-sans';
import Modal from 'react-native-modal';

export const PostsHistory = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false)
    let [fontsLoaded] = useFonts({
        PublicSans_400Regular,
        PublicSans_500Medium,
        PublicSans_600SemiBold
    })

    useEffect(() => {
        setLoaded(fontsLoaded)
    }, [fontsLoaded])

    const [showRequests, setShowRequests] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [orderByNewest, setOrderByNewest] = useState(true)

    const ModalComponent = () => (
        <View>
            <Modal
                testID="Bottom.postNavModal"
                isVisible={modalVisible}
                animationIn="slideInUp"
                backdropOpacity={0.5}
                onBackButtonPress={() => setModalVisible(!modalVisible)}
                onBackdropPress={() => setModalVisible(!modalVisible)}
                onSwipeComplete={() => setModalVisible(!modalVisible)}
                swipeDirection={['down']}
                style={[bottomTabStyles.modal,
                { marginTop: Dimensions.get('window').height * 0.78 }]}
            >
                <View style={{ marginBottom: 25 }}>
                    <View
                        testID="Bottom.postNavModalCont"
                        style={bottomTabStyles.modalContent}>
                        <Text
                            testID="Bottom.postNavModalLabel"
                            style={[globalStyles.H3, { alignSelf: 'center' }]}
                        >Sort</Text>
                    </View>
                    <TouchableOpacity
                        testID="Bottom.postNavModalClose"
                        style={bottomTabStyles.modalClose}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Ionicons name="close" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "flex-start", gap: 12 }}>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setModalVisible(false)
                            setOrderByNewest(true)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialIcons
                            name={`radio-button-${orderByNewest ? 'checked' : 'unchecked'}`}
                            size={24}
                            color={orderByNewest ? Colors.primaryDark : Colors.dark}
                            style={{ marginHorizontal: 10 }} />
                        <Text
                            style={[globalStyles.Body, { color: orderByNewest ? Colors.primaryDark : Colors.dark }]}
                        >Newest first</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setModalVisible(false)
                            setOrderByNewest(false)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialIcons
                            name={`radio-button-${orderByNewest ? 'unchecked' : 'checked'}`}
                            size={24}
                            color={orderByNewest ? Colors.dark : Colors.primaryDark}
                            style={{ marginHorizontal: 10 }} />
                        <Text
                            style={[globalStyles.Body, { color: orderByNewest ? Colors.dark : Colors.primaryDark }]}
                        >Oldest first</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )

    return (
        <View style={homeStyles.container}>
            {!loaded && <Text>Loading...</Text>}
            {loaded &&
                <>
                    <View testID="Home.subContainer" style={homeStyles.subContainer}>
                        <View testID="Home.requestsContainer" style={[
                            {
                                borderBottomColor: showRequests ?
                                    'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                            },
                            homeStyles.pressable
                        ]}>
                            <Pressable
                                style={homeStyles.pressableText}
                                onPress={() => setShowRequests(true)}
                                testID="Home.requestsBtn"
                            >
                                <Text testID="Home.requestsLabel" style={globalStyles.H3}>My Requests</Text>
                            </Pressable>
                        </View>
                        <View testID="Home.offersContainer" style={[
                            {
                                borderBottomColor: !showRequests ?
                                    'rgba(48, 103, 117, 100)' : 'rgba(48, 103, 117, 0)'
                            },
                            homeStyles.pressable
                        ]}>
                            <Pressable
                                style={homeStyles.pressableText}
                                onPress={() => setShowRequests(false)}
                                testID="Home.offersBtn"
                            >
                                <Text testID="Home.offersLabel" style={globalStyles.H3}>My Offers</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, alignItems: 'center' }}>
                        <Text style={globalStyles.Small1}>Sorted by: </Text>
                        <Pressable
                            onPress={() => setModalVisible(true)}
                            style={styles.sort}>
                            <Text
                                style={styles.sortText}
                            >{orderByNewest ? 'Newest first' : 'Oldest first'}</Text>
                            <Entypo name="chevron-down" size={18} color={Colors.primaryDark} />
                        </Pressable>
                    </View>
                    {showRequests &&
                        <HistoryPostRenderer
                            navigation={navigation}
                            type={"r"}
                            setShowRequests={setShowRequests}
                            orderByNewest={orderByNewest}
                        />}
                    {!showRequests &&
                        <HistoryPostRenderer
                            navigation={navigation}
                            type={"o"}
                            setShowRequests={setShowRequests}
                            orderByNewest={orderByNewest}

                        />}
                    <ModalComponent />
                </>
            }
        </View>
    )
}

export default PostsHistory
