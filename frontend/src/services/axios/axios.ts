import axios from "axios"

// Common config
axios.defaults.headers.post["Content-Type"] = "application/json"

// Query API from Server
export const queryServerRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_QUERY_SERVER,
})

// Query API from Client
export const queryClientRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_QUERY_CLIENT,
})

// Command API
export const commandRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_COMMAND,
})

// Auth API from Client
export const authClientRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_AUTH_CLIENT,
})

// Auth API from Server
export const authServerRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_AUTH_SERVER,
})

// Image API
export const imageRequest = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE,
})
