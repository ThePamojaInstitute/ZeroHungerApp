import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "../globalStyleSheet";


const screenWidth = Dimensions.get('window').width
const modalWidth = screenWidth > 700 ? 700 : screenWidth

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalViewRow: {
        margin: 5,
        padding: 5,
       justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
        elevation: 5,
      },
      modalViewColumn: {
        margin: 5,
        padding: 5,
       justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column',
        elevation: 5,
      },
      modalView: {
        margin: 5,
        flexWrap:'wrap',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
})