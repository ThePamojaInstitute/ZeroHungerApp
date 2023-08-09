import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.offWhite
    },
    inputText: {
        flex: 1,
        backgroundColor: Colors.white,
        marginLeft: 12,
        marginRight: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
    },
    sendMessage: {
        backgroundColor: Colors.Background,
        borderRadius: 10,
    },
    information: {
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight
    },
    subContainer: {
        flexDirection: "row",
        marginTop: 4,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    needBy: {
        backgroundColor: Colors.primaryLight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4
    },
    location: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 12
    },
    smallText: {
        color: Colors.midDark,
        marginBottom: 8
    },
    defaultBtn: {
        width: "40%",
        marginTop: 11,
        marginBottom: 16,
        marginRight: 11,
    },
    alertMsg: {
        marginLeft: 15,
        marginTop: 5,
        color: Colors.alert2
    },
    Tag: {
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 12,
        color: Colors.dark
    },
})