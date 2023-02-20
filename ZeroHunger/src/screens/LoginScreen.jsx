import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Context } from "../context/globalContext.js"


function Landing(props){

  const globalContext = useContext(Context);
  const { isLoggedIn, appSettings } = globalContext;

  return(
    <View >
      <Text >Hello User!</Text>
      <Text >You are {(isLoggedIn)? '' : "Not "}logged in</Text>
    </View>
  )



}

export default Landing;