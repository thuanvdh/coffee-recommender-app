import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Clock, CreditCard, Phone, MessageSquare, Flame, Star, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchShopBySlug, submitReview } from '../api'

function Detail() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(null)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [reviewNotice, setReviewNotice] = useState(null)
  const thumbsRef = useRef(null)

  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.querySelector('.gallery-thumb--active');
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeImg]);

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1: return 'Tồi tệ 😞';
      case 2: return 'Tạm ổn 😐';
      case 3: return 'Khá tốt 🙂';
      case 4: return 'Rất tốt 😀';
      case 5: return 'Tuyệt vời! 😍';
      default: return '';
    }
  }

  const getInitial = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 0) {
      return parts[parts.length - 1].charAt(0).toUpperCase();
    }
    return 'U';
  }


  useEffect(() => {
    if (slug) {
      setLoading(true)
      fetchShopBySlug(slug).then(data => {
        setShop(data)
        setLoading(false)
        if (data) {
          document.title = `${data.name} - Danang Coffee`
          setActiveImg(data.image_url)
        }
      })
    }
  }, [slug])

  const allImages = shop
    ? [shop.image_url, ...(shop.images || []).map((img) => img.url)].filter(Boolean)
    : [];

  const handlePrevImg = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg || shop.image_url);
    const prevIdx = (currentIdx - 1 + allImages.length) % allImages.length;
    setActiveImg(allImages[prevIdx]);
  };

  const handleNextImg = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg || shop.image_url);
    const nextIdx = (currentIdx + 1) % allImages.length;
    setActiveImg(allImages[nextIdx]);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userName = newReview.user_name.trim();
    const comment = newReview.comment.trim();

    if (!userName || !comment) {
      setReviewNotice({
        type: 'error',
        message: 'Vui lòng nhập tên và nội dung đánh giá.'
      });
      return;
    }

    setReviewNotice(null);
    setSubmitting(true);
    try {
      const addedReview = await submitReview(shop.id, {
        ...newReview,
        user_name: userName,
        comment
      });
      setShop({
        ...shop,
        reviews: [addedReview, ...(shop.reviews || [])]
      });
      setNewReview({ user_name: '', rating: 5, comment: '' });
      setReviewNotice({
        type: 'success',
        message: 'Cảm ơn bạn đã gửi nhận xét.'
      });
    } catch (err) {
      setReviewNotice({
        type: 'error',
        message: 'Có lỗi xảy ra khi gửi nhận xét. Vui lòng thử lại.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="detail-state">Đang tải thông tin quán...</div>
  if (!shop) return <div className="detail-state">Không tìm thấy thông tin quán.</div>

  const badgeText = shop.status === 'new' ? 'Mới mở' :
                    shop.status === 'closed_temp' ? 'Tạm đóng' :
                    shop.status === 'closed_permanent' ? 'Đã đóng' : '';

  return (
    <article className="shop-detail">
      <div className="shop-detail__main">
        <div className="shop-detail__gallery-v2">
          <div className="gallery-main">
            <img src={activeImg || shop.image_url || '/images/shop-1.jpg'} alt={shop.name} className="gallery-main__img" referrerPolicy="no-referrer" />
            {allImages.length > 1 && (
              <>
                <button 
                  className="gallery-nav-btn gallery-nav-btn--prev" 
                  onClick={handlePrevImg}
                  aria-label="Ảnh trước"
                  type="button"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="gallery-nav-btn gallery-nav-btn--next" 
                  onClick={handleNextImg}
                  aria-label="Ảnh sau"
                  type="button"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {shop.images && shop.images.length > 0 && (
            <div className="gallery-thumbs" ref={thumbsRef}>
              <div 
                className={`gallery-thumb ${activeImg === shop.image_url ? 'gallery-thumb--active' : ''}`}
                onClick={() => setActiveImg(shop.image_url)}
              >
                <img src={shop.image_url} alt="Main" referrerPolicy="no-referrer" />
              </div>
              {shop.images.map((img) => (
                <div 
                  key={img.id} 
                  className={`gallery-thumb ${activeImg === img.url ? 'gallery-thumb--active' : ''}`}
                  onClick={() => setActiveImg(img.url)}
                >
                  <img src={img.url} alt={img.alt_text} referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="shop-detail__info">
          <div className="shop-detail__header">
            <h1 className="shop-detail__title">{shop.name}</h1>
            {badgeText && (
              <span className={`shop-detail__status ${shop.status === 'active' ? 'shop-detail__status--active' : ''}`}>
                {badgeText}
              </span>
            )}
          </div>
          
          <a 
            href={shop.latitude && shop.longitude 
              ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || ''} Đà Nẵng`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-detail__address"
          >
            <MapPin size={20} />
            <span>{shop.address ? `${shop.address}, ` : ''}{shop.district}, Đà Nẵng</span>
          </a>

          <div className="shop-detail__section">
            <h2 className="shop-detail__section-title">Giới thiệu</h2>
            <p className="shop-detail__desc">{shop.description || 'Chưa có mô tả cho quán này.'}</p>
          </div>

          <div className="shop-detail__section">
            <h2 className="shop-detail__section-title">Tiện ích & Không gian</h2>
            <div className="shop-detail__tags">
              {shop.purposes.map(p => <span key={p} className="shop-detail__tag">{p}</span>)}
              {shop.spaces.map(s => <span key={s} className="shop-detail__tag">{s}</span>)}
              {shop.amenities.map(a => <span key={a} className="shop-detail__tag">{a}</span>)}
            </div>
          </div>

          {shop.drinks && shop.drinks.length > 0 && (
            <div className="shop-detail__menu-container">
              {/* Nước uống Section */}
              {shop.drinks.some(d => d.category === 'drink') && (
                <div className="shop-detail__section">
                  <div className="shop-detail__section-header">
                    <h2 className="shop-detail__section-title">Menu / Đồ uống nổi bật</h2>
                    <div className="menu-legend">
                      <span className="legend-item"><Star size={12} className="icon--signature" /> Món đặc trưng</span>
                      <span className="legend-item"><Flame size={12} className="icon--trending" /> Bán chạy</span>
                    </div>
                  </div>
                  <div className="shop-detail__menu">
                    {[...shop.drinks]
                      .filter(d => d.category === 'drink')
                      .sort((a, b) => {
                        if (a.is_signature && !b.is_signature) return -1;
                        if (!a.is_signature && b.is_signature) return 1;
                        if (a.is_trending && !b.is_trending) return -1;
                        if (!a.is_trending && b.is_trending) return 1;
                        return 0;
                      })
                      .map((drink, index) => (
                        <div key={index} className="menu-item">
                          <div className="menu-item__left">
                            <span className="menu-item__name">{drink.name}</span>
                            <div className="menu-item__badges">
                              {drink.is_signature && (
                                <span className="drink-badge drink-badge--signature">
                                  <Star size={10} fill="currentColor" /> Signature
                                </span>
                              )}
                              {drink.is_trending && (
                                <span className="drink-badge drink-badge--trending">
                                  <Flame size={10} fill="currentColor" /> Hot Trend
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="menu-item__price">{drink.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Bánh ngọt Section */}
              {shop.drinks.some(d => d.category === 'pastry') && (
                <div className="shop-detail__section">
                  <div className="shop-detail__section-header">
                    <h2 className="shop-detail__section-title">Bánh ngọt & Đồ ăn nhẹ</h2>
                  </div>
                  <div className="shop-detail__menu">
                    {[...shop.drinks]
                      .filter(d => d.category === 'pastry')
                      .sort((a, b) => {
                        if (a.is_signature && !b.is_signature) return -1;
                        if (!a.is_signature && b.is_signature) return 1;
                        if (a.is_trending && !b.is_trending) return -1;
                        if (!a.is_trending && b.is_trending) return 1;
                        return 0;
                      })
                      .map((pastry, index) => (
                        <div key={index} className="menu-item">
                          <div className="menu-item__left">
                            <span className="menu-item__name">{pastry.name}</span>
                            <div className="menu-item__badges">
                              {pastry.is_signature && (
                                <span className="drink-badge drink-badge--signature">
                                  <Star size={10} fill="currentColor" /> Signature
                                </span>
                              )}
                              {pastry.is_trending && (
                                <span className="drink-badge drink-badge--trending">
                                  <Flame size={10} fill="currentColor" /> Hot Trend
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="menu-item__price">{pastry.price}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="shop-detail__section shop-detail__reviews">
            <h2 className="shop-detail__section-title">Nhận xét từ cộng đồng ({shop.reviews?.length || 0})</h2>
            
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form__header-block">
                <h3 className="review-form__title">Gửi nhận xét của bạn</h3>
                <p className="review-form__subtitle">Trải nghiệm của bạn sẽ giúp cộng đồng những người yêu cà phê tìm được quán ưng ý nhất.</p>
              </div>

              {reviewNotice && (
                <div className={`review-form__notice review-form__notice--${reviewNotice.type}`} role="status">
                  {reviewNotice.message}
                </div>
              )}

              <div className="review-form__fields">
                <div className="review-form__group">
                  <label htmlFor="reviewer-name" className="review-form__label">Tên của bạn</label>
                  <input 
                    id="reviewer-name"
                    type="text" 
                    placeholder="Nhập tên hiển thị..." 
                    value={newReview.user_name}
                    onChange={(e) => {
                      setNewReview({...newReview, user_name: e.target.value});
                      if (reviewNotice?.type === 'error') setReviewNotice(null);
                    }}
                    className="review-form__input"
                  />
                </div>
                
                <div className="review-form__group">
                  <label className="review-form__label">Đánh giá của bạn</label>
                  <div className="review-form__rating-wrapper">
                    <div className="review-form__rating">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isLit = star <= (hoverRating || newReview.rating);
                        return (
                          <Star 
                            key={star} 
                            size={22} 
                            fill={isLit ? "var(--color-accent)" : "none"}
                            color={isLit ? "var(--color-accent)" : "var(--color-border)"}
                            onClick={() => setNewReview({...newReview, rating: star})}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="review-form__star"
                          />
                        );
                      })}
                    </div>
                    <span className="review-form__rating-desc">
                      {getRatingLabel(hoverRating || newReview.rating)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-form__group">
                <label htmlFor="reviewer-comment" className="review-form__label">Nội dung nhận xét</label>
                <textarea 
                  id="reviewer-comment"
                  placeholder="Chia sẻ trải nghiệm của bạn (ví dụ: Không gian rộng rãi, đồ uống ngon đặc sắc, phục vụ chu đáo...)" 
                  value={newReview.comment}
                  onChange={(e) => {
                    setNewReview({...newReview, comment: e.target.value});
                    if (reviewNotice?.type === 'error') setReviewNotice(null);
                  }}
                  className="review-form__textarea"
                ></textarea>
              </div>

              <button type="submit" className="review-form__submit btn-primary" disabled={submitting}>
                <Send size={16} /> 
                <span>{submitting ? 'Đang gửi nhận xét...' : 'Gửi nhận xét ngay'}</span>
              </button>
            </form>

            <div className="reviews-list">
              {shop.reviews && shop.reviews.length > 0 ? (
                shop.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-item__meta">
                      <div className="review-item__avatar">
                        {getInitial(review.user_name)}
                      </div>
                      <div className="review-item__meta-text">
                        <span className="review-item__user">{review.user_name}</span>
                        <span className="review-item__date">{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="review-item__rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= review.rating ? "var(--color-accent)" : "none"} 
                            color={star <= review.rating ? "var(--color-accent)" : "var(--color-border)"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-item__comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="reviews-empty">
                  <p>Chưa có nhận xét nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="shop-sidebar">
        <div className="widget">
          <h3 className="widget__title">Thông tin cơ bản</h3>
          <div className="widget__item">
            <div className="widget__icon"><Clock size={20} /></div>
            <div>
              <div className="widget__label">Giờ mở cửa</div>
              <div className="widget__value">{shop.opening_hours || 'Chưa cập nhật'}</div>
            </div>
          </div>
          <div className="widget__item">
            <div className="widget__icon"><CreditCard size={20} /></div>
            <div>
              <div className="widget__label">Giá khoảng</div>
              <div className="widget__value">{shop.price_range || 'Chưa cập nhật'}</div>
            </div>
          </div>
          <div className="widget__item">
            <div className="widget__icon"><Phone size={20} /></div>
            <div>
              <div className="widget__label">Số điện thoại</div>
              <div className="widget__value">{shop.phone || 'Chưa cập nhật'}</div>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3 className="widget__title">Hành động</h3>
          <div className="widget__actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a 
              href={shop.latitude && shop.longitude 
                ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || ''} Đà Nẵng`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <MapPin size={20} />
              Chỉ đường
            </a>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <MessageSquare size={20} />
              Gửi nhận xét
            </button>
          </div>
        </div>
      </aside>
    </article>
  )
}

export default Detail
