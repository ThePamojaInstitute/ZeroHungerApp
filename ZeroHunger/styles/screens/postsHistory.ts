import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '99%',
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
    }
})