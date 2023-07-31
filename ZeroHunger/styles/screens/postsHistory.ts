import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center'
    },
    modalItemBorder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#D1D1D1',
        paddingBottom: 10
    },
    fulfillment: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginRight: 5
    },
    sort: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sortText: {
        color: Colors.primaryDark,
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 13
    },
    modal: {
        margin: 0,
        backgroundColor: Colors.offWhite,
        borderRadius: 10,
        elevation: 0,
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
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    subContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginRight: 16,
        marginBottom: 4,
        marginLeft: 16
    },
    pressable: {
        flexDirection: 'row',
        marginLeft: 4,
        marginRight: 25,
        borderBottomWidth: 4,
    },
    pressableText: {
        fontSize: 30,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
})