import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    chatBar: {
        backgroundColor: '#f8f9fb',
        borderColor: '#eff1f7',
        borderTopWidth: 1,
        height: 69,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100
    },
    chatInputContainer: {
        width: '85%',
        marginLeft: 15,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
    },
    chatInput: {
        paddingLeft: 10,
        paddingRight: -20,
        paddingVertical: 6.5,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 15,
        maxHeight: 70,
        width: '93%'
    },
    chatCameraIcon: {
        marginBottom: 11,
        marginLeft: 5,
    },
    chatSendIcon: {
        right: 0,
        position: 'absolute',
        marginRight: 5,
        marginTop: 4.5,
        top: 0,
        bottom: 0
    },
    postMsgCont: {
        flexDirection: 'row',
        marginVertical: -11
    },
    postMsgSubCont: {
        marginVertical: 10,
        marginRight: 65,
        marginLeft: 5
    },
    postMsgImg: {
        height: 90,
        width: 90,
        resizeMode: 'cover',
        marginLeft: -10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 5
    },
    postMsgTitle: {
        color: Colors.dark,
        fontFamily: 'PublicSans_500Medium',
        fontSize: 15
    },
    postMsgNeedBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        marginTop: -3,
        marginBottom: -10
    },
    postMsgIn: {
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
    postMsgOut: {
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
    postMsgContainerIn: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    postMsgContainerOut: {
        marginTop: 1,
        marginBottom: 1,
        flexDirection: 'row-reverse',
    },
    postMsgLocation: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 12
    },
    noMsgs: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10
    },
})