import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { authService } from "@/services/api"
import { useAuth } from "@/context/AuthContext"

export default function VerifyOTP() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)
  const navigate = useNavigate()
  const location = useLocation()
  const { checkAuth } = useAuth()
  
  const email = location.state?.email
  const type = location.state?.type || "signup"

  useEffect(() => {
    if (!email) {
      navigate("/signup")
      return
    }
    
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    
    return () => clearInterval(countdown)
  }, [email, navigate])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter 6-digit code")
      return
    }
    
    setLoading(true)
    setError("")

    try {
      await authService.verifySignupOTP(email, otp)
      await checkAuth()
      navigate("/library")
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    
    try {
      await authService.sendSignupOTP(email, location.state?.password || "")
      setTimer(60)
      setError("")
    } catch (err) {
      setError("Failed to resend code")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to<br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-3xl tracking-[0.5em] font-mono"
                autoFocus
              />
              <p className="text-xs text-center text-muted-foreground">
                Code expires in 5 minutes
              </p>
            </div>
            
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            
            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={timer > 0 || resending}
                className="text-sm"
              >
                {resending ? "Sending..." : timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
