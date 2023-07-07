import axios from "axios"

export const BaseURL = '127.0.0.1:8000'
// export const BaseURL = 'zh-backend-azure-webapp.azurewebsites.net'

export const passwordResetURL = 'https://zh-backend-azure-webapp.azurewebsites.net/users/reset_password/'

export const axiosInstance = axios.create({
    baseURL: `http://${BaseURL}/`,
    headers: { 'Content-Type': 'application/json' }
})
