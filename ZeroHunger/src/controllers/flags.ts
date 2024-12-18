import { axiosInstance, getAccessToken } from "../../config"
import { AuthContext } from '../context/AuthContext';
import React from 'react'

export async function updateMuteStatus(conversation: string) {
    // console.log(`Update mute status called for ${conversation}!!`)
    try {
        const res = await axiosInstance.post('chat/updateMuteStatus', {
            data: {
                conversation: conversation
            }, headers: {
                Authorization: await getAccessToken()
            }
        })

        // console.log(`Response received: ${JSON.stringify(res)}`)
        if (res.status === 201 || res.status === 200) {
            // alert!({ type: 'open', message: `Successfully ${res.data} conversation`, alertType: 'success' })
        } else {
            alert!({ type: 'open', message: `Error muting or unmuting conversation`, alertType: 'error' })
        }

    } catch (error) {
        console.log(`Encountered error: ${error}`)
        alert!({ type: 'open', message: `Error communicating with server`, alertType: 'error' })
    }
}