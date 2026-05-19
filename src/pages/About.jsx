import React from 'react'

function About() {
  return (
    <>
      <section className="section">
        <div className="section__inner">
          <h1 className="section__title">Về Danang Coffee</h1>
          <p className="section__desc">Dự án cộng đồng nhằm tôn vinh và chia sẻ những giá trị văn hóa cà phê độc đáo tại thành phố Đà Nẵng.</p>
          
          <div className="about-grid">
            <div className="about-content">
              <h2 style={{ marginBottom: '1.5rem', color: '#2C3E50' }}>Sứ mệnh của chúng mình</h2>
              <p style={{ marginBottom: '1rem', color: '#5A6C7D' }}>Đà Nẵng không chỉ có biển và núi, mà còn là nơi hội tụ của hàng trăm quán cà phê với đủ mọi phong cách từ hoài cổ, hiện đại đến những góc nhỏ ẩn mình.</p>
              <p style={{ marginBottom: '1rem', color: '#5A6C7D' }}>Chúng mình tạo ra Danang Coffee để giúp bạn dễ dàng tìm thấy "quán ruột" của mình, dù bạn cần không gian để làm việc hiệu quả hay một góc chill cùng bạn bè.</p>
            </div>
            <div className="about-image">
              <img src="/images/shop-2.jpg" alt="About Us" style={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F5F8FB' }}>
        <div className="section__inner" style={{ textAlign: 'center' }}>
          <h2 className="section__title">Tại sao chọn Danang Coffee?</h2>
          <div className="about-features">
            <div className="feature-card">
              <h3 style={{ marginBottom: '1rem' }}>Thông tin chính xác</h3>
              <p style={{ fontSize: '14px', color: '#5A6C7D' }}>Dữ liệu được cập nhật thường xuyên về giờ mở cửa, giá cả và tiện ích.</p>
            </div>
            <div className="feature-card">
              <h3 style={{ marginBottom: '1rem' }}>Tìm kiếm thông minh</h3>
              <p style={{ fontSize: '14px', color: '#5A6C7D' }}>Bộ lọc đa dạng giúp bạn tìm quán theo mục đích sử dụng và phong cách không gian.</p>
            </div>
            <div className="feature-card">
              <h3 style={{ marginBottom: '1rem' }}>Cộng đồng đóng góp</h3>
              <p style={{ fontSize: '14px', color: '#5A6C7D' }}>Mọi người đều có thể gửi đề xuất quán mới để làm phong phú thêm cẩm nang.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
