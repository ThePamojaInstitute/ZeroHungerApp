import { Platform, StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
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
    modalItemContainer: {
        alignItems: "flex-start",
        gap: 12,
        marginTop: 10,
        marginLeft: 13
    },
    modalItem: {
        alignItems: "flex-start",
        gap: 12,
        marginVertical: 5,
        marginLeft: 5,
        marginBottom: Platform.OS === 'web' ? 5 : -3
    },
    modalItemBorder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#D1D1D1',
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
    chevronIcon: {
        position: 'absolute',
        right: 0,
        paddingRight: 5
    },
    filtersSelected: {
        color: Colors.primaryDark,
        marginBottom: 5,
        marginLeft: 6
    },
    sortItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center'
    },
})