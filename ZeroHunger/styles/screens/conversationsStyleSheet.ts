import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    conversation: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        padding: 12,
        position: 'relative',
        width: '95%'
    },
    info: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 1,
        gap: 12,
        position: 'relative',
        flexDirection: 'row'
    },
    profileImg: {
        resizeMode: 'cover',
        width: 48,
        height: 48,
        position: 'relative'
    },
    content: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 1,
        position: 'relative',
    },
    username: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 15,
        letterSpacing: 0,
        lineHeight: 18,
        marginTop: -1,
        position: 'relative',
        fontFamily: 'PublicSans_500Medium'
    },
    usernameUnread: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 15,
        letterSpacing: 0,
        lineHeight: 18,
        marginTop: -1,
        position: 'relative',
        fontFamily: 'PublicSans_600SemiBold'
    },
    lastMessage: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 13,
        letterSpacing: 0,
        lineHeight: 15.6,
        position: 'relative',
        fontFamily: 'PublicSans_400Regular'
    },
    lastMessageUnread: {
        alignSelf: 'stretch',
        color: Colors.dark,
        fontSize: 13,
        letterSpacing: 0,
        lineHeight: 15.6,
        position: 'relative',
        fontFamily: 'PublicSans_600SemiBold'
    },
    ellipseFrame: {
        alignItems: 'flex-start',
        display: 'flex',
        gap: 10,
        right: 0,
        top: 0,
        paddingVertical: 2,
        paddingHorizontal: 0,
        position: 'absolute',
    },
    ellipse: {
        backgroundColor: '#306775',
        borderRadius: 4,
        height: 8,
        minWidth: 8,
        position: 'relative',
        marginTop: 5,
        marginRight: 35
    },
    timestamp: {
        left: -15,
        top: 0,
        marginRight: 10,
        paddingVertical: 2,
        paddingHorizontal: 0,
        position: 'absolute',
        color: Colors.dark,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 13.2
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        width: "100%",
        height: 45,
        marginBottom: 10,
        marginTop: 5,
        paddingHorizontal: 10,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderRadius: 10,
        paddingLeft: 7,
    },
    searchInput: {
        backgroundColor: Colors.white,
        color: '#646464',
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        lineHeight: 20.8,
        width: '50%'
    },
    searchIcon: {
        paddingTop: 10,
        paddingRight: 5
    },
    noMsgs: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10
    }
})