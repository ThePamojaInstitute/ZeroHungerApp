import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const dim = Dimensions.get('window')

export default StyleSheet.create({
    view: {
        flex: 1,
        alignContent: "center",
        // justifyContent: "center",
        alignItems: "center",
        padding: 12,
        marginTop: 24,
        marginLeft: 12,
        marginRight: 12,
    },
    dots: {
        paddingBottom: dim.height * 0.25
    },
    icon: {
        paddingRight: 12,
    },
    textView: {
        flexDirection: "row",
        paddingTop: 24,
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
        marginRight: dim.width * 0.09,
        marginBottom: (dim.height * 0.2) + 18
    },
    defaultBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        // width: "90%",
        paddingLeft: 6, 
        paddingRight: 6,
        gap: 10,
        position: 'relative',
        marginTop: 25,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primary,
    },
    defaultBtnLabel: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontStyle: 'normal',
        fontSize: 17,
        display: 'flex',
        alignItems: 'center',
        color: Colors.offWhite,
    },
})