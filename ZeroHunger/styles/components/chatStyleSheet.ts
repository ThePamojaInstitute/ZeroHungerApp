import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    chatBarContainer: {
        backgroundColor: '#f8f9fb',
        borderColor: '#eff1f7',
        borderTopWidth: 1,
        height: 69,
        position: 'relative',
    },
    chatBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 100,
    },
    chatBarAlignWidth: {
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    chatInputContainer: {
        width: '70%',
        marginLeft: 15,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    chatInput: {
        paddingLeft: 10,
        paddingRight: -20,
        paddingVertical: 6.5,
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 15,
        maxHeight: 70,
        width: '100%'
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
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 15
    },
    postMsgNeedBy: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: -15,
        marginLeft: 5,
        alignSelf: 'flex-start'
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
    sendBtn: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
        marginBottom: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.midLight,
        borderLeftWidth: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    }
})