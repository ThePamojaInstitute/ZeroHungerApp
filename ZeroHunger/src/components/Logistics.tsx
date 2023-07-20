import { MaterialCommunityIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import { globalStyles } from "../../styles/globalStyleSheet"
import { LOGISTICSPREFERENCES } from "../controllers/post"
import styles from "../../styles/components/accessNeedsStyleSheet"


const Logistics = ({ logistics, setLogistics }) => {
    return (
        <View style={styles.container}>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(LOGISTICSPREFERENCES.PICKUP) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(LOGISTICSPREFERENCES.PICKUP)) {
                            setLogistics(logistics.filter((num: number) => num != LOGISTICSPREFERENCES.PICKUP))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.PICKUP])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Pick up</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(LOGISTICSPREFERENCES.DELIVERY) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(LOGISTICSPREFERENCES.DELIVERY)) {
                            setLogistics(logistics.filter((num: number) => num != LOGISTICSPREFERENCES.DELIVERY))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.DELIVERY])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Delivery</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(LOGISTICSPREFERENCES.PUBLIC) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(LOGISTICSPREFERENCES.PUBLIC)) {
                            setLogistics(logistics.filter((num: number) => num != LOGISTICSPREFERENCES.PUBLIC))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, LOGISTICSPREFERENCES.PUBLIC])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Meet at a public location</Text>
            </View>
        </View>
    )
}

export default Logistics
