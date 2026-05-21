import React, { useState, useEffect } from 'react'
import { fetchAdminSuggestions, approveSuggestion, rejectSuggestion } from '../api/admin'
import { Check, X, Clock, MapPin, Phone, User, Info, Inbox, RefreshCw, DollarSign, Coffee, Tags, Image as ImageIcon, Link, ExternalLink, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FILTERS = [
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
]

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('pending')
  const navigate = useNavigate()

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null, isProcessing: false })
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '', isError: false })
  const [selectedSuggestion, setSelectedSuggestion] = useState(null) // For Detail Modal

  useEffect(() => {
    loadSuggestions(filter)
  }, [filter])

  const loadSuggestions = async (status = filter) => {
    setLoading(true)
    setError('')
    try {
      const [current, pending, approved, rejected] = await Promise.all([
        fetchAdminSuggestions(status),
        fetchAdminSuggestions('pending'),
        fetchAdminSuggestions('approved'),
        fetchAdminSuggestions('rejected'),
      ])
      setSuggestions(current)
      setStatusCounts({
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      })
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login', { replace: true })
        return
      }
      setError(err.message || 'Không thể tải danh sách đề xuất.')
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Phê duyệt đề xuất',
      message: `Bạn có chắc chắn muốn PHÊ DUYỆT quán "${name}" lên hệ thống?`,
      action: async () => {
        setConfirmDialog(prev => ({ ...prev, isProcessing: true }))
        try {
          const resp = await approveSuggestion(id)
          setAlertDialog({ isOpen: true, title: 'Thành công', message: `Đã phê duyệt "${resp.name}" thành công!`, isError: false })
          setSelectedSuggestion(null)
          loadSuggestions(filter)
        } catch (e) {
          if (e.status === 401 || e.status === 403) {
            navigate('/login', { replace: true })
            return
          }
          setAlertDialog({ isOpen: true, title: 'Lỗi', message: e.message || "Lỗi phê duyệt.", isError: true })
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false, isProcessing: false }))
        }
      }
    })
  }

  const handleReject = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Từ chối đề xuất',
      message: 'Bạn có chắc chắn muốn TỪ CHỐI đề xuất này?',
      action: async () => {
        setConfirmDialog(prev => ({ ...prev, isProcessing: true }))
        try {
          const resp = await rejectSuggestion(id)
          setAlertDialog({ isOpen: true, title: 'Thành công', message: resp?.message || "Đã từ chối đề xuất.", isError: false })
          setSelectedSuggestion(null)
          loadSuggestions(filter)
        } catch (e) {
          if (e.status === 401 || e.status === 403) {
            navigate('/login', { replace: true })
            return
          }
          setAlertDialog({ isOpen: true, title: 'Lỗi', message: e.message || "Lỗi từ chối đề xuất.", isError: true })
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false, isProcessing: false }))
        }
      }
    })
  }

  return (
    <section className="section section--admin">
      <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="admin-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="admin-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Đề xuất từ Cộng đồng</h1>
            <p className="admin-subtitle">Kiểm duyệt và quản lý các quán do người dùng đóng góp</p>
          </div>
          <button 
            onClick={() => loadSuggestions(filter)} 
            disabled={loading}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', 
              borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' 
            }}
          >
            <RefreshCw size={16} className={loading ? "admin-state__icon--spin" : ""} />
            Làm mới
          </button>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {FILTERS.map(item => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '50px',
                background: filter === item.value ? '#0284c7' : '#f8fafc',
                color: filter === item.value ? 'white' : '#475569',
                border: `1px solid ${filter === item.value ? '#0284c7' : '#e2e8f0'}`,
                fontWeight: filter === item.value ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <span>{item.label}</span>
              <span style={{ 
                background: filter === item.value ? 'rgba(255,255,255,0.2)' : '#e2e8f0', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '12px' 
              }}>
                {statusCounts[item.value]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-state" style={{ padding: '60px 0' }}>
            <RefreshCw size={24} className="admin-state__icon admin-state__icon--spin" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="admin-state admin-state--error">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="admin-state" style={{ padding: '60px 0' }}>
            <Inbox size={28} className="admin-state__icon" />
            <p>Không có đề xuất nào trong danh sách này.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="60">STT</th>
                  <th>Tên Quán</th>
                  <th>Địa chỉ / Quận</th>
                  <th>Người gửi</th>
                  <th width="150">Trạng thái</th>
                  <th width="140" style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="admin-table__id">{idx + 1}</td>
                    <td>
                      <div className="admin-table__name">
                        {s.shop_name}
                        {s.shop_id && (
                          <span title="Cập nhật quán đã có" style={{ background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center' }}>
                            ID: {s.shop_id}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__address" title={s.address || s.district}>
                        {[s.address, (s.district && (!s.address || !s.address.includes(s.district))) ? s.district : null].filter(Boolean).join(', ')}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#475569' }}>
                        <div style={{ fontWeight: 600 }}>{s.contributor_name || 'Khách'}</div>
                        {s.contributor_email && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.contributor_email}</div>}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${s.status === 'pending' ? 'badge--pending' : s.status === 'approved' ? 'badge--active' : 'badge--rejected'}`}
                           style={{ 
                             background: s.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : s.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : undefined,
                             color: s.status === 'pending' ? '#f59e0b' : s.status === 'rejected' ? '#ef4444' : undefined
                           }}>
                        <span className="badge__dot" style={{ backgroundColor: 'currentColor' }}></span>
                        {STATUS_LABELS[s.status]}
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button 
                          className="btn-icon btn-icon--view" 
                          onClick={() => setSelectedSuggestion(s)}
                          title="Xem chi tiết"
                        >
                          <ExternalLink size={16} />
                        </button>
                        {s.status === 'pending' && (
                          <>
                            <button 
                              className="btn-icon btn-icon--approve" 
                              onClick={() => handleApprove(s.id, s.shop_name)}
                              title="Duyệt"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-icon--delete" 
                              onClick={() => handleReject(s.id)}
                              title="Từ chối"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSuggestion && (
        <div className="dialog-overlay" style={{ alignItems: 'flex-start', paddingTop: '5vh' }}>
          <div className="dialog-content" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div className={`badge ${selectedSuggestion.status === 'pending' ? 'badge--pending' : selectedSuggestion.status === 'approved' ? 'badge--active' : 'badge--rejected'}`}
                        style={{ 
                          background: selectedSuggestion.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : selectedSuggestion.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : undefined,
                          color: selectedSuggestion.status === 'pending' ? '#f59e0b' : selectedSuggestion.status === 'rejected' ? '#ef4444' : undefined
                        }}>
                    {STATUS_LABELS[selectedSuggestion.status]}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>ID: #{selectedSuggestion.id}</span>
                  {selectedSuggestion.shop_id && (
                    <span style={{ background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                      Cập nhật quán ID: {selectedSuggestion.shop_id}
                    </span>
                  )}
                </div>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px' }}>{selectedSuggestion.shop_name}</h2>
              </div>
              <button 
                onClick={() => setSelectedSuggestion(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {selectedSuggestion.address && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <MapPin size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Địa chỉ</strong>
                    <span>{selectedSuggestion.address}</span>
                  </div>
                </div>
              )}
              {selectedSuggestion.district && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <MapPin size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Quận/Huyện</strong>
                    <span>{selectedSuggestion.district}</span>
                  </div>
                </div>
              )}
              {selectedSuggestion.phone && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <Phone size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Số điện thoại</strong>
                    <span>{selectedSuggestion.phone}</span>
                  </div>
                </div>
              )}
              {selectedSuggestion.opening_hours && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <Clock size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Giờ mở cửa</strong>
                    <span>{selectedSuggestion.opening_hours}</span>
                  </div>
                </div>
              )}
              {selectedSuggestion.price_range && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <DollarSign size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Mức giá</strong>
                    <span>{selectedSuggestion.price_range}</span>
                  </div>
                </div>
              )}
              {selectedSuggestion.image_url && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <ImageIcon size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Hình ảnh đính kèm</strong>
                    <a href={selectedSuggestion.image_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7' }}>Xem hình ảnh</a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', color: '#475569', marginBottom: selectedSuggestion.reason ? '12px' : 0 }}>
                <User size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Người gửi</strong>
                  <span>{selectedSuggestion.contributor_name || 'Khách'} {selectedSuggestion.contributor_email ? `(${selectedSuggestion.contributor_email})` : ''}</span>
                </div>
              </div>
              {selectedSuggestion.reason && (
                <div style={{ display: 'flex', gap: '8px', color: '#475569' }}>
                  <Info size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Lý do / Lời nhắn</strong>
                    <span style={{ fontStyle: 'italic' }}>"{selectedSuggestion.reason}"</span>
                  </div>
                </div>
              )}
            </div>

            {selectedSuggestion.description && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '8px' }}>Mô tả</h4>
                <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                  {selectedSuggestion.description}
                </p>
              </div>
            )}

            {/* Tags section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {selectedSuggestion.purposes?.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Tags size={14} /> Mục đích</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedSuggestion.purposes.map((p, idx) => <span key={idx} style={{ background: '#f1f5f9', color: '#334155', padding: '4px 12px', borderRadius: '50px', fontSize: '13px' }}>{p}</span>)}
                  </div>
                </div>
              )}

              {selectedSuggestion.spaces?.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Tags size={14} /> Không gian</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedSuggestion.spaces.map((sp, idx) => <span key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '50px', fontSize: '13px' }}>{sp}</span>)}
                  </div>
                </div>
              )}

              {selectedSuggestion.amenities?.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Tags size={14} /> Tiện ích</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedSuggestion.amenities.map((a, idx) => <span key={idx} style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '50px', fontSize: '13px' }}>{a}</span>)}
                  </div>
                </div>
              )}

              {selectedSuggestion.drinks?.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Coffee size={14} /> Thức uống nổi bật</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedSuggestion.drinks.map((d, idx) => (
                      <span key={idx} style={{ background: '#fce7f3', color: '#9d174d', padding: '4px 12px', borderRadius: '50px', fontSize: '13px' }}>
                        {d.name} {d.price ? `(${d.price})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedSuggestion.status === 'pending' && (
              <div className="dialog-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <button 
                  className="dialog-btn dialog-btn--ghost"
                  onClick={() => handleReject(selectedSuggestion.id)}
                >
                  <X size={16} /> Từ chối
                </button>
                <button 
                  className="dialog-btn dialog-btn--success"
                  onClick={() => handleApprove(selectedSuggestion.id, selectedSuggestion.shop_name)}
                >
                  <Check size={16} /> Phê duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                className={`dialog-btn ${confirmDialog.type === 'reject' ? 'dialog-btn--danger' : 'dialog-btn--primary'}`}
                onClick={confirmDialog.action}
                disabled={confirmDialog.isProcessing}
              >
                {confirmDialog.isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
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

export default AdminSuggestions
