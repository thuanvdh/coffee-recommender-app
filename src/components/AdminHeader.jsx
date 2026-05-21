import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Edit3, Menu, LogOut, Moon, Sun, Settings } from 'lucide-react'

function AdminHeader({ isScrolled, toggleDrawer, theme, toggleTheme }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} id="header">
      <div className="header__inner">
        <Link to="/admin/suggestions" className="header__logo">
          <div className="logo-icon" style={{ backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px' }}>
            <Settings size={20} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-text__name" style={{ color: '#0284c7' }}>Admin</span>
            <span className="logo-text__sub">PORTAL</span>
          </div>
        </Link>

        <nav className="header__nav">
          <Link to="/admin/suggestions" className={`header__nav-link ${isActive('/admin/suggestions') ? 'header__nav-link--active' : ''}`}>
            <Edit3 size={18} />
            Duyệt Đề xuất
          </Link>
          <Link to="/admin/shops" className={`header__nav-link ${isActive('/admin/shops') ? 'header__nav-link--active' : ''}`}>
            <Menu size={18} />
            Quản lý Quán
          </Link>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' }}></div>
          
          <Link to="/" className="header__nav-link">
            <Home size={18} />
            Về Trang khách
          </Link>
          
          <button 
            className="header__nav-link" 
            onClick={toggleTheme}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            title={theme === 'light' ? 'Bật chế độ tối' : 'Bật chế độ sáng'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#D4BBA5" />}
          </button>
          
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

export default AdminHeader
