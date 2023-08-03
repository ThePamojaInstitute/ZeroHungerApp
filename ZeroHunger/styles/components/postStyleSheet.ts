import { StyleSheet } from "react-native";
import { Colors } from "../globalStyleSheet";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 0,
        marginLeft: 12,
        marginRight: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: Colors.offWhite,
    },
    subContainer: {
        flex: 1,
        marginTop: 8,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 8,
        color: Colors.offWhite,
    },
    image: {
        width: 105,
        height: 106,
    },
    postEllipsis: {
        alignSelf: 'flex-end',
        marginRight: 2
    },
    locationCont: {
        flexDirection: 'row',
        marginTop: 4
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
    fulfillment: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginRight: 5
    },
})