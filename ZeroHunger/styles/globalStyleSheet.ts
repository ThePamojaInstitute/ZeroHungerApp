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
    H1: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 28,
        color: Colors.dark
    },
    H2: {
        fontFamily: 'PublicSans_600SemiBold',
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
        fontFamily: 'PublicSans_500Medium',
        fontSize: 15,
        color: Colors.dark
    },
    Body: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: Colors.dark
    },
    Small1: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13,
        color: Colors.dark
    },
    Small2: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 11,
        color: Colors.dark
    },
    Button: {
        fontFamily: 'PublicSans_600Semibold',
        fontSize: 17,
        color: Colors.dark
    },
    Tag: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 12,
        color: Colors.dark
    },
})