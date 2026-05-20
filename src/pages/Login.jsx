import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAdminSession, loginAdmin } from '../api'
import { LogIn, ShieldAlert } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin/suggestions'

  useEffect(() => {
    if (getAdminSession()?.access_token) {
      navigate(redirectTo, { replace: true })
    }
  }, [navigate, redirectTo])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginAdmin(username, password)
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('admin_user', JSON.stringify(data))
        // Trigger a custom event so other components know the auth state changed
        window.dispatchEvent(new Event('authChange'))
        navigate(redirectTo, { replace: true })
      } else {
        const err = await response.json()
        setError(err.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.')
      }
    } catch (err) {
      setError('Lỗi kết nối server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="section__inner login-page__inner">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <ShieldAlert size={32} />
            </div>
            <h1>Admin Login</h1>
            <p>Vui lòng đăng nhập để quản lý hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="login-error">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="admin"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary login-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
