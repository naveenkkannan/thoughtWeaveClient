import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import Layout from "@/components/Layout"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import VerifyOTP from "@/pages/VerifyOTP"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Library from "@/pages/Library"
import SearchBooks from "@/pages/SearchBooks"
import BookDetail from "@/pages/BookDetail"
import AddNote from "@/pages/AddNote"
import Profile from "@/pages/Profile"

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/library" replace />} />
              <Route path="library" element={<Library />} />
              <Route path="search" element={<SearchBooks />} />
              <Route path="books/:id" element={<BookDetail />} />
              <Route path="books/:id/notes/new" element={<AddNote />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/library" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
