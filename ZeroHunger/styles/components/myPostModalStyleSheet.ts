import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const modalWidth = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: Colors.offWhite,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 0,
    },
    modalAlignWidth: Platform.OS === 'web' ? {
        alignSelf: 'center',
        width: modalWidth,
        margin: 0
    } : { margin: 0 },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 5,
        width: '99%',
    },
    modalItemBorder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#D1D1D1',
        paddingBottom: 10
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
    }
})