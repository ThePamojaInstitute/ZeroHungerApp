import { MaterialCommunityIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import { globalStyles } from "../../styles/globalStyleSheet"
import { LOGISTICSPREFERENCES } from "../controllers/post"
import styles from "../../styles/components/logisticsStyleSheet"
import { Char } from "../../types"


const Logistics = ({ logistics, setLogistics }) => {
    return (
        <View style={styles.container}>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(LOGISTICSPREFERENCES.PICKUP) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(LOGISTICSPREFERENCES.PICKUP)) {
                            setLogistics(logistics.filter((char: Char) => char != LOGISTICSPREFERENCES.PICKUP))
                        } else {
                            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.PICKUP])
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
                            setLogistics(logistics.filter((char: Char) => char != LOGISTICSPREFERENCES.DELIVERY))
                        } else {
                            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.DELIVERY])
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
                            setLogistics(logistics.filter((char: Char) => char != LOGISTICSPREFERENCES.PUBLIC))
                        } else {
                            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.PUBLIC])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Meet at a public location</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialCommunityIcons
                    name={logistics.includes(LOGISTICSPREFERENCES.WHEELCHAIR) ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={22}
                    onPress={() => {
                        if (logistics.includes(LOGISTICSPREFERENCES.WHEELCHAIR)) {
                            setLogistics(logistics.filter((char: Char) => char != LOGISTICSPREFERENCES.WHEELCHAIR))
                        } else {
                            setLogistics((oldArray: Char[]) => [...oldArray, LOGISTICSPREFERENCES.WHEELCHAIR])
                        }
                    }}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Location must be wheelchair accessible</Text>
            </View>
        </View>
    )
}

export default Logistics
