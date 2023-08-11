import { Text, TouchableOpacity, View, Image } from "react-native";
import styles from "../../styles/components/FoodFiltersStyleSheet"
import { Colors } from "../../styles/globalStyleSheet";
import { ScrollView } from "react-native-gesture-handler";

const FoodFilters = ({ state, setState, foodType, getType }) => {
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
                <TouchableOpacity style={styles.secondaryBtn}>
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
        </ScrollView>
    )
}

export default FoodFilters
