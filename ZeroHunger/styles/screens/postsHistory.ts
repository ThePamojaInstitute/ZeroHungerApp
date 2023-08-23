import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, Fonts } from "../globalStyleSheet";

const screenWidth = Dimensions.get('window').width
const modalWidth = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center'
    },
    modalItemBorder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#D1D1D1',
        paddingBottom: 10
    },
    fulfillment: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginRight: 5
    },
    sort: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sortText: {
        color: Colors.primaryDark,
        fontFamily: Fonts.PublicSans_SemiBold,
        fontWeight: '600',
        fontSize: 13
    },
    modal: {
        margin: 0,
        backgroundColor: Colors.offWhite,
        elevation: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: Dimensions.get('window').height * 0.825
    },
    modalAlignWidth: Platform.OS === 'web' ? {
        alignSelf: 'center',
        width: modalWidth,
        margin: 0
    } : { margin: 0 },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    modalClose: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 10
    },
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
    },
    containerAlignWidth: {
        maxWidth: 700,
        marginHorizontal: 'auto',
        width: '100%'
    },
    webContainer: {
        flexDirection: 'row',
        maxWidth: 700,
        marginHorizontal: 'auto',
        width: '100%',
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 4,
        paddingLeft: 16,
        backgroundColor: Colors.offWhite
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
    sortContainer: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 7.5,
        alignItems: 'center',
        backgroundColor: Colors.offWhite
    }
})