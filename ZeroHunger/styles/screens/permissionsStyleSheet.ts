import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";

const dim = Dimensions.get('window')
const screenWidth = dim.width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    view: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        // marginTop: 24,
        backgroundColor: Colors.offWhite,
        marginLeft: 48,
        marginRight: 48
    },
    view2: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginTop: 24,
        backgroundColor: Colors.offWhite,
        marginLeft: 48,
        marginRight: 48
    },
    alignWidth: {
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    image: {
        height: dim.height * 0.3,
        width: width * 0.6,
    },
    image2: {
        marginTop: 30,
        marginBottom: 50,
        height: dim.height * 0.2,
        width: width * 0.4,
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