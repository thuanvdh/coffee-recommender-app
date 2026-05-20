import React, { useState, useEffect } from 'react';
import { fetchTopRatedShops } from '../api';
import ShopCard from '../components/ShopCard';
import { Link } from 'react-router-dom';

function Favorites() {
  const [topRatedShops, setTopRatedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedShops = async () => {
      try {
        setLoading(true);
        const shops = await fetchTopRatedShops(10);
        setTopRatedShops(shops);
      } catch (err) {
        console.error('Error fetching rated shops', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedShops();
  }, []);

  return (
    <main className="search-main" style={{ marginTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))', padding: '40px 24px' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <h2 className="section__title" style={{ textAlign: 'left', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏆 Top 10 quán được đánh giá cao nhất
        </h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '32px', fontSize: '1rem' }}>
          Danh sách các quán cà phê có điểm số đánh giá trung bình từ cộng đồng cao nhất tại Đà Nẵng.
        </p>

        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : topRatedShops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>Hiện chưa có đánh giá nào được ghi nhận.</p>
            <Link to="/" className="hero__cta">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="shop-grid">
            {topRatedShops.map((shop, index) => (
              <div key={shop.id} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  background: index === 0 ? 'linear-gradient(135deg, #F1C40F, #F39C12)' :
                             index === 1 ? 'linear-gradient(135deg, #BDC3C7, #95A5A6)' :
                             index === 2 ? 'linear-gradient(135deg, #E67E22, #D35400)' :
                             'var(--color-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  fontSize: index < 3 ? '1.25rem' : '0.95rem',
                  zIndex: 5,
                  border: '2.5px solid white'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <ShopCard shop={shop} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;
