import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "zh-backend-azure-webapp.azurewebsites.net",
    headers: { 'Content-Type': 'application/json' }
})