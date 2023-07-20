import { MaterialCommunityIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import { globalStyles } from "../../styles/globalStyleSheet"
import { logisticsPreferences } from "../controllers/post"
import styles from "../../styles/components/accessNeedsStyleSheet"


const Logistics = ({ logistics, setLogistics }) => {
    return (
        <View style={styles.container}>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(logisticsPreferences.PICKUP) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(logisticsPreferences.PICKUP)) {
                            setLogistics(logistics.filter((num: number) => num != logisticsPreferences.PICKUP))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, logisticsPreferences.PICKUP])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Pick up</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(logisticsPreferences.DELIVERY) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(logisticsPreferences.DELIVERY)) {
                            setLogistics(logistics.filter((num: number) => num != logisticsPreferences.DELIVERY))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, logisticsPreferences.DELIVERY])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Delivery</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(logisticsPreferences.PUBLIC) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(logisticsPreferences.PUBLIC)) {
                            setLogistics(logistics.filter((num: number) => num != logisticsPreferences.PUBLIC))
                        } else {
                            setLogistics((oldArray: number[]) => [...oldArray, logisticsPreferences.PUBLIC])
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
