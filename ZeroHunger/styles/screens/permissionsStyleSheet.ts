import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";

const dim = Dimensions.get('window')

export default StyleSheet.create({
    view: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginTop: 24,
        backgroundColor: Colors.Background
    },
    image: {
        height: dim.height * 0.4,
        width: dim.width * 0.75,
        
    },
    title: {
        paddingTop: 50,
        paddingBottom: 24,
        textAlign: "center",
        paddingLeft: 24,
        paddingRight: 24
    },
    body: {
        textAlign: "center",
        paddingLeft: 24,
        paddingRight: 24,
    },
})