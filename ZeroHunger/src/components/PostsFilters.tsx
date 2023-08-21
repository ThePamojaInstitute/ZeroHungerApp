import { useImperativeHandle, useState } from "react"
import { View, Dimensions, Text, TouchableOpacity, Pressable } from "react-native"
import Modal from 'react-native-modal';
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import styles from "../../styles/components/postsFiltersStyleSheet"
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DIETPREFERENCES, FOODCATEGORIES, getCategory, getDiet, handlePreferences } from "../controllers/post";
import { ScrollView } from "react-native-gesture-handler";
import { LOGISTICS, getLogisticsType } from "../controllers/preferences";
import Slider from '@react-native-community/slider';

const Sort = ({ sortBy, setSortBy }) => (
    <View style={styles.modalItemContainer}>
        <TouchableOpacity
            style={styles.sortItem}
            onPress={() => {
                setSortBy('new')
            }}
            testID="Bottom.postNavModalReqBtn"
        >
            <MaterialIcons
                name={`radio-button-${sortBy === 'new' ? 'checked' : 'unchecked'}`}
                size={24}
                color={sortBy === 'new' ? Colors.primaryDark : Colors.dark}
                style={{ marginRight: 10 }}
            />
            <Text
                style={[globalStyles.Body, { color: sortBy === 'new' ? Colors.primaryDark : Colors.dark }]}
            >Newest first</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.sortItem}
            onPress={() => {
                setSortBy('old')
            }}
            testID="Bottom.postNavModalReqBtn"
        >
            <MaterialIcons
                name={`radio-button-${sortBy === 'old' ? 'checked' : 'unchecked'}`}
                size={24}
                color={sortBy === 'old' ? Colors.primaryDark : Colors.dark}
                style={{ marginRight: 10 }}
            />
            <Text
                style={[globalStyles.Body, { color: sortBy === 'old' ? Colors.primaryDark : Colors.dark }]}
            >Oldest first</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.sortItem}
            onPress={() => {
                setSortBy('distance')
            }}
            testID="Bottom.postNavModalReqBtn"
        >
            <MaterialIcons
                name={`radio-button-${sortBy === 'distance' ? 'checked' : 'unchecked'}`}
                size={24}
                color={sortBy === 'distance' ? Colors.primaryDark : Colors.dark}
                style={{ marginRight: 10 }}
            />
            <Text
                style={[globalStyles.Body, { color: sortBy === 'distance' ? Colors.primaryDark : Colors.dark }]}
            >Distance</Text>
        </TouchableOpacity>
    </View>
)

const FoodCategory = ({ state, setState, getType, list }) => {
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

const Location = ({ state, setState }) => {
    return (
        <View style={styles.modalItemContainer}>
            <View>
                <Text style={globalStyles.H5}>Maximum distance away</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Slider
                        value={state}
                        onValueChange={setState}
                        style={{ width: Dimensions.get('window').width * 0.8, height: 40, maxWidth: 500 }}
                        minimumValue={1}
                        maximumValue={30}
                        step={1}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor="#B8B8B8"
                        thumbTintColor="#ffffff"
                    />
                    <Text style={[globalStyles.Body, { marginLeft: 5, marginTop: 8 }]}>{Math.round(state * 10) / 10} km</Text>
                </View>
            </View>
        </View>
    )
}

const PostsFilters = ({
    sortBy,
    setSortBy,
    categories,
    setCategories,
    diet,
    setDiet,
    logistics,
    setLogistics,
    distance,
    setDistance,
    updater,
    showFilter,
    setShowFilter,
    setModalIsOpen
}, ref: React.Ref<object>) => {
    const [modalVisible, setModalVisible] = useState(false)

    const openMe = () => setModalVisible(true)

    useImperativeHandle(ref, () => ({ publicHandler: openMe }), [openMe])

    const handleModalClose = () => {
        updater()
        setModalVisible(!modalVisible)
        setShowFilter('')
        setModalIsOpen(false)
    }

    return (
        <Modal
            testID="Bottom.postNavModal"
            isVisible={modalVisible}
            animationIn="slideInUp"
            backdropOpacity={0.5}
            onBackButtonPress={handleModalClose}
            onBackdropPress={handleModalClose}
            onSwipeComplete={handleModalClose}
            swipeDirection={['down']}
            style={{ margin: 0 }}
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
                        >Filter and sort</Text>
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
                    <View style={styles.modalItem}>
                        <View style={[styles.modalItemBorder, { width: '99%', alignSelf: 'center' }]}>
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (showFilter === 'sort') setShowFilter('')
                                    else setShowFilter('sort')
                                }}
                                testID="Bottom.postNavModalReqBtn"
                            >
                                <Text style={globalStyles.H4}>Sort</Text>
                                <Entypo
                                    name={`chevron-${showFilter === 'sort' ? 'up' : 'down'}`}
                                    size={24}
                                    color="black"
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {showFilter === 'sort' && <Sort sortBy={sortBy} setSortBy={setSortBy} />}
                    <View style={styles.modalItem}>
                        <View style={[styles.modalItemBorder, { width: '99%', alignSelf: 'center' }]}>
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (showFilter === 'category') setShowFilter('')
                                    else setShowFilter('category')
                                }}
                                testID="Bottom.postNavModalReqBtn"
                            >
                                <Text style={[globalStyles.H4, { marginTop: 5 }]}>Food category</Text>
                                <Entypo
                                    name={`chevron-${showFilter === 'category' ? 'up' : 'down'}`}
                                    size={24}
                                    color="black" style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                            {categories.length > 0 &&
                                <Text
                                    style={[globalStyles.Small1, styles.filtersSelected]}
                                >{handlePreferences(categories.sort().toString(), getCategory)}</Text>}
                        </View>
                    </View>
                    {showFilter === 'category' &&
                        <FoodCategory state={categories} setState={setCategories} getType={getCategory} list={FOODCATEGORIES} />}
                    <View style={styles.modalItem}>
                        <View style={[styles.modalItemBorder, { width: '99%', alignSelf: 'center' }]}>
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (showFilter === 'diet') setShowFilter('')
                                    else setShowFilter('diet')
                                }}
                                testID="Bottom.postNavModalReqBtn"
                            >
                                <Text style={[globalStyles.H4, { marginTop: 5 }]}>Dietary preferences</Text>
                                <Entypo
                                    name={`chevron-${showFilter === 'diet' ? 'up' : 'down'}`}
                                    size={24}
                                    color="black"
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                            {diet.length > 0 &&
                                <Text
                                    style={[globalStyles.Small1, styles.filtersSelected]}
                                >{handlePreferences(diet.sort().toString(), getDiet)}</Text>}
                        </View>
                    </View>
                    {showFilter === 'diet' &&
                        <FoodCategory state={diet} setState={setDiet} getType={getDiet} list={DIETPREFERENCES} />}
                    <View style={styles.modalItem}>
                        <View style={[styles.modalItemBorder, { width: '99%', alignSelf: 'center' }]}>
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (showFilter === 'location') setShowFilter('')
                                    else setShowFilter('location')
                                }}
                                testID="Bottom.postNavModalReqBtn"
                            >
                                <Text style={[globalStyles.H4, { marginTop: 5 }]}>Location</Text>
                                <Entypo
                                    name={`chevron-${showFilter === 'location' ? 'up' : 'down'}`}
                                    size={24}
                                    color="black"
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {showFilter === 'location' &&
                        <Location state={distance} setState={setDistance} />}
                    <View style={styles.modalItem}>
                        <View style={[styles.modalItemBorder, { width: '99%', alignSelf: 'center' }]}>
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (showFilter === 'logistics') setShowFilter('')
                                    else setShowFilter('logistics')
                                }}
                                testID="Bottom.postNavModalReqBtn"
                            >
                                <Text style={[globalStyles.H4, { marginTop: 5 }]}>Delivery / Pick up</Text>
                                <Entypo
                                    name={`chevron-${showFilter === 'logistics' ? 'up' : 'down'}`}
                                    size={24}
                                    color="black"
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                            {logistics.length > 0 &&
                                <Text
                                    style={[globalStyles.Small1, styles.filtersSelected]}
                                >{handlePreferences(logistics.sort().toString(), getLogisticsType)}</Text>}
                        </View>
                    </View>
                    {showFilter === 'logistics' &&
                        <FoodCategory state={logistics} setState={setLogistics} getType={getLogisticsType} list={LOGISTICS} />}
                </ScrollView>
            </View>
        </Modal>
    )
}

export default PostsFilters
