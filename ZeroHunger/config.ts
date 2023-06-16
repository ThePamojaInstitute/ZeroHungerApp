import axios from "axios"

export const axiosInstance = axios.create({
    // baseURL: "http://127.0.0.1:8000/",
    baseURL: "https://zh-backend-azure-webapp.azurewebsites.net/",
    headers: { 'Content-Type': 'application/json' }
})