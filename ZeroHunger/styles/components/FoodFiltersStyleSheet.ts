import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const modalWidth = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    item: {
        backgroundColor: Colors.Background,
        marginTop: 5,
        marginBottom: 15,
        marginRight: 8,
        borderRadius: 10,
    },
    secondaryBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        gap: 10,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: Colors.primaryLight,
    },
    secondaryBtnLabel: {
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
    modal: Platform.OS === 'web' ? {
        alignSelf: 'center',
        width: modalWidth,
        margin: 0
    } : { margin: 0 },
    modalContainer: {
        backgroundColor: Colors.offWhite,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        paddingVertical: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    modalClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 10
    },
    modalItemContainer: {
        alignItems: "flex-start",
        gap: 12,
        marginTop: 10,
        marginLeft: 13
    },
})