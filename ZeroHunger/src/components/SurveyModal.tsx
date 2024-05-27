import React, { forwardRef, useContext, useEffect, useRef, useState, useReducer, useImperativeHandle } from "react";
import {
    Text,
    View,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    ActivityIndicator,
    Modal,
    Alert,
    StyleSheet,
    Dimensions
} from "react-native";
import stylesHome from "../../styles/screens/homeStyleSheet"
import surveyModalStyleSheet from "../../styles/components/surveyModalStyleSheet";
import stylesModal from "../../styles/components/myPostModalStyleSheet"
import { globalStyles } from "../../styles/globalStyleSheet";
import { Button } from "react-native-paper";
import { Switch } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { axiosInstance } from "../../config";

export const SurveyModal = ({}, ref: React.Ref<object>) => 
    {
        const [modalVisible, setModalVisible] = useState(false)
        const [didInteractOutsideApp, setInteractOutsideApp] = useState(false)
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState(null);
        const [items, setItems] = useState([
          {label: 'Apple', value: 'apple'},
          {label: 'Banana', value: 'banana'}
        ]);

     
      const submitSurvey = async (surveyData: 
      {
        stillInteractsOutsideApp: Boolean
        userID: Number
      }
      ) => 
      {
      try {  
        const res = await axiosInstance.post('/users/submitSurvey', surveyData);

        if (res.status === 201) {
          return { msg: "success", res: res.data }
      } else {
          return { msg: "failure", res: res.data }
      }
    
  } catch (error) {
      if (error.response.data === 'invalid postal code') {
          return { msg: "Please enter a valid postal code", res: null }
      }
      return { msg: "failure", res: error }
  }
      }

      const openMe = () => setModalVisible(true)

      useImperativeHandle(ref, () => ({ publicHandler: openMe }), [openMe])

        return(

        <View style={surveyModalStyleSheet.centeredView}>    
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>

        <View style={surveyModalStyleSheet.centeredView}>
        <View style={surveyModalStyleSheet.modalView}>

            <Text  style={[globalStyles.H3, { alignSelf: 'center' }]}> 
            Help us improve our app by completing this optional survey.
            </Text>


                  <View style={surveyModalStyleSheet.modalViewRow}> 
                  <Text
                                testID="Bottom.postNavModalLabel"
                                style={[globalStyles.Body, { alignSelf: 'center' }]}>
                               Do you talk with someone you met on the app outside of the app?  
                            </Text>   
                  <Switch
                        testID="Bottom.postNavModalClose"
                        onValueChange={() => setInteractOutsideApp(!didInteractOutsideApp)}
                        value={didInteractOutsideApp}> 
                             
                    </Switch>  
                  </View>      

                  <View style={surveyModalStyleSheet.modalViewRow}> 
                  <Text
                                testID="Bottom.postNavModalLabel"
                                style={[globalStyles.Body, { alignSelf: 'center' }]}>
                               Example Other Question
                
                            </Text>   
               {/*  
                  <Switch
                        testID="Bottom.postNavModalClose"
                        onValueChange={() => setFirstAnswer(!firstSurveyOption)}
                        value={firstSurveyOption}>    
                    </Switch> 
                    
              */ } 
                  </View>      

                <View style={surveyModalStyleSheet.modalViewRow}> 

                <DropDownPicker 
                 open={open}
                 value={value}
                 items={items}
                 setOpen={setOpen}
                 setValue={setValue}
                 setItems={setItems}
                />

                
                
                </View>   


                <View style={surveyModalStyleSheet.modalViewRow}>          
                     <Pressable
                        testID="Bottom.postNavModalClose"
                         style={globalStyles.defaultBtn}
                        onPress={() => setModalVisible(!modalVisible)} > 
                             <Text
                                testID="Bottom.postNavModalLabel"
                                style={[globalStyles.H3, { alignSelf: 'center' }]}>Submit
                            </Text>
                    </Pressable>  
            

                    <Pressable
                        testID="Bottom.postNavModalClose"
                        style={globalStyles.defaultBtn}
                        onPress={() => setModalVisible(!modalVisible)} > 
                        <Text
                            testID="Bottom.postNavModalLabel"
                            style={[globalStyles.H3, { alignSelf: 'center' }]}>Skip Survey</Text>
                        </Pressable>   
                </View> 
            </View>
            </View>
            </Modal>
            </View>

        )
    }
export default SurveyModal