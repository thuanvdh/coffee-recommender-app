import React from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, X } from 'lucide-react'

function Drawer({ isOpen, closeDrawer, theme, toggleTheme }) {
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem('admin_user'))

  React.useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(!!localStorage.getItem('admin_user'))
    }
    window.addEventListener('authChange', checkAuth)
    return () => window.removeEventListener('authChange', checkAuth)
  }, [])

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
              <span className="logo-text__name">Danang</span>
              <span className="logo-text__sub">COFFEE</span>
            </div>
          </div>
          <button className="drawer__close" onClick={closeDrawer}><X /></button>
        </div>
        <nav className="drawer__nav">
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
            <Link to="/admin/suggestions" onClick={closeDrawer} style={{ color: '#0369A1', fontWeight: 'bold' }}>Quản lý (Admin)</Link>
          )}
        </nav>
      </div>
    </>
  )
}

export default Drawer
