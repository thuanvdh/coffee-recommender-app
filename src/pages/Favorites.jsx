import React, { useState, useEffect } from 'react';
import { getFavorites } from '../utils/favorites';
import { fetchShops } from '../api';
import ShopCard from '../components/ShopCard';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteShops = async () => {
      try {
        const favIds = getFavorites();
        if (favIds.length === 0) {
          setFavoriteShops([]);
          setLoading(false);
          return;
        }

        // Fetch all shops to filter (or in a real app, query by array of IDs)
        const data = await fetchShops({});
        const filtered = (data.shops || []).filter(shop => favIds.includes(shop.id));
        setFavoriteShops(filtered);
      } catch (err) {
        console.error('Error fetching favorites', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteShops();

    // Re-fetch when favorites change
    const onFavChange = () => fetchFavoriteShops();
    window.addEventListener('favoritesChanged', onFavChange);
    return () => window.removeEventListener('favoritesChanged', onFavChange);
  }, []);

  return (
    <main className="search-main" style={{ marginTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))', padding: '40px 24px' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <h2 className="section__title" style={{ textAlign: 'left', marginBottom: '24px' }}>❤️ Góc của tui ({favoriteShops.length})</h2>
        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : favoriteShops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>Bạn chưa thích quán nào cả! Hãy dạo quanh và chọn vài quán đi nha.</p>
            <Link to="/" className="hero__cta">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="shop-grid">
            {favoriteShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;
