import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const modalWidth = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    bottomBarText: {
        fontSize: 11,
        color: Colors.primary,
        marginBottom: 14,
        textAlign: "center"
    },
    bottomBarTab: {
        height: 69,
        backgroundColor: Colors.offWhite,
        borderTopWidth: 0,
        alignItems: 'center'
    },
    homeButton: {
        flex: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    postButton: {
        marginTop: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    messagesButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    modal: {
        margin: 0,
        backgroundColor: Colors.offWhite,
        elevation: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: Dimensions.get('window').height * 0.74
    },
    modalAlignWidth: Platform.OS === 'web' ? {
        alignSelf: 'center',
        width: modalWidth,
        margin: 0
    } : { margin: 0 },
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
    icon: {
        resizeMode: 'cover',
        width: 28,
        height: 28,
        marginBottom: -10
    },
    circle: {
        height: 15,
        minWidth: 15,
        backgroundColor: Colors.alert2,
        borderRadius: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 7,
        right: -7,
    },
    unreadCount: {
        color: Colors.white,
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 11,
        marginHorizontal: 4,
        // marginVertical: 1,
    },
    cancelBtn: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 16,
        color: '#656565'
    }
})