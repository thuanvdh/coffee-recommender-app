import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Edit3, Info, Menu } from 'lucide-react'

function BottomNav() {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem('admin_user'))
  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/index.html')

  React.useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(!!localStorage.getItem('admin_user'))
    }
    window.addEventListener('authChange', checkAuth)
    return () => window.removeEventListener('authChange', checkAuth)
  }, [])

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav__item ${isActive('/') ? 'bottom-nav__item--active' : ''}`}>
        <Home size={20} />
        Trang chủ
      </Link>
      <Link to="/search" className={`bottom-nav__item ${isActive('/search') ? 'bottom-nav__item--active' : ''}`}>
        <Search size={20} />
        Tìm kiếm
      </Link>
      <Link to="/suggest" className={`bottom-nav__item ${isActive('/suggest') ? 'bottom-nav__item--active' : ''}`}>
        <Edit3 size={20} />
        Đề xuất
      </Link>
      <Link to="/about" className={`bottom-nav__item ${isActive('/about') ? 'bottom-nav__item--active' : ''}`}>
        <Info size={20} />
        Giới thiệu
      </Link>
      {isAdmin && (
        <Link to="/admin/suggestions" className="bottom-nav__item" style={{ color: '#0369A1', fontWeight: 'bold' }}>
          <Menu size={20} />
          Quản trị
        </Link>
      )}
    </nav>
  )
}

export default BottomNav
