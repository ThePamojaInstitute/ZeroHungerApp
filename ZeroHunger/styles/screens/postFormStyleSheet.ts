import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

export default StyleSheet.create({
    formContainer: {
        flex: 1,
        padding: 10,
        // marginTop: 20,
        backgroundColor: Colors.Background

    },
    formTitleText: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        color: Colors.dark,
        marginBottom: 3
    },
    formDescText: {
        marginBottom: 5,
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: '#656565'
    },
    formDescInputView: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        width: "100%",
        height: 120,
        marginBottom: 25,
        marginTop: 10,
    },
    formInputText: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        fontSize: 16,
        textAlignVertical: "top",
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
    },
    formCancelBtn: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: '#656565'
    },
    formLabel: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        color: Colors.dark
    },
    formInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        height: 40,
        marginBottom: 10,
        marginTop: 5,
    },
    formInput: {
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
    formErrorMsg: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
        marginBottom: 10
    },
})