import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const dim = Dimensions.get('window')

export default StyleSheet.create({


    view: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        // backgroundColor: Colors.offWhite
    },
    image: {
        // flex: 1,
        height: dim.height / 2,
        width: dim.width / 2,
        // marginBottom: 48
    },
    dots: {
        paddingBottom: dim.height * 0.25
    },
    text: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: Colors.dark,
        paddingBottom: 12,
        textAlign: "center",
        textAlignVertical: "center",
        marginLeft: 48,
        marginRight: 48
    },
    backButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        paddingLeft: dim.width * 0.2,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    nextButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        paddingRight: dim.width * 0.2,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    continueButton: {
        paddingRight: dim.width * 0.175,
        paddingBottom: (dim.height * 0.2) + 18
    }
})