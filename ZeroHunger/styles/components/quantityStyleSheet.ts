import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 15
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 25,
        backgroundColor: Colors.primaryLight,
    },
    buttonText: {
        color: Colors.dark,
        fontWeight: '300',
        fontSize: 30,
    },
    input: {
        padding: 9.2,
        marginLeft: 10,
        fontSize: 15,
        width: 35,
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginTop: 5,
        marginHorizontal: 4,
        borderRadius: 10,
    },
    itemPressed: {
        backgroundColor: '#000000',
        padding: 10,
        marginVertical: 15,
        marginHorizontal: 4,
        borderRadius: 4,
    },
    picker: {
        marginLeft: 40,
        height: 0,
        width: '45%',
        borderRadius: 10,
        borderColor: '#D1D1D1'
    },
    arrowIconContainer: {
        backgroundColor: Colors.primaryLight,
        paddingVertical: 15,
        marginRight: -10,
        borderTopRightRadius: 10,
        paddingHorizontal: 8
    }
})