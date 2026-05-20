import React, { useState, useEffect } from 'react'
import { fetchAdminSuggestions, approveSuggestion, rejectSuggestion } from '../api'
import { Check, X, Clock, MapPin, Phone, User, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('pending')
  const navigate = useNavigate()

  useEffect(() => {
    loadSuggestions()
  }, [filter])

  const loadSuggestions = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminSuggestions(filter)
      setSuggestions(data)
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
      loadSuggestions()
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
      loadSuggestions()
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
      <div className="section__inner">
        <div className="admin-header">
          <h1 className="admin-title">Quản lý Đề xuất</h1>
          <div className="admin-filters">
            <button 
              className={`admin-filter-btn ${filter === 'pending' ? 'is-active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Chờ duyệt
            </button>
            <button 
              className={`admin-filter-btn ${filter === 'approved' ? 'is-active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Đã duyệt
            </button>
            <button 
              className={`admin-filter-btn ${filter === 'rejected' ? 'is-active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Đã từ chối
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="admin-empty">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="admin-empty">Không có đề xuất nào trong danh sách.</div>
        ) : (
          <div className="suggestion-list">
            {suggestions.map(s => (
              <div key={s.id} className="suggestion-item">
                <div className="suggestion-item__main">
                  <div className="suggestion-item__header">
                    <h2 className="suggestion-item__name">{s.shop_name}</h2>
                    <span className={`suggestion-status status-${s.status}`}>{s.status}</span>
                  </div>
                  
                  <div className="suggestion-details">
                    <div className="suggestion-detail">
                      <MapPin size={16} />
                      <span>{s.address}, {s.district}</span>
                    </div>
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
                     <strong>Mô tả:</strong> {s.description}
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
