import { useImperativeHandle, useState } from "react"
import { View, Dimensions, Text, TouchableOpacity } from "react-native"
import Modal from 'react-native-modal';
import bottomTabStyles from "../../styles/components/bottomTabStyleSheet";
import { globalStyles } from "../../styles/globalStyleSheet";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import historyStyles from "../../styles/screens/postsHistory";

export const MyPostModal = ({ selectedPost, handleDelete, handleMarkAsFulfilled }, ref: React.Ref<object>) => {
    const [modalVisible, setModalVisible] = useState(false)

    const openMe = () => setModalVisible(true)

    useImperativeHandle(ref, () => ({ publicHandler: openMe }), [openMe])

    return (
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
                        >Ticket options</Text>
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
                        style={[historyStyles.modalItem, historyStyles.modalItemBorder]}
                        onPress={() => {
                            handleMarkAsFulfilled(selectedPost.current)
                            setModalVisible(false)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={24} color="black"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={globalStyles.Body}>Mark as fulfilled</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={historyStyles.modalItem}
                        onPress={() => {
                            handleDelete(selectedPost.current)
                            setModalVisible(false)
                        }}
                        testID="Bottom.postNavModalReqBtn"
                    >
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color="black"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={globalStyles.Body}>Delete ticket</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default MyPostModal