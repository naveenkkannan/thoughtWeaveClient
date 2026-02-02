import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
})

// Add token to every request from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  sendSignupOTP: async (email, password) => {
    const response = await api.post("/auth/send-signup-otp", { email, password })
    return response.data
  },
  verifySignupOTP: async (email, otp) => {
    const response = await api.post("/auth/verify-signup-otp", { email, otp })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email })
    return response.data
  },
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post("/auth/reset-password", { email, otp, newPassword })
    return response.data
  },
  logout: async () => {
    localStorage.removeItem('token')
    const response = await api.post("/auth/logout")
    return response.data
  },
  me: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

export const booksService = {
  getAll: async () => {
    const response = await api.get("/books")
    return response.data
  },
  getById: async (bookId) => {
    const response = await api.get(`/books/${bookId}`)
    return response.data
  },
  create: async (bookData) => {
    const response = await api.post("/books", bookData)
    return response.data
  },
  update: async (bookId, bookData) => {
    const response = await api.put(`/books/${bookId}`, bookData)
    return response.data
  },
  delete: async (bookId) => {
    const response = await api.delete(`/books/${bookId}`)
    return response.data
  },
  searchGoogleBooks: async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`)
    return response.data
  },
}

export const notesService = {
  getByBook: async (bookId) => {
    const response = await api.get(`/books/${bookId}/notes`)
    return response.data
  },
  create: async (bookId, noteData) => {
    const response = await api.post(`/books/${bookId}/notes`, noteData)
    return response.data
  },
  update: async (noteId, noteData) => {
    const response = await api.put(`/notes/${noteId}`, noteData)
    return response.data
  },
  delete: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`)
    return response.data
  },
}

export const tagsService = {
  getAll: async () => {
    const response = await api.get("/tags")
    return response.data
  },
  create: async (tagName) => {
    const response = await api.post("/tags", { name: tagName })
    return response.data
  },
}

export default api
