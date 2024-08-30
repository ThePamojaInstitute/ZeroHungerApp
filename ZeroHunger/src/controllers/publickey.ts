import { AuthContext } from '../context/AuthContext';
import React from 'react'
import { axiosInstance, getAccessToken, storage } from "../../config";

export const addPublicKey = async () => {
    const { user, accessToken } = React.useContext(AuthContext)
    try {
        const res = await axiosInstance.post('users/addPublicKey', {
            data: {
                user: user['username'],
                publickey: storage.getString('pubkey'),
                username: user['username'],
            },
            headers: {
                Authorization: await getAccessToken()
            }
        });
        console.log(res)
    } catch(error) {
        console.log(error)
    }
}

