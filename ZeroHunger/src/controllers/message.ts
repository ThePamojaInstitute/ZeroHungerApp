import nacl from "tweetnacl"
import { encode as encodeBase64, decode as decodeBase64 } from "@stablelib/base64"
import { encode as encodeUTF8, decode as decodeUTF8 } from "@stablelib/utf8"

// TAKES IN BASE64 ENCODED PRIVATE KEY, PUBLIC KEY, AND NONCE, WITH UTF8 ENCODED CONTENT
export function encryptMessage(self_privatekey, other_user_publickey, content, nonce) {
    // const nonce = new Uint8Array(24).fill(0)
    // const nonce = nonce1
    try {
        const content_decoded = encodeUTF8(content)
        const self_priv = decodeBase64(self_privatekey)
        const other_pub = decodeBase64(other_user_publickey)

        // console.log(`nonce: ${nonce}, content: ${content_decoded}, selfpriv: ${self_priv}, otherpub: ${other_pub}`)
        // console.log(`ENCRYPTION ORDER IN THE COURT: CONTENT: ${content},\n NONCE: ${nonce},\n OTHER KEY: ${other_pub}\n, SELF KEY: ${self_priv}`)

        const encrypted_content = nacl.box(
            content_decoded,
            decodeBase64(nonce),
            other_pub,
            self_priv
        )

        return encodeBase64(encrypted_content)
    } catch (error) {
        // console.log(`Encountered an error: ${error}`)
        alert!({ type: 'open', message: 'enc err: ' + JSON.stringify(error), alertType: 'error' })
        // return content
    }
}

export function encryptMessage1(self_privatekey, other_user_publickey, content) {
    return encryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}

// TAKES IN BASE64 ENCODED PRIVATE KEY, PUBLIC KEY, CONTENT, AND NONCE
export function decryptMessage(self_privatekey, other_user_publickey, encrypted_content, nonce) {
    // console.log(`Hello from decryptmessage!\nself key: ${self_privatekey}\nother key:${other_user_publickey}\ncontent: ${encrypted_content}`)

    try {
        // console.log(`CONTENT HERE: ${encrypted_content}`)
        // console.log(`TESTING HERE 1`)
        let self_priv = decodeBase64(self_privatekey)
        let other_pub = decodeBase64(other_user_publickey)
        // let nonce = new Uint8Array(24).fill(0)
        // let nonce = nonce1
        // console.log(`TESTING HERE 2`)
        let content = decodeBase64(encrypted_content)
        // console.log(`TESTING HERE 3`)
        // console.log(`DECRYPTION ORDER IN THE COURT: CONTENT: ${content},\n NONCE: ${nonce},\n OTHER KEY: ${other_pub},\n SELF KEY: ${self_priv}`)
        const decryptedMessage = nacl.box.open(
            content, 
            decodeBase64(nonce), 
            other_pub, 
            self_priv)

        // console.log(`TESTING HERE 4: ${decryptedMessage}`)
        // console.log(`DECRYPTED MESSAGE HERE ${decryptedMessage}`)
        return decodeUTF8(decryptedMessage)
    } catch (error) {
        // console.log(`Encountered an error: ${error}`)
        alert!({ type: 'open', message: 'enc err: ' + JSON.stringify(error), alertType: 'error' })
        return encrypted_content
    }
}

export function decryptMessage1(self_privatekey, other_user_publickey, content) {
    return decryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}