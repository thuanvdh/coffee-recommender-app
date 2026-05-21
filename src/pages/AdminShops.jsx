import React, { useState, useEffect, useCallback } from 'react'
import { fetchAdminShops, deleteShop } from '../api/admin'
import { Trash2, MapPin, Clock, ExternalLink, Inbox, RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function AdminShops() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalShops, setTotalShops] = useState(0)
  const limit = 20

  const navigate = useNavigate()

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null, isProcessing: false })
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '', isError: false })

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Reset page when search term changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  // Load shops when page or debounced search term changes
  useEffect(() => {
    loadShops()
  }, [page, debouncedSearchTerm])

  const loadShops = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminShops({ 
        page, 
        limit, 
        search: debouncedSearchTerm || undefined 
      })
      
      if (data && data.shops) {
        setShops(data.shops)
        setTotalShops(data.total || 0)
        setTotalPages(Math.ceil((data.total || 0) / limit))
      } else {
        setError('Không thể tải danh sách quán')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối server.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (shop) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa quán',
      message: `Bạn có chắc chắn muốn xóa quán "${shop.name}" không? Thao tác này không thể hoàn tác.`,
      action: async () => {
        setConfirmDialog(prev => ({ ...prev, isProcessing: true }))
        try {
          const res = await deleteShop(shop.id)
          if (res.ok) {
             setAlertDialog({ isOpen: true, title: 'Thành công', message: 'Đã xóa quán thành công.', isError: false })
             loadShops()
          } else {
             const data = await res.json()
             setAlertDialog({ isOpen: true, title: 'Lỗi', message: data.detail || 'Không thể xóa quán.', isError: true })
          }
        } catch (error) {
           setAlertDialog({ isOpen: true, title: 'Lỗi', message: 'Đã xảy ra lỗi khi kết nối server.', isError: true })
        } finally {
           setConfirmDialog(prev => ({ ...prev, isOpen: false, isProcessing: false }))
        }
      }
    })
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1)
  }

  return (
    <section className="section section--admin">
      <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="admin-header" style={{ marginBottom: '32px' }}>
          <div>
            <h1 className="admin-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Danh sách Quán</h1>
            <p className="admin-subtitle">Quản lý và cập nhật trạng thái các quán cà phê trên hệ thống</p>
          </div>
        </div>

        {/* Thanh công cụ: Search */}
        <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '0' }}>
          <div className="admin-search-bar">
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Tìm kiếm quán theo tên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-toolbar__meta" style={{ fontWeight: 500, color: '#64748b' }}>
            Tổng cộng: <span style={{ color: '#0284c7', fontWeight: 700 }}>{totalShops}</span> quán
          </div>
        </div>

        {loading && shops.length === 0 ? (
          <div className="admin-state" style={{ padding: '60px 0' }}>
            <RefreshCw size={24} className="admin-state__icon admin-state__icon--spin" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="admin-state admin-state--error">{error}</div>
        ) : shops.length === 0 ? (
          <div className="admin-state" style={{ padding: '60px 0' }}>
            <Inbox size={28} className="admin-state__icon" />
            <p>Không có quán nào phù hợp.</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {loading && (
               <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <RefreshCw size={24} className="admin-state__icon--spin" color="#0284c7" />
               </div>
            )}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th width="60">STT</th>
                    <th>Tên Quán</th>
                    <th>Địa chỉ</th>
                    <th width="150">Giờ mở cửa</th>
                    <th width="150">Trạng thái</th>
                    <th width="100" style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((s, idx) => (
                      <tr key={s.id}>
                        <td className="admin-table__id">{(page - 1) * limit + idx + 1}</td>
                        <td>
                          <div className="admin-table__name">
                            {s.name}
                          </div>
                        </td>
                        <td>
                          <div className="admin-table__address" title={s.address}>
                            {[s.address, (s.district && (!s.address || !s.address.includes(s.district))) ? s.district : null, 'Đà Nẵng'].filter(Boolean).join(', ')}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                            <Clock size={14} />
                            <span>{s.opening_hours || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="badge badge--active">
                            <span className="badge__dot"></span>
                            Hoạt động
                          </div>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <Link to={`/detail?slug=${s.slug}`} target="_blank" className="btn-icon btn-icon--view" title="Xem chi tiết">
                              <ExternalLink size={16} />
                            </Link>
                            <button 
                              className="btn-icon btn-icon--delete" 
                              onClick={() => handleDelete(s)}
                              title="Xóa quán"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '0 8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  Trang {page} / {totalPages}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handlePrevPage} 
                    disabled={page === 1}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                      background: page === 1 ? '#f8fafc' : '#fff',
                      color: page === 1 ? '#cbd5e1' : '#334155',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Trước
                  </button>
                  <button 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                      background: page === totalPages ? '#f8fafc' : '#fff',
                      color: page === totalPages ? '#cbd5e1' : '#334155',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Sau <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">{confirmDialog.title}</h3>
            <p className="dialog-desc">{confirmDialog.message}</p>
            <div className="dialog-actions">
              <button 
                className="dialog-btn dialog-btn--ghost" 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                disabled={confirmDialog.isProcessing}
              >
                Hủy
              </button>
              <button 
                className="dialog-btn dialog-btn--danger" 
                onClick={confirmDialog.action}
                disabled={confirmDialog.isProcessing}
              >
                {confirmDialog.isProcessing ? 'Đang xử lý...' : 'Đồng ý xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              {alertDialog.isError ? (
                <AlertCircle size={24} color="#ef4444" />
              ) : (
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>✓</div>
              )}
              <h3 className="dialog-title" style={{ margin: 0 }}>{alertDialog.title}</h3>
            </div>
            <p className="dialog-desc">{alertDialog.message}</p>
            <div className="dialog-actions">
              <button className="btn-primary" onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminShops
