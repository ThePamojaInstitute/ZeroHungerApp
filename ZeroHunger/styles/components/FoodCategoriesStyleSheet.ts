import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#FFFFFF',
        marginTop: 5,
        marginBottom: 15,
        marginRight: 8,
        borderRadius: 10,
    },
    btn: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
    },
    btnPressed: {
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 10,
    },
    titleText: {
        flex: 1,
        fontSize: 24,
        marginBottom: 5,
        marginTop: 10,
    },
    descText: {
        flex: 1,
        fontSize: 14,
        marginBottom: 5,
        color: "#000000"
    },
    titleInputView: {
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginBottom: 25,
        marginTop: 10,
    },
    btnItem: {
        flexDirection: 'row',
    },
    halalBtn: {
        borderStyle: 'solid',
        borderColor: '#099999',
        borderWidth: 5,
        width: 40,
        height: 40,
        padding: 10,
        borderRadius: 20,
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