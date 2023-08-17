import { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(handleModifyUser)} testID="Request.createBtn" style={globalStyles.navDefaultBtn}>
          <Text testID="Request.createBtnLabel" style={globalStyles.defaultBtnLabel}>Save</Text>
        </TouchableOpacity>
      )
    })
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
    <View style={styles.container}>
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
      <TouchableOpacity
        testID="AccSett.deleteUserBtn"
        style={[globalStyles.defaultBtn, { width: '40%', marginLeft: 10 }]}
        onPress={handlePasswordReset}
      >
        <Text
          testID="AccSett.deleteUserBtnText"
          style={globalStyles.defaultBtnLabel}
        >Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="AccSett.deleteUserBtn"
        style={[globalStyles.secondaryBtn, { width: '40%', marginLeft: 10, backgroundColor: Colors.alert2 }]}
        onPress={() => { setShowAlert(true) }}
      >
        <Text
          testID="AccSett.deleteUserBtnText"
          style={globalStyles.defaultBtnLabel}
        >Delete User</Text>
      </TouchableOpacity>
      <Alert
        show={showAlert}
        showProgress={false}
        title="Account Deletion"
        message="Are you sure you want to delete this account?"
        closeOnTouchOutside={Platform.OS === 'web' ? false : true}
        closeOnHardwareBackPress={Platform.OS === 'web' ? false : true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor={Colors.alert2}
        onCancelPressed={() => {
          setShowAlert(false)
        }}
        onConfirmPressed={handleDeleteUser}
        onDismiss={() => { setShowAlert(false) }}
      />
    </View>
  )
}

export default AccountSettingsScreen
