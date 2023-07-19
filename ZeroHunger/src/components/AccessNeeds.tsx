import { MaterialIcons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import { globalStyles } from "../../styles/globalStyleSheet"
import { accessNeedsPreferences } from "../controllers/post"


const AccessNeeds = ({ accessNeeds, setAccessNeeds }) => {
    return (
        <View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                <MaterialIcons
                    name={accessNeeds === accessNeedsPreferences.NONE ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(accessNeedsPreferences.NONE)}
                    style={{ marginRight: 7 }}
                />
                <Text style={[globalStyles.Body,]}>No access needs</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 5 }}>
                <MaterialIcons
                    name={accessNeeds === accessNeedsPreferences.WHEELCHAIR ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(accessNeedsPreferences.WHEELCHAIR)}
                    style={{ marginRight: 7 }}
                />
                <Text style={[globalStyles.Body, { flex: 1 }]}>Pick up location must be wheelchair accessible</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 10 }}>
                <MaterialIcons
                    name={accessNeeds === accessNeedsPreferences.DELIVERY ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color="black"
                    onPress={() => setAccessNeeds(accessNeedsPreferences.DELIVERY)}
                    style={{ marginRight: 7 }}
                />
                <Text style={globalStyles.Body}>Delivery only</Text>
            </View>
        </View >
    )
}

export default AccessNeeds
