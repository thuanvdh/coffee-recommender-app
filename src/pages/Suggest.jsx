import React, { useState } from 'react'
import { submitSuggestion } from '../api'
import { Camera, CheckCircle2, Clock, ImagePlus, MapPin, Send, UserRound } from 'lucide-react'

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
      <div className="suggest-container">
        {submitted ? (
          <div className="suggest-success" id="suggest-success">
            <CheckCircle2 size={48} />
            <h2>Cảm ơn bạn đã đóng góp!</h2>
            <p>Thông tin quán đã được gửi đến đội ngũ của chúng mình để kiểm duyệt.</p>
            <button className="btn-primary" onClick={() => setSubmitted(false)}>Gửi thêm đề xuất</button>
          </div>
        ) : (
          <div className="suggest-layout">
            <aside className="suggest-intro">
              <p className="suggest-kicker">Đóng góp cộng đồng</p>
              <h1>Đề xuất quán cà phê mới</h1>
              <p>
                Gửi thông tin quán bạn yêu thích kèm ảnh đại diện. Ảnh sẽ được tải lên Cloudinary,
                sau đó admin kiểm duyệt trước khi quán xuất hiện trên hệ thống.
              </p>
              <div className="suggest-flow">
                <div><Camera size={18} /><span>Upload ảnh thật của quán</span></div>
                <div><MapPin size={18} /><span>Điền địa chỉ và khu vực</span></div>
                <div><Send size={18} /><span>Gửi để admin duyệt</span></div>
              </div>
            </aside>

            <form className="suggest-form" id="suggest-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-section__heading">
                  <MapPin size={20} />
                  <h3>Thông tin cơ bản</h3>
                </div>
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
                <div className="form-section__heading">
                  <Clock size={20} />
                  <h3>Hoạt động & Giá cả</h3>
                </div>
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

              <div className="form-section form-section--media">
                <div className="form-section__heading">
                  <ImagePlus size={20} />
                  <h3>Hình ảnh & Mô tả</h3>
                </div>
                <div className="form-group">
                  <label className="form-label">Ảnh đại diện quán *</label>
                  <label className={`suggest-image-upload ${imagePreview ? 'has-preview' : ''}`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Xem trước ảnh quán" />
                    ) : (
                      <span>
                        <ImagePlus size={32} />
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
                  <textarea name="description" className="form-input" rows="4" placeholder="Không gian chill, phù hợp làm việc, có đồ uống nổi bật..."></textarea>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section__heading">
                  <UserRound size={20} />
                  <h3>Thông tin người đề xuất</h3>
                </div>
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
                  <textarea name="reason" className="form-input" rows="3" placeholder="Quán mới mở rất đẹp, không gian hợp làm việc, đồ uống ổn..."></textarea>
                </div>
              </div>

              <div className="suggest-submit-bar">
                <p>Ảnh sẽ được upload lên Cloudinary và lưu URL khi bạn gửi đề xuất.</p>
                <button type="submit" className="btn-primary suggest-submit-btn" disabled={loading}>
                  {loading ? 'Đang gửi đề xuất...' : 'Gửi đề xuất ngay'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default Suggest
