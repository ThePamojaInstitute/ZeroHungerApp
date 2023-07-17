import { StyleSheet } from "react-native";

export default StyleSheet.create({
    drawerContainer: {
        flexDirection: "row",
        marginTop: 12,
        marginLeft: 12,
        marginRight: 8,
        marginBottom: 32,
        justifyContent: "space-between"
    },
    logOutBtn: {
        width: "50%",
        borderRadius: 25,
        marginTop: 10,
        height: 50,
        alignItems: "center",
        backgroundColor: "#6A6A6A",
        marginRight: 10,
        marginLeft: 12
    },
    logOutBtnText: {
        color: "#FFFFFF",
        padding: 15,
        marginLeft: 10,
        fontSize: 15,
    },
})