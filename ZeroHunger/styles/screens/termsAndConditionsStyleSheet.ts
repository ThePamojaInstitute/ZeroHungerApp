import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const dim = Dimensions.get('window')
const screenWidth = dim.width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    view: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        padding: 12,
        marginTop: 24,
        marginLeft: 12,
        marginRight: 12,
    },
    alignWidth: {
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    dots: {
        paddingBottom: dim.height * 0.3,
    },
    icon: {
        paddingRight: 12,
    },
    textView: {
        // flexDirection: "row",
        alignItems: 'flex-start',
        width: '100%',
        paddingTop: 24,
        padding: 12,
        paddingRight: 40
    },
    text: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: Colors.dark,
        paddingBottom: 6,
        paddingTop: 6,
    },
    backButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        // paddingLeft: width * 0.15,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark,

    },
    nextButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        // paddingRight: width * 0.15,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    defaultBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: 150,
        gap: 10,
        position: 'relative',
        marginTop: 25,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primary,
        marginBottom: (dim.height * 0.23)
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
    termsAndCondContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        width: "90%",
        marginTop: "50%",
    },
    termsAndCondText: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: '#656565'
    },
    termsAndCondAcceptText: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: Colors.dark,
        marginLeft: 5
    },
    inputLabel: {
        width: '100%',
        height: 19,
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        color: '#000000',
        alignItems: 'center',
    },
})