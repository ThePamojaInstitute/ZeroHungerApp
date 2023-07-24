import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    notification: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight,
        paddingTop: 12,
    },
    time: {
        marginLeft: "auto",
        paddingTop: 4,
    },
    modal: {
        margin: 0,
        marginTop: Dimensions.get('window').height * 0.70,
        backgroundColor: Colors.offWhite,
        borderRadius: 10,
        elevation: 0,
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    postTag: {
        borderRadius: 4,
        gap: 10,
        backgroundColor: Colors.primaryLightest,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 5,
        alignSelf: 'flex-end',
        marginBottom: 5,
    },
    postTagLabel: {
        color: Colors.dark,
        fontFamily: 'PublicSans_500Medium',
        fontSize: 12,
        alignItems: 'center'
    },
})
