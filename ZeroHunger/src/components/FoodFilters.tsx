import { useState } from "react";
import { Text, TouchableOpacity, View, Image, Dimensions, Pressable } from "react-native";
import styles from "../../styles/components/FoodFiltersStyleSheet"
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { ScrollView } from "react-native-gesture-handler";
import Modal from 'react-native-modal';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const List = ({ state, setState, getType, list }) => {
    const renderItem = (
        item: number,
        state: number[],
        setState: React.Dispatch<React.SetStateAction<number[]>>,
        getter: (num: number) => string
    ) => {
        return (
            <View key={item} style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Pressable
                    onPress={() => {
                        if (state.includes(item)) {
                            setState(state.filter((num: number) => num != item))
                        } else {
                            setState((oldArray: number[]) => [...oldArray, item])
                        }
                    }}>
                    <MaterialCommunityIcons
                        name={state.includes(item) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={22}
                        style={{ position: 'absolute', left: 0 }}
                    />
                </Pressable>
                <Text style={[globalStyles.Body, { marginLeft: 30 }]}>{getter(item)}</Text>
            </View>
        )
    }

    return (
        <View style={styles.modalItemContainer}>
            <Pressable onPress={() => setState([])}>
                <Text style={globalStyles.Link}>Clear all</Text>
            </Pressable>
            {Object.keys(list).map(value => {
                return renderItem(list[value], state, setState, getType)
            })}
        </View>
    )
}

const FiltersModal = ({ modalVisible, handleModalClose, state, setState, foodType, getType, name }) => (
    <Modal
        testID="Bottom.postNavModal"
        isVisible={modalVisible}
        animationIn="slideInUp"
        backdropOpacity={0.5}
        onBackButtonPress={handleModalClose}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
        swipeDirection={['down']}
        style={styles.modal}
    >
        <View style={[styles.modalContainer,
        { maxHeight: Dimensions.get('window').height * 0.92 }]}>
            <View style={{ marginBottom: 25 }}>
                <View
                    testID="Bottom.postNavModalCont"
                    style={styles.modalContent}>
                    <Text
                        testID="Bottom.postNavModalLabel"
                        style={[globalStyles.H3, { alignSelf: 'center' }]}
                    >
                        {name === 'categories' ? 'Food category' : 'Dietary requirements'}
                    </Text>
                </View>
                <TouchableOpacity
                    testID="Bottom.postNavModalClose"
                    style={styles.modalClose}
                    onPress={handleModalClose}
                >
                    <Ionicons name="close" size={30} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <List state={state} setState={setState} getType={getType} list={foodType} />
            </ScrollView>
        </View>
    </Modal>
)

const FoodFilters = ({ state, setState, foodType, getType, name }) => {
    const [modalVisible, setModalVisible] = useState(false)

    const renderItem = (item: number, state: number[], setState: React.Dispatch<React.SetStateAction<number[]>>) => {
        return (
            <View key={item} style={styles.item}>
                <TouchableOpacity
                    style={[styles.secondaryBtn,
                    { backgroundColor: state.includes(item) ? Colors.primary : Colors.primaryLight }]}
                    onPress={() => {
                        if (state.includes(item)) {
                            setState(state.filter((num: number) => num != item))
                        } else {
                            setState((oldArray: number[]) => [...oldArray, item])
                        }
                    }}>
                    <Text style={[styles.secondaryBtnLabel,
                    { color: state.includes(item) ? Colors.offWhite : Colors.dark }]}
                    >{getType(item)}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            testID="FoodCategories.container"
            style={{ flexDirection: 'row' }}
        >
            <View style={styles.item}>
                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        source={require('../../assets/Filter.png')}
                        style={{
                            resizeMode: 'cover',
                            width: 16,
                            height: 14,
                        }} />
                </TouchableOpacity>
            </View>
            {Object.keys(foodType).map(value => {
                return renderItem(foodType[value], state, setState)
            })}
            <FiltersModal
                modalVisible={modalVisible}
                handleModalClose={() => setModalVisible(false)}
                state={state}
                setState={setState}
                getType={getType}
                foodType={foodType}
                name={name}
            />
        </ScrollView>
    )
}

export default FoodFilters
