import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 4,
        paddingLeft: 16,
        backgroundColor: Colors.offWhite,
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
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        color: Colors.dark,
    },
    filtersList: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 5,
        paddingLeft: 20,
        backgroundColor: Colors.offWhite
    }
})