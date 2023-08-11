import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const dim = Dimensions.get('window')

export default StyleSheet.create({


    view: {
        flex: 1,
        alignContent: "center",
        // justifyContent: "center",
        alignItems: "center",
        // padding: 24,
        // backgroundColor: Colors.offWhite
    },
    image: {
        flex: 1,
        // height: dim.height / 2,
        // width: dim.width / 2,
        height: '80%',
        width: '80%',
        // marginTop: 24,
        // paddingBottom: '15%',
    }, 
    dots: {
        paddingBottom: dim.height * 0.25
    },
    title: {
        paddingBottom: 12,
        paddingTop: 48,
    },
    text: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: Colors.dark,
        paddingBottom: 12,
        textAlign: "center",
        textAlignVertical: "center",
        marginLeft: 40,
        marginRight: 40
    },
    backButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        paddingLeft: dim.width * 0.15,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    nextButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        paddingRight: dim.width * 0.15,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    continueButton: {
        // padding: 12,
        marginRight: dim.width * 0.1,
        marginBottom: (dim.height * 0.2) + 18
    }
})