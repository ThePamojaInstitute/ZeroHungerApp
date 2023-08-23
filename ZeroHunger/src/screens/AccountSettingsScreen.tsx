import { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from "react-native";
import styles from "../../styles/screens/accountSettingsStyleSheet"
import { AuthContext } from "../context/AuthContext";
import { logOutUser, deleteUser, getAccount } from "../controllers/auth";
import { useAlert } from "../context/Alert";
import { editUser } from "../controllers/auth";
import { Colors, globalStyles } from "../../styles/globalStyleSheet";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { AccountSettingsFormData } from "../../types";
import { passwordResetURL } from "../../config";
import Alert from 'react-native-awesome-alerts';
import { AccSettingsFormCustomHeader } from "../components/headers/AccSettingsCustomHeader";


export const AccountSettingsScreen = ({ navigation }) => {
  const { dispatch } = useContext(AuthContext);
  const { dispatch: alert } = useAlert()
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<AccountSettingsFormData>();

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (Platform.OS === 'web') {
      navigation.setOptions({
        header: () => (
          <AccSettingsFormCustomHeader
            navigation={navigation}
            title={'Account Settings'}
            handleModifyUser={handleModifyUser}
            handleSubmit={handleSubmit}
          />
        )
      })
    } else {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleSubmit(handleModifyUser)} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
            <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}>Save</Text>
          </TouchableOpacity>
        )
      })
    }

  }, [])

  const handleDeleteUser = async () => {
    const res = await deleteUser()
    if (res === "success") {
      logOutUser().then(() => {
        dispatch({ type: "LOGOUT", payload: null })
        alert!({ type: 'open', message: 'Account deleted successfully!', alertType: 'success' })
        navigation.navigate('LoginScreen')
      }).catch(err => {
        alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
        console.log(err);
      })
    } else {
      alert!({ type: 'open', message: 'An error occured', alertType: 'error' })
      console.log(res);
    }
  }

  const handleModifyUser = async (data: object) => {
    const editedUser = {
      "username": data['username'].toLowerCase(),
      "email": data['email'].toLowerCase(),
    }

    const res = await editUser(editedUser)
    if (res.msg === "success") {
      alert!({ type: 'open', message: 'Account modified successfully!', alertType: 'success' })
      navigation.navigate('LoginScreen')
    } else {
      if (!res.res.includes("username") && !res.res.includes("email")) {
        alert!({ type: 'open', message: 'An error occured!', alertType: 'error' })
      }

      if (res.res.includes("username")) {
        setError('username', {
          type: "server",
          message: "Username is taken"
        })
      }
      if (res.res.includes("email")) {
        setError('email', {
          type: "server",
          message: "There is already an account associated with this email"
        })
      }
    }
  }

  const handlePasswordReset = () => {
    Linking.canOpenURL(passwordResetURL).then(supported => {
      if (supported) {
        Linking.openURL(passwordResetURL);
      } else {
        console.log(`Cannot open URL: ${passwordResetURL}`);
      }
    })  //replace this with actual URL later
  }

  useEffect(() => {
    getAccount().then(data => {
      setUsername(data['username'])
      setEmail(data['email'])
    })
  }, [])

  useEffect(() => {
    if (username) {
      setValue("username", username)
    }

    if (email) {
      setValue("email", email)
    }
  }, [username, email])

  return (
    <View style={{ backgroundColor: Colors.offWhite, height: '100%' }}>
      <View style={[styles.container, Platform.OS === 'web' ? styles.alignWidth : {}]}>
        <View testID="SignUp.usernameInputContainer" style={[styles.inputContainer, { width: '95%' }]}>
          <Text testID="SignUp.usernameLabel" style={[styles.inputLabel,
          { color: errors.username ? Colors.alert2 : Colors.dark }]}
          >Username</Text>
          <Controller
            defaultValue=""
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: "Username length should be at least 5 characters"
              },
              maxLength: {
                value: 50,
                message: "Username length should be at most 50 characters"
              },
              pattern: {
                value: /^(?!.*__).*$/,
                message: "Username shouldn't include \"__\""
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                placeholder="myusername"
                nativeID="SignUp.usernameInput"
                testID="SignUp.usernameInput"
                style={[styles.input,
                { borderColor: errors.username ? Colors.alert2 : Colors.midLight }]}
                onChangeText={onChange}
                onChange={onChange}
                blurOnSubmit={false}
                maxLength={50}
                onBlur={onBlur}
              />
            )}
            name="username"
          />
        </View>
        {errors.username &&
          <View testID="SignUp.usernameErrMsgContainer" style={styles.errorMsgContainer}>
            <Text testID="SignUp.usernameErrMsg" style={styles.errorMsg}>{errors.username.message}</Text>
          </View>}
        <View testID="SignUp.emailInputContainer" style={[styles.inputContainer, { width: '95%' }]}>
          <Text testID="SignUp.emailLabel" style={[styles.inputLabel,
          { color: errors.email ? Colors.alert2 : Colors.dark }]}
          >Email Address</Text>
          <Controller
            defaultValue=""
            control={control}
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                placeholder="email@example.com"
                nativeID="SignUp.emailInput"
                testID="SignUp.emailInput"
                placeholderTextColor="#656565"
                style={[styles.input, { borderColor: errors.email ? Colors.alert2 : Colors.midLight }]}
                secureTextEntry={false}
                onChangeText={onChange}
                onChange={onChange}
                blurOnSubmit={false}
                onBlur={onBlur}
                maxLength={256}
              />
            )}
            name="email"
          />
        </View>
        {errors.email &&
          <View testID="SignUp.emailErrMsgContainer" style={styles.errorMsgContainer}>
            <Text testID="SignUp.emailErrMsg" style={styles.errorMsg}>{errors.email.message}</Text>
          </View>}
        <View style={{ width: '95%' }}>
          <TouchableOpacity
            testID="AccSett.deleteUserBtn"
            style={[globalStyles.defaultBtn, {
              width: '100%',
              alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
            }]}
            onPress={handlePasswordReset}
          >
            <Text
              testID="AccSett.deleteUserBtnText"
              style={globalStyles.defaultBtnLabel}
            >Reset Password</Text>
          </TouchableOpacity>
        </View>
        <View testID="SignUp.emailInputContainer" style={[styles.inputContainer, { width: '95%', marginTop: 20 }]}>
          <Text testID="SignUp.emailLabel" style={[styles.inputLabel,
          { color: errors.email ? Colors.alert2 : Colors.dark, marginBottom: 5 }]}
          >Delete account</Text>
          <View>
            <Text style={[globalStyles.Small1, { marginBottom: 10, color: Colors.primaryDark }]}>
              When you delete your account, all of your data, posts, and chat history will be permanently deleted as well.
            </Text>
            <Text
              style={[globalStyles.Small1, { marginBottom: 10, color: Colors.primaryDark }]}>
              Account deletion is irreversible. You cannot restore your account.
            </Text>
            <Text style={[globalStyles.Small1, { color: Colors.primaryDark }]}>
              Learn more about how we handle your data in our <Text
                style={{ textDecorationLine: 'underline' }}
                onPress={() => { /** TODO: navigate to privacy policy screen */ }}
              >privacy policy</Text>.</Text>
          </View>
          <TouchableOpacity
            testID="AccSett.deleteUserBtn"
            style={[globalStyles.secondaryBtn, {
              width: '100%',
              backgroundColor: Colors.alert2,
              alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
              marginTop: 10
            }]}
            onPress={() => { setShowAlert(true) }}
          >
            <Image source={require('../../assets/Delete.png')} style={{
              resizeMode: 'cover',
              width: 24,
              height: 24,
              position: 'absolute',
              left: 25
            }} />
            <Text
              testID="AccSett.deleteUserBtnText"
              style={globalStyles.defaultBtnLabel}
            >Delete my account</Text>
          </TouchableOpacity>
        </View>
        <Alert
          contentContainerStyle={{ borderRadius: 10 }}
          overlayStyle={Platform.OS === 'web' ? { maxWidth: 700 } : {}}
          show={showAlert}
          showProgress={false}
          title="Delete account"
          message="Are you sure you want to delete your account and all of your data?"
          closeOnTouchOutside={Platform.OS === 'web' ? false : true}
          closeOnHardwareBackPress={Platform.OS === 'web' ? false : true}
          showCancelButton={true}
          showConfirmButton={true}
          titleStyle={[globalStyles.H2, { alignSelf: 'flex-start', marginLeft: -15, paddingTop: -20 }]}
          messageStyle={[globalStyles.Body, { color: Colors.primaryDark, paddingBottom: -10 }]}
          cancelButtonStyle={{ backgroundColor: Colors.white, marginRight: 25 }}
          cancelButtonTextStyle={[globalStyles.Button, { color: Colors.primaryDark }]}
          cancelText="Cancel"
          confirmButtonStyle={[globalStyles.defaultBtn, { width: 120, height: 40, marginTop: 5, marginLeft: 25 }]}
          confirmButtonTextStyle={globalStyles.defaultBtnLabel}
          confirmText="Delete"
          confirmButtonColor={Colors.alert2}
          onCancelPressed={() => {
            setShowAlert(false)
          }}
          onConfirmPressed={handleDeleteUser}
          onDismiss={() => { setShowAlert(false) }}
        />
      </View>
    </View>
  )
}

export default AccountSettingsScreen
