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

export const Fonts = {
    PublicSans_Regular: 'PublicSans_Regular',
    PublicSans_Medium: 'PublicSans_Medium',
    PublicSans_SemiBold: 'PublicSans_SemiBold',
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
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
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
        backgroundColor: Colors.primaryLight,
    },
    secondaryBtnLabel: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
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
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
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
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 28,
        color: Colors.dark
    },
    H2: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 22,
        color: Colors.dark
    },
    H3: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 20,
        color: Colors.dark
    },
    H4: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 18,
        color: Colors.dark
    },
    H5: {
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 15,
        color: Colors.dark
    },
    Body: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: Colors.dark
    },
    Small1: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: Colors.dark
    },
    Small2: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 11,
        color: Colors.dark
    },
    Button: {
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 17,
        color: Colors.dark
    },
    Tag: {
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 12,
        color: Colors.dark
    },
    Link: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 18,
        textDecorationLine: 'underline',
        color: Colors.dark,
    },
})