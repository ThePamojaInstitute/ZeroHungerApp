import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    authContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    alignWidth: {
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    errorMsg: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        width: "90%",
        height: 68,
        marginBottom: 12,
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
    },
    errorMsgContainer: {
        width: "90%",
        marginTop: -5,
        marginBottom: 5
    },
    passwordInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderRadius: 10,
    },
    passwordInput: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: 10,
        gap: 10,
        backgroundColor: Colors.white,
        borderRadius: 10,
    },
    forgotPassword: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        textDecorationLine: 'underline',
        color: Colors.dark,
        alignSelf: 'flex-end',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        padding: 0,
        gap: 10,
        marginTop: 20,
        marginBottom: -10
    },
    dividerLine: {
        height: 1,
        flex: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#B8B8B8',
    },
    dividerText: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark
    },
    termsAndConditionsContainer: {
        alignContent: 'center',
        marginTop: '70%',
    },
})