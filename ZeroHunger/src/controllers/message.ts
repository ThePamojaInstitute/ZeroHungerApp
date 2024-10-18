import nacl from "tweetnacl"
import { encode as encodeBase64, decode as decodeBase64 } from "@stablelib/base64"
import { encode as encodeUTF8, decode as decodeUTF8 } from "@stablelib/utf8"

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
        // Unable to decrypt message
        // console.log(`Encountered an error: ${error}`)
        return encrypted_content
    }
}

// decrypts with none of 0's
export function decryptMessage1(self_privatekey, other_user_publickey, content) {
    return decryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}