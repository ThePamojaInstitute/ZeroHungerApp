import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const width = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    itemContainer: {
        maxWidth: 700,
        alignSelf: 'center',
        width: width
    },
    notification: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: Colors.midLight,
        paddingTop: 12,
    },
    time: {
        marginLeft: "auto",
        paddingTop: 4,
    },
    modal: {
        margin: 0,
        marginTop: Dimensions.get('window').height * 0.70,
        backgroundColor: Colors.offWhite,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 0,
    },
    modalAlignWidth: Platform.OS === 'web' ? {
        alignSelf: 'center',
        width: width,
        margin: 0
    } : { margin: 0 },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
        fontFamily: Fonts.PublicSans_Medium,
        fontWeight: '500',
        fontSize: 12,
        alignItems: 'center'
    },
    noNotifications: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10
    }
})
