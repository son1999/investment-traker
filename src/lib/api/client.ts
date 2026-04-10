import axios from 'axios'
import i18n from '@/i18n'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('itracker-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Accept-Language'] = i18n.language || 'vi'
  return config
})

let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token)
    else p.reject(error)
  })
  failedQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest?.url || ''

    if (error.response?.status !== 401 || url.includes('/auth/login') || url.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      localStorage.removeItem('itracker-token')
      localStorage.removeItem('itracker-refresh-token')
      localStorage.removeItem('itracker-user')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(client(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('itracker-refresh-token')
    if (!refreshToken) {
      isRefreshing = false
      localStorage.removeItem('itracker-token')
      localStorage.removeItem('itracker-user')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const res = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        { refreshToken },
      )
      const { accessToken, refreshToken: newRefreshToken } = res.data.data
      localStorage.setItem('itracker-token', accessToken)
      localStorage.setItem('itracker-refresh-token', newRefreshToken)
      processQueue(null, accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return client(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem('itracker-token')
      localStorage.removeItem('itracker-refresh-token')
      localStorage.removeItem('itracker-user')
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default client
