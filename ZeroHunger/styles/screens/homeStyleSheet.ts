import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
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
    categoriesContainer: {
        marginTop: 8,
        marginBottom: 4,
        marginHorizontal: 16
    },
    landingPageText: {
        marginTop: 10,
        marginLeft: 25,
        marginBottom: 60,
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
    filter: {
        backgroundColor: '#FFFFFF',
        marginTop: 5,
        marginRight: 8,
    },
    filterBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        gap: 10,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: Colors.primaryLight,
    },
    filterBtnLabel: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
})