import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Heart } from 'lucide-react'
import { isShopOpenNow } from '../utils/time'
import { toggleFavorite, isFavorite } from '../utils/favorites'

function ShopCard({ shop }) {
  const isOpen = isShopOpenNow(shop.opening_hours);
  const [favorite, setFavorite] = React.useState(isFavorite(shop.id));
  
  React.useEffect(() => {
    const handleFavChange = () => setFavorite(isFavorite(shop.id));
    window.addEventListener('favoritesChanged', handleFavChange);
    return () => window.removeEventListener('favoritesChanged', handleFavChange);
  }, [shop.id]);

  const reviews = shop.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
    : 0;

  let badgeText = '';
  
  if (!isOpen) {
    badgeText = 'Tạm đóng';
  } else {
    badgeText = shop.status === 'new' ? 'Mới mở' :
                   shop.status === 'closed_temp' ? 'Tạm đóng' :
                   shop.status === 'closed_permanent' ? 'Đã đóng' : '';
  }

  return (
    <Link to={`/detail?slug=${shop.slug}`} className={`shop-card ${!isOpen ? 'is-closed' : ''}`}>
      <div className="shop-card__image">
        <img src={shop.image_url || '/images/shop-1.jpg'} alt={shop.name} loading="lazy" referrerPolicy="no-referrer" />
        {badgeText && <span className={`shop-card__badge ${!isOpen ? 'shop-card__badge--closed' : ''}`}>{badgeText}</span>}
        {shop.distance_km != null && (
          <span className="shop-card__distance">
            📍 {(Math.round(shop.distance_km * 10) / 10).toFixed(1)} km
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(shop.id);
            setFavorite(!favorite);
          }}
          className={`shop-card__action-btn ${favorite ? 'shop-card__action-btn--active' : 'shop-card__action-btn--inactive'}`}
          title={favorite ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
        >
          <Heart size={16} fill={favorite ? '#e74c3c' : 'none'} />
        </button>
        <button 
          className="shop-card__map-link"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} Đà Nẵng`)}`;
            window.open(mapUrl, '_blank');
          }}
          title="Xem vị trí trên Google Maps"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </button>
      </div>
      <div className="shop-card__info">
        <div className="shop-card__name line-clamp-2" title={shop.name}>{shop.name}</div>
        {reviewCount > 0 ? (
          <div className="shop-card__rating">
            <span className="shop-card__rating-stars">★ {avgRating.toFixed(1)}</span>
            <span className="shop-card__rating-count">({reviewCount} nhận xét)</span>
          </div>
        ) : (
          <div className="shop-card__rating shop-card__rating--empty">
            <span>★ Chưa có đánh giá</span>
          </div>
        )}
        {(shop.opening_hours) ? (
          <div className="shop-card__time">
            <Clock size={12} />
            <span>{shop.opening_hours}</span>
          </div>
        ) : (
          <div className="shop-card__time shop-card__time--empty">
            <Clock size={12} />
            <span>Chưa cập nhật giờ</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export function CTACard({ text }) {
  return (
    <div className="shop-card shop-card--cta">
      <div className="shop-card__image">
        <div className="cta-card-content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <p>{text}</p>
        </div>
      </div>
      <div className="shop-card__name">{text}</div>
    </div>
  )
}

export function ShopCardSkeleton() {
  return (
    <div className="shop-card shop-card--skeleton" style={{ cursor: 'default' }}>
      <div className="shop-card__image skeleton-pulse"></div>
      <div className="shop-card__info">
        <div className="shop-card__name skeleton-pulse skeleton-text" style={{ width: '80%', height: '20px', marginBottom: '12px' }}></div>
        <div className="shop-card__time skeleton-pulse skeleton-text" style={{ width: '50%', height: '14px' }}></div>
      </div>
    </div>
  )
}

export default ShopCard
