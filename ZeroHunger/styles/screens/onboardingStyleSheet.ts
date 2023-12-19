import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const dim = Dimensions.get('window')
const screenWidth = dim.width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    container: {
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 10
    },
    view: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    image: {
        // flex: 1,
        // height: dim.height / 2,
        // width: dim.width / 2,
        height: '50%',
        width: '50%',
        // marginTop: 24,
        // paddingBottom: '15%',
    }, 
    dots: {
        paddingBottom: dim.height * 0.3
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
        paddingLeft: dim.width * 0.35,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    nextButton: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        paddingRight: dim.width * 0.35,
        paddingBottom: dim.height * 0.2,
        color: Colors.primaryDark
    },
    continueButton: {
        // padding: 12,
        marginRight: dim.width * 0.33,
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