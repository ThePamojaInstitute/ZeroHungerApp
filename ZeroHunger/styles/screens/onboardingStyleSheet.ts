import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";

const dim = Dimensions.get('window')

export default StyleSheet.create({


    view: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        // flex: 3,
    },
    image: {
        height: dim.height / 2,
        width: dim.width / 2,
        marginBottom: 48
    },
})