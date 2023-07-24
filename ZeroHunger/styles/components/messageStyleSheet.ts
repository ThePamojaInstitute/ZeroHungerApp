import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    containerIn: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    containerOut: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse',
    },
    msgIn: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primaryLightest,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginleft: 20,
        marginBottom: 20
    },
    msgOut: {
        position: 'relative',
        left: 0,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'flex-start',
        gap: 4,
        overflow: 'hidden',
        padding: 10,
        minWidth: '5%',
        maxWidth: '75%',
        marginRight: 20,
        marginBottom: 20
    },
    subCont: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    messageText: {
        fontSize: 15,
        fontFamily: 'PublicSans_400Regular',
        color: Colors.white,
        marginBottom: 15,
        marginRight: 35,
        alignItems: 'flex-start',
        left: 0
    },
    timestamp: {
        right: 0,
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
        fontSize: 11,
        fontFamily: 'PublicSans_400Regular',
        color: Colors.white,
        lineHeight: 13.2,
    }
});