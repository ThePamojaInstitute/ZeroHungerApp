import { MaterialIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import { globalStyles } from "../../styles/globalStyleSheet"
import { ACCESSNEEDSPREFERENCES } from "../controllers/post"
import styles from "../../styles/components/accessNeedsStyleSheet"


const AccessNeeds = ({ accessNeeds, setAccessNeeds }) => {
    return (
        <View style={styles.container}>
            <View style={styles.choiceContainer}>
                <MaterialIcons
                    name={accessNeeds === ACCESSNEEDSPREFERENCES.NONE ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(ACCESSNEEDSPREFERENCES.NONE)}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>No access needs</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialIcons
                    name={accessNeeds === ACCESSNEEDSPREFERENCES.WHEELCHAIR ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(ACCESSNEEDSPREFERENCES.WHEELCHAIR)}
                    style={styles.icon}
                />
                <Text style={[globalStyles.Body, { flex: 1 }]}>Pick up location must be wheelchair accessible</Text>
            </View>
            <View style={styles.choiceContainer}>
                <MaterialIcons
                    name={accessNeeds === ACCESSNEEDSPREFERENCES.DELIVERY ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(ACCESSNEEDSPREFERENCES.DELIVERY)}
                    style={styles.icon}
                />
                <Text style={globalStyles.Body}>Delivery only</Text>
            </View>
        </View >
    )
}

export default AccessNeeds
