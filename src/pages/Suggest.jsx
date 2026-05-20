import React, { useState } from 'react'
import { submitSuggestion } from '../api'

function Suggest() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)

    // Convert structured inputs to backend format
    const openTime = formData.get('open_time')
    const closeTime = formData.get('close_time')
    if (openTime && closeTime) {
      formData.set('opening_hours', `${openTime} - ${closeTime}`)
    }
    const minPrice = formData.get('min_price')
    const maxPrice = formData.get('max_price')
    if (minPrice && maxPrice) {
      formData.set('price_range', `${Number(minPrice).toLocaleString('vi-VN')}đ - ${Number(maxPrice).toLocaleString('vi-VN')}đ`)
    }
    formData.delete('open_time')
    formData.delete('close_time')
    formData.delete('min_price')
    formData.delete('max_price')

    try {
      const response = await submitSuggestion(formData)
      if (response.ok) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const err = await response.json()
        alert(`Lỗi: ${err.detail || 'Không thể gửi đề xuất. Vui lòng thử lại sau.'}`)
      }
    } catch (error) {
      alert('Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImagePreview('')
      return
    }
    setImagePreview(URL.createObjectURL(file))
  }

  return (
    <section className="section section--suggest">
      <div className="section__inner suggest-container">
        <h1 className="section__title">Đề xuất quán mới</h1>
        <p className="section__desc">Bạn biết một quán cà phê tuyệt vời chưa có trên Danang Coffee? Hãy chia sẻ với chúng mình nhé!</p>

        {submitted ? (
          <div className="suggest-success" id="suggest-success" style={{ display: 'block', textAlign: 'center', padding: '3rem', background: '#F0F9FF', borderRadius: '12px' }}>
            <h2 style={{ color: '#0369A1', marginBottom: '1rem' }}>Cảm ơn bạn đã đóng góp!</h2>
            <p>Thông tin quán đã được gửi đến đội ngũ của chúng mình để kiểm duyệt.</p>
            <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Gửi thêm đề xuất</button>
          </div>
        ) : (
          <form className="suggest-form" id="suggest-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="form-section__title">📍 Thông tin cơ bản</h3>
              <div className="form-group">
                <label className="form-label">Tên quán cà phê *</label>
                <input type="text" name="shop_name" className="form-input" required placeholder="Ví dụ: Lumi Lab" />
              </div>
              <div className="grid grid--2">
                <div className="form-group">
                  <label className="form-label">Quận *</label>
                  <select name="district" className="form-input" required>
                    <option value="Hải Châu">Hải Châu</option>
                    <option value="Thanh Khê">Thanh Khê</option>
                    <option value="Sơn Trà">Sơn Trà</option>
                    <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                    <option value="Liên Chiểu">Liên Chiểu</option>
                    <option value="Cẩm Lệ">Cẩm Lệ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input type="text" name="phone" className="form-input" placeholder="0905..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ chi tiết *</label>
                <input type="text" name="address" className="form-input" required placeholder="Ví dụ: 99 Lê Lợi" />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">⏰ Hoạt động & Giá cả</h3>
              <div className="grid grid--2">
                <div className="form-group">
                  <label className="form-label">Giờ hoạt động *</label>
                  <div className="input-range">
                    <input type="time" name="open_time" className="form-input" required defaultValue="07:00" />
                    <span>tới</span>
                    <input type="time" name="close_time" className="form-input" required defaultValue="22:00" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mức giá trung bình *</label>
                  <div className="input-range">
                    <input type="number" name="min_price" className="form-input" required placeholder="Min" defaultValue="25000" step="1000" />
                    <span>-</span>
                    <input type="number" name="max_price" className="form-input" required placeholder="Max" defaultValue="65000" step="1000" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">📸 Hình ảnh & Mô tả</h3>
              <div className="form-group">
                <label className="form-label">Ảnh đại diện quán *</label>
                <label className={`suggest-image-upload ${imagePreview ? 'has-preview' : ''}`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Xem trước ảnh quán" />
                  ) : (
                    <span>
                      Chọn ảnh quán để tải lên Cloudinary
                      <small>JPG, PNG hoặc WEBP, tối đa 5MB</small>
                    </span>
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Giới thiệu ngắn về quán</label>
                <textarea name="description" className="form-input" rows="3" placeholder="Không gian Chill, phù hợp làm việc..."></textarea>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section__title">👤 Thông tin người đề xuất</h3>
              <div className="grid grid--2">
                <div className="form-group">
                  <label className="form-label">Tên của bạn</label>
                  <input type="text" name="contributor_name" className="form-input" placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email liên hệ</label>
                  <input type="email" name="contributor_email" className="form-input" placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tại sao bạn đề xuất quán này?</label>
                <textarea name="reason" className="form-input" rows="2" placeholder="Quán mới mở rất đẹp..."></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '2rem', padding: '16px', fontSize: '16px' }}>
              {loading ? 'Đang gửi đề xuất...' : 'Gửi đề xuất ngay'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Suggest
