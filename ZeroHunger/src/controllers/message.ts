import nacl from "tweetnacl"
import { encodeBase64, decodeBase64, decodeUTF8, encodeUTF8 } from "tweetnacl-util"

export function encryptMessage(self_privatekey, other_user_publickey, content, nonce) {
    // const nonce = new Uint8Array(24).fill(0)
    // const nonce = nonce1
    const content_decoded = decodeUTF8(content)
    const self_priv = decodeBase64(self_privatekey)
    const other_pub = decodeBase64(other_user_publickey)

    console.log(`nonce: ${nonce}, content: ${content_decoded}, selfpriv: ${self_priv}, otherpub: ${other_pub}`)
    console.log(`ENCRYPTION ORDER IN THE COURT: CONTENT: ${content},\n NONCE: ${nonce},\n OTHER KEY: ${other_pub}\n, SELF KEY: ${self_priv}`)

    const encrypted_content = nacl.box(
        content_decoded,
        decodeBase64(nonce),
        other_pub,
        self_priv
    )

    return encodeBase64(encrypted_content)
}

export function encryptMessageWithoutNonce(self_privatekey, other_user_publickey, content) {
    return encryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}

export function decryptMessage(self_privatekey, other_user_publickey, encrypted_content, nonce) {
    console.log(`CONTENT HERE: ${encrypted_content}`)
    let self_priv = decodeBase64(self_privatekey)
    let other_pub = decodeBase64(other_user_publickey)
    // let nonce = new Uint8Array(24).fill(0)
    // let nonce = nonce1
    let content = decodeBase64(encrypted_content)
    console.log(`DECRYPTION ORDER IN THE COURT: CONTENT: ${content},\n NONCE: ${nonce},\n OTHER KEY: ${other_pub},\n SELF KEY: ${self_priv}`)
    const decryptedMessage = nacl.box.open(
        content, 
        decodeBase64(nonce), 
        other_pub, 
        self_priv)
    console.log(`DECRYPTED MESSAGE HERE ${decryptedMessage}`)
    return encodeUTF8(decryptedMessage)
}

export function decryptMessageWithoutNonce(self_privatekey, other_user_publickey, content) {
    return decryptMessage(self_privatekey, other_user_publickey, content, encodeBase64(new Uint8Array(24).fill(0)))
}