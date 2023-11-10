import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        alignItems: "flex-start",
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 10
    },
    alignWidth: {
        maxWidth: 700,
        alignSelf: 'center',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        width: "90%",
        height: 68,
        marginBottom: 10,
        marginTop: 5,
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
    input: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: 10,
        gap: 10,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderRadius: 10,
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        paddingLeft: 10
    },
    errorMsg: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
    },
    errorMsgContainer: {
        width: "90%",
        marginTop: -5,
        marginBottom: 5
    },
})