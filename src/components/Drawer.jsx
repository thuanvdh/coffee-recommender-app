import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, X } from 'lucide-react'

function Drawer({ isOpen, closeDrawer, theme, toggleTheme, isAdminRoute }) {
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem('admin_user'))
  const navigate = useNavigate()

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
    closeDrawer()
  }

  return (
    <>
      <div 
        className={`drawer-overlay ${isOpen ? 'drawer-overlay--visible' : ''}`} 
        onClick={closeDrawer}
      ></div>
      <div className={`drawer ${isOpen ? 'drawer--open' : ''}`}>
        <div className="drawer__header">
          <div className="header__logo">
            <div className="logo-text">
              <span className="logo-text__name">{isAdminRoute ? 'Admin' : 'Danang'}</span>
              <span className="logo-text__sub">{isAdminRoute ? 'PORTAL' : 'COFFEE'}</span>
            </div>
          </div>
          <button className="drawer__close" onClick={closeDrawer}><X /></button>
        </div>
        <nav className="drawer__nav">
          {isAdminRoute ? (
            <>
              <Link to="/admin/suggestions" onClick={closeDrawer}>Duyệt Đề xuất</Link>
              <Link to="/admin/shops" onClick={closeDrawer}>Quản lý Quán</Link>
              <hr />
              <Link to="/" onClick={closeDrawer}>Về Trang khách</Link>
              <button className="drawer__theme-toggle" onClick={toggleTheme} style={{ marginTop: '16px' }}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
              </button>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', border: 'none', color: '#EF4444', 
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', 
                  textAlign: 'left', padding: '16px 0', marginTop: 'auto'
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeDrawer}>Trang chủ</Link>
              <Link to="/search" onClick={closeDrawer}>Tìm kiếm</Link>
              <Link to="/favorites" onClick={closeDrawer}>Top 10 quán</Link>
              <Link to="/about" onClick={closeDrawer}>Giới thiệu</Link>
              <hr />
              <button className="drawer__theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
              </button>
              <hr />
              <Link to="/suggest" onClick={closeDrawer}>Đề xuất quán mới</Link>
              {isAdmin && (
                <Link to="/admin/suggestions" onClick={closeDrawer} style={{ color: '#0369A1', fontWeight: 'bold' }}>Trang Quản trị</Link>
              )}
            </>
          )}
        </nav>
      </div>
    </>
  )
}

export default Drawer
