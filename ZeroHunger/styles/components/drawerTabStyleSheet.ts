import { StyleSheet } from "react-native";

export default StyleSheet.create({
    drawerContainer: {
        flexDirection: "row",
        marginTop: 12,
        marginLeft: 12,
        marginRight: 8,
        marginBottom: 5,
        justifyContent: "space-between"
    },
    Img: {
        resizeMode: 'cover',
        width: 24,
        height: 24,
        marginRight: -12
    },
    logOutBtn: {
        width: '85%',
        marginLeft: 20,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    }
})