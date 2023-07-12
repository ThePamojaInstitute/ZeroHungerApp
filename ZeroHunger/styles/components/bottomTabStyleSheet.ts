import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

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
    }
})