import nacl from "tweetnacl"
import { encode as encodeBase64, decode as decodeBase64 } from "@stablelib/base64"
import { encode as encodeUTF8, decode as decodeUTF8 } from "@stablelib/utf8"
import { axiosInstance, getAccessToken } from "../../config"

// TAKES IN BASE64 ENCODED PRIVATE KEY, PUBLIC KEY, AND NONCE, WITH UTF8 ENCODED CONTENT
export function encryptMessage(self_privatekey, other_user_publickey, content, nonce) {
    try {
        const content_decoded = encodeUTF8(content)
        const self_priv = decodeBase64(self_privatekey)
        const other_pub = decodeBase64(other_user_publickey)

        const encrypted_content = nacl.box(
            content_decoded,
            decodeBase64(nonce),
            other_pub,
            self_priv
        )

        return encodeBase64(encrypted_content)
    } catch (error) {
        return null
        // Error with encrypting message
        // console.log(`Encountered an error: ${error}`)
    }
}

// encrypts with nonce of 0's
export function encryptMessage1(self_privatekey, other_user_publickey, content) {
    return encryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}

// TAKES IN BASE64 ENCODED PRIVATE KEY, PUBLIC KEY, CONTENT, AND NONCE
export function decryptMessage(self_privatekey, other_user_publickey, encrypted_content, nonce) {

    try {
        let self_priv = decodeBase64(self_privatekey)
        let other_pub = decodeBase64(other_user_publickey)
        let content = decodeBase64(encrypted_content)

        const decryptedMessage = nacl.box.open(
            content, 
            decodeBase64(nonce), 
            other_pub, 
            self_priv)

        return decodeUTF8(decryptedMessage)
    } catch (error) {
        if (encrypted_content.startsWith('{')) {
            return encrypted_content
        } else {
            return "[Message]"
        }
        // return encrypted_content
        // Unable to decrypt message
    }
}

// decrypts with none of 0's
export function decryptMessage1(self_privatekey, other_user_publickey, content) {
    return decryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}

export async function updateConvPhoneFlag(conversation: string) {
    try {
        const res = await axiosInstance.post('chat/updatePhoneStatus', {
            data: {
                conversation: conversation
            }, headers: {
                Authorization: await getAccessToken()
            }
        })
        console.log(`Response received: ${JSON.stringify(res)}`)
    } catch (error) {
        console.log(`Encountered error: ${error}`)
    }
}

export async function updateConvEmailFlag(conversation: string) {
    try {
        const res = await axiosInstance.post('chat/updateEmailStatus', {
            data: {
                conversation: conversation
            }, headers: {
                Authorization: await getAccessToken()
            }
        })
        console.log(`Response received: ${JSON.stringify(res)}`)
    } catch (error) {
        console.log(`Encountered error: ${error}`)
    }
}

// onst includePhoneNumRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
            // if (message.match(includePhoneNumRegex)) {
export function checkForEmail(content) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return content.match(emailRegex)
}

export function checkforPhone(content) {
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    return content.match(phoneRegex)
}