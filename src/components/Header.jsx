import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Info, Edit3, Menu, LogOut, Map as MapIcon, Heart, Moon, Sun } from 'lucide-react'

function Header({ isScrolled, toggleDrawer }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem('admin_user'))
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light')
  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/index.html')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(!!localStorage.getItem('admin_user'))
    }
    window.addEventListener('authChange', checkAuth)
    return () => window.removeEventListener('authChange', checkAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} id="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <div className="logo-icon">
            <img src="/favicon.png" alt="Danang Coffee Logo" width="32" height="32" style={{ borderRadius: '8px', objectFit: 'cover' }} />
          </div>
          <div className="logo-text">
            <span className="logo-text__name">Danang</span>
            <span className="logo-text__sub">COFFEE</span>
          </div>
        </Link>

        <nav className="header__nav">
          <Link to="/" className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}>
            <Home size={18} />
            Trang chủ
          </Link>
          <Link to="/search" className={`header__nav-link ${isActive('/search') ? 'header__nav-link--active' : ''}`}>
            <Search size={18} />
            Tìm kiếm
          </Link>
          <Link to="/map" className={`header__nav-link ${isActive('/map') ? 'header__nav-link--active' : ''}`}>
            <MapIcon size={18} />
            Bản đồ
          </Link>
          <Link to="/favorites" className={`header__nav-link ${isActive('/favorites') ? 'header__nav-link--active' : ''}`}>
            <Heart size={18} />
            Yêu thích
          </Link>
          <Link to="/suggest" className={`header__nav-link ${isActive('/suggest') ? 'header__nav-link--active' : ''}`}>
            <Edit3 size={18} />
            Đề xuất
          </Link>
          <Link to="/about" className={`header__nav-link ${isActive('/about') ? 'header__nav-link--active' : ''}`}>
            <Info size={18} />
            Giới thiệu
          </Link>
          
          <button 
            className="header__nav-link" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: 'auto' }}
            title="Chế độ ban đêm"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#D4BBA5" />}
          </button>
          {isAdmin && (
            <>
              <Link to="/admin/suggestions" className={`header__nav-link ${isActive('/admin/suggestions') ? 'header__nav-link--active' : ''}`} style={{ color: '#0369A1' }}>
                <Menu size={18} />
                Quản lý
              </Link>
              <button 
                onClick={handleLogout} 
                className="header__nav-link" 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#EF4444', 
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: '8px 12px'
                }}
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </>
          )}
        </nav>

        <button className="header__hamburger" onClick={toggleDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
