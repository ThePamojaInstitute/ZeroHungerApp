import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

export default StyleSheet.create({
    datePickerContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        width: '38%',
        padding: 5,
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 10
    },
    datePickerImg: {
        marginLeft: -5,
        marginRight: 4,
        marginTop: 0,
        marginVertical: 2,
        width: '30%',
        height: '100%',
        resizeMode: 'contain'
    },
    datePickerDate: {
        fontFamily: Fonts.PublicSans_Regular,
        fontWeight: '400',
        fontSize: 13,
        color: '#656565',
        marginTop: 2
    },
})