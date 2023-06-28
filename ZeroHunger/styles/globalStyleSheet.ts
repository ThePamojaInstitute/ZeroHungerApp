import { StyleSheet } from "react-native";

export const Colors = {
    primary: '#306775',
    primaryMid: '#A4C2C9',
    primaryLight: '#D0DEE2',
    primaryLightest: '#E2E8E9',
    primaryDark: '#285662',
    Background: '#EFF1F7',
    offWhite: '#F8F9FC',
    white: '#FFFFFF',
    dark: '#000000',
    midDark: '#656565',
    mid: '#B8B8B8',
    midLight: '#D1D1D1',
    alert: '#F28B53',
    alert2: '#AD5444',
    accent1: '#CD874A',
    accent2: '#87597B',
    accent2a: '#AFAFD8',
    accent3: '#507AA2',
    accent4: '#868A3D',
    accent4a: '#536841',
    accent5: '#F0C72F',
    accent6: '#DBB364',
}

export const globalStyles = StyleSheet.create({
    defaultBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: "90%",
        gap: 10,
        position: 'relative',
        marginTop: 25,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primary,
    },
    defaultBtnLabel: {
        fontFamily: 'PublicSans_600SemiBold',
        fontStyle: 'normal',
        fontSize: 17,
        display: 'flex',
        alignItems: 'center',
        color: Colors.offWhite,
    },
    secondaryBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: "90%",
        gap: 10,
        position: 'relative',
        marginTop: 30,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.primaryMid,
    },
    secondaryBtnLabel: {
        fontFamily: 'PublicSans_600SemiBold',
        fontStyle: 'normal',
        fontSize: 17,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
    outlineBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: "90%",
        gap: 10,
        position: 'relative',
        marginTop: 30,
        height: 42,
        borderRadius: 100,
        backgroundColor: Colors.offWhite,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.primary
    },
    outlineBtnLabel: {
        fontFamily: 'PublicSans_600SemiBold',
        fontStyle: 'normal',
        fontSize: 17,
        display: 'flex',
        alignItems: 'center',
        color: Colors.primary,
    },
    navDefaultBtn: {
        justifyContent: 'center',
        alignItems: "center",
        gap: 10,
        borderRadius: 100,
        paddingVertical: 3.5,
        paddingHorizontal: 13,
        backgroundColor: Colors.primary,
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
        fontFamily: 'PublicSans_600SemiBold',
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
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        textDecorationLine: 'underline',
        color: Colors.dark,
        alignSelf: 'flex-end',
    },
    errorMsgContainer: {
        width: "90%",
        marginTop: -5,
        marginBottom: 5
    },
    errorMsg: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
    },
    authContainer: {
        backgroundColor: "#EFF1F7",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    termsAndCondContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        width: "90%",
        marginTop: 5,
    },
    termsAndCondText: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: '#656565'
    },
    termsAndCondAcceptText: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: Colors.dark,
        marginLeft: 5
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
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark
    },
    formContainer: {
        flex: 1,
        padding: 10,
        marginTop: 20,
        backgroundColor: Colors.Background
    },
    formTitleText: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 18,
        color: Colors.dark,
        marginBottom: 3
    },
    formDescText: {
        marginBottom: 5,
        fontFamily: 'PublicSans_400Regular',
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
        fontFamily: 'PublicSans_400Regular'
    },
    formCancelBtn: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: '#656565'
    },
    formLabel: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 18,
        color: Colors.dark
    },
    formInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 9,
        // width: "90%",
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
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        paddingLeft: 10
    },
    formErrorMsg: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.alert2,
        alignSelf: 'flex-start',
        marginBottom: 10
    },
    datePickerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        width: '38%',
        padding: 5,
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 10
    },
    datePickerImg: {
        marginLeft: -5,
        marginRight: 4,
        marginTop: 0,
        marginVertical: 2,
        width: '30%',
        height: '100%',
        resizeMode: 'contain'
    },
    datePickerDate: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: '#656565',
        marginTop: 2
    },
    H1: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 28,
        color: Colors.dark
    },
    H2: {
        fontFamily: 'PublicSans600_SemiBold',
        fontSize: 22,
        color: Colors.dark
    },
    H3: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 20,
        color: Colors.dark
    },
    H4: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 18,
        color: Colors.dark
    },
    H5: {
        fontFamily: 'PublicSans_600Medium',
        fontSize: 15,
        color: Colors.dark
    },
    Body: {
        fontFamily: 'PublicSans_600Regular',
        fontSize: 16,
        color: Colors.dark
    },
    Small1: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.dark
    }
})