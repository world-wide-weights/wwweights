import axios from "axios"

// Common config
axios.defaults.headers.post["Content-Type"] = "application/json"

// Mock API
export const mockRequest = axios.create(({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_MOCK
}))

// Query API
export const queryRequest = axios.create(({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_QUERY
}))

// Command API
export const commandRequest = axios.create(({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_COMMAND
}))

// Auth API
export const authRequest = axios.create(({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_AUTH
}))

// Image API
export const imageRequest = axios.create(({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE
}))

export const addTokenToHeader = (token: string) => {
    mockRequest.defaults.headers["Authorization"] = `Bearer ${token}`
    queryRequest.defaults.headers["Authorization"] = `Bearer ${token}`
    commandRequest.defaults.headers["Authorization"] = `Bearer ${token}`
    authRequest.defaults.headers["Authorization"] = `Bearer ${token}`
    imageRequest.defaults.headers["Authorization"] = `Bearer ${token}`
}