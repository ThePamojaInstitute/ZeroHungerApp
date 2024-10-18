import { AuthContext } from '../context/AuthContext';
import React from 'react'
import { axiosInstance, getAccessToken, storage } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import nacl from "tweetnacl"
import { encode as encodeBase64 } from "@stablelib/base64"

//
// Checks if user has a stored key, if not tries to send a public key to server, and saves private key if successful
//
export async function handleNewKeys(user: string, accesstoken: string) {
    // console.log(`TOKENS RECEIVED IN HANDLENEWKEYS: ${accesstoken}`)
    let keystatus
    if (Platform.OS === 'web') {
        keystatus = storage.getString(user + 'privkey')
    } else {
        keystatus = await AsyncStorage.getItem(user + 'privkey')
    }
    if (!keystatus) {
        // console.log(`KEY DOES NOT EXIST`)
        // console.log(`HERE ARE THE KEYS: ${await getAccessToken()}`)
        const keyPair = nacl.box.keyPair.fromSecretKey(nacl.randomBytes(nacl.box.secretKeyLength))
        let pub = encodeBase64(keyPair.publicKey)
        let priv = encodeBase64(keyPair.secretKey)
        // console.log(`WE'RE THIS FAR 1`)
        try {
            const res = await axiosInstance.post('users/addPublicKey', {
                data: {
                    user: user,
                    publickey: pub,
                    username: user,
                },
                headers: {
                    Authorization: accesstoken
                }
            });
            // console.log(res.status)
            // console.log(`WE'RE THIS FAR 2`)
            if (res.status === 201 || res.status === 200) {
                // console.log(`Successfully sent key: ${res}`)
                if (Platform.OS === 'web') {
                    storage.set(user + 'privkey', priv)
                } else {
                    await AsyncStorage.setItem(user + 'privkey', priv)
                    let test1 = await AsyncStorage.getItem(user + 'privkey')
                    // alert!({ type: 'open', message: (JSON.stringify(user) + " privkey set to: " + JSON.stringify(test1)), alertType: 'success' })
                }
            } else {
                // console.log(`Error receiving from server: ${res}`)
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        // alert!({ type: 'open', message: (JSON.stringify(user) + " privkey exists: " + JSON.stringify(keystatus)), alertType: 'success' })
        // console.log(`KEY DOES EXIST`)
    }
}

export function getPrivateKey() {
    const { user } = React.useContext(AuthContext)
    if (Platform.OS === 'web') {
        return storage.getString(user['username'] + 'privkey')
    } else {
        AsyncStorage.getItem(user['username'] + 'privkey').then((item) => {
            return item
        })
    }
}

export function getPrivateKey1(user: string) {
    // console.log(`GETPUBLICKEY1 WAS CALLED: ${JSON.stringify(user)}`)
    // console.log(`GETPUBLICKEY1 WAS CALLED HERE'S KEY RETURN: ${storage.getString(user + 'privkey')}`)
    try {
        if (Platform.OS === 'web') {
            return storage.getString(user + 'privkey')
        } else {
            AsyncStorage.getItem(user + 'privkey').then(item => {
                // alert!({ type: 'open', message: `${user} selfkey: ${item}`, alertType: 'success' })
                return item
            }).catch((error) => {
                alert!({ type: 'open', message: "something went wrong in get privatekey", alertType: 'error' })
                return "errorfromgetitem"
            })
        }
    } catch (error) {
        alert!({ type: 'open', message: `error occured ${JSON.stringify(error)}`, alertType: 'error' })
        return "testerror" 
    }
}

//
// Async function to get private key from storage
//
export const getPrivateKey2 = async (user: string) => {
    let key: string
    if (Platform.OS === 'web') {
        key = storage.getString(user + 'privkey')
    } else {
        key = await AsyncStorage.getItem(user + 'privkey')
    }
    return key
}