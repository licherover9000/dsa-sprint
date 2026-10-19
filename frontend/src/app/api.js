import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '')
let tokenProvider = () => null

export const setTokenProvider = (provider) => {
  tokenProvider = provider
}

export const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = tokenProvider()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong.'
    return Promise.reject(new Error(message))
  },
)
