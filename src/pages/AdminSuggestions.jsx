import React, { useState, useEffect } from 'react'
import { fetchAdminSuggestions, approveSuggestion, rejectSuggestion } from '../api'
import { Check, X, Clock, MapPin, Phone, User, Info, Inbox, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FILTERS = [
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Đã từ chối', value: 'rejected' },
]

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
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

  const handleApprove = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn PHÊ DUYỆT quán này lên hệ thống?")) return
    try {
      const resp = await approveSuggestion(id)
      alert(`Đã phê duyệt "${resp.name}" thành công!`)
      loadSuggestions(filter)
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        navigate('/login', { replace: true })
        return
      }
      alert(e.message || "Lỗi phê duyệt.")
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn TỪ CHỐI đề xuất này?")) return
    try {
      const resp = await rejectSuggestion(id)
      alert(resp?.message || "Đã từ chối đề xuất.")
      loadSuggestions(filter)
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        navigate('/login', { replace: true })
        return
      }
      alert(e.message || "Lỗi từ chối đề xuất.")
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="admin-kicker">Bảng điều phối nội dung</p>
            <h1 className="admin-title">Quản lý đề xuất quán</h1>
            <p className="admin-subtitle">
              Xem nhanh đề xuất từ cộng đồng và duyệt những quán phù hợp lên hệ thống.
            </p>
          </div>
          <button className="admin-refresh" onClick={() => loadSuggestions(filter)} disabled={loading}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-filters">
            {FILTERS.map(item => (
              <button
                key={item.value}
                className={`admin-filter-btn ${filter === item.value ? 'is-active' : ''}`}
                onClick={() => setFilter(item.value)}
              >
                <span>{item.label}</span>
                <strong>{statusCounts[item.value]}</strong>
              </button>
            ))}
          </div>
          <div className="admin-toolbar__meta">
            {loading ? 'Đang đồng bộ...' : `${suggestions.length} đề xuất trong mục ${STATUS_LABELS[filter].toLowerCase()}`}
          </div>
        </div>

        {loading ? (
          <div className="admin-state">
            <RefreshCw size={24} className="admin-state__icon admin-state__icon--spin" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="admin-state admin-state--error">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="admin-state">
            <Inbox size={28} className="admin-state__icon" />
            <p>Không có đề xuất nào trong danh sách.</p>
          </div>
        ) : (
          <div className="suggestion-list">
            {suggestions.map(s => (
              <div key={s.id} className="suggestion-item">
                <div className="suggestion-item__main">
                  <div className="suggestion-item__header">
                    <div>
                      <span className={`suggestion-status status-${s.status}`}>{STATUS_LABELS[s.status] || s.status}</span>
                      <h2 className="suggestion-item__name">{s.shop_name}</h2>
                    </div>
                  </div>
                  
                  <div className="suggestion-details">
                    {(s.address || s.district) && (
                      <div className="suggestion-detail suggestion-detail--wide">
                        <MapPin size={16} />
                        <span>{[s.address, s.district].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    {s.phone && (
                      <div className="suggestion-detail">
                        <Phone size={16} />
                        <span>{s.phone}</span>
                      </div>
                    )}
                    {s.opening_hours && (
                      <div className="suggestion-detail">
                        <Clock size={16} />
                        <span>{s.opening_hours}</span>
                      </div>
                    )}
                    {s.contributor_name && (
                      <div className="suggestion-detail">
                        <User size={16} />
                        <span>Người gửi: <strong>{s.contributor_name}</strong> {s.contributor_email ? `(${s.contributor_email})` : ''}</span>
                      </div>
                    )}
                    {s.reason && (
                      <div className="suggestion-detail suggestion-detail--reason">
                        <Info size={16} />
                        <span>Lý do: {s.reason}</span>
                      </div>
                    )}
                  </div>

                  {s.description && (
                   <div className="suggestion-desc">
                     <span>Mô tả</span>
                     <p>{s.description}</p>
                   </div>
                  )}
                </div>

                {s.status === 'pending' && (
                  <div className="suggestion-actions">
                    <button className="btn-approve" onClick={() => handleApprove(s.id)}>
                      <Check size={18} /> Duyệt
                    </button>
                    <button className="btn-reject" onClick={() => handleReject(s.id)}>
                      <X size={18} /> Từ chối
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSuggestions
