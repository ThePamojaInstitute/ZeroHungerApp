import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    item: {
        backgroundColor: '#FFFFFF',
        marginTop: 5,
        marginBottom: 15,
        marginRight: 8,
        borderRadius: 10,
    },
    secondaryBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        gap: 10,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: Colors.primaryLight,
    },
    secondaryBtnLabel: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
})