import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchFilters, fetchShops } from '../api'
import ShopCard, { ShopCardSkeleton } from '../components/ShopCard'

function Home() {
  const [filters, setFilters] = useState(null)
  const [newShops, setNewShops] = useState([])
  const [loadingNewShops, setLoadingNewShops] = useState(true)
  const [weather, setWeather] = useState(null)
  const [weatherDesc, setWeatherDesc] = useState("")
  const [suggestionLink, setSuggestionLink] = useState("/search")
  const [geoError, setGeoError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchFilters().then(setFilters)
    setLoadingNewShops(true)
    fetchShops({ status: 'new', limit: 4 }).then(data => {
      if (data && data.shops) setNewShops(data.shops);
      setLoadingNewShops(false)
    });

    // Fetch Weather from Open-Meteo for Da Nang
    fetch('https://api.open-meteo.com/v1/forecast?latitude=16.0544&longitude=108.2022&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          const w = data.current_weather;
          setWeather(w);
          if (w.weathercode >= 51 && w.weathercode <= 67) {
            setWeatherDesc("Trời đang mưa 🌧️ - Tìm quán có mái che nhé!");
            setSuggestionLink("/search?space=Máy+lạnh");
          } else if (w.temperature > 30) {
            setWeatherDesc("Trời khá oi nóng ☀️ - Trốn nắng ở phòng máy lạnh thôi!");
            setSuggestionLink("/search?space=Máy+lạnh");
          } else {
            setWeatherDesc("Thời tiết rất đẹp ⛅ - Lên sân thượng ngắm phố nào!");
            setSuggestionLink("/search?space=Thoáng+đãng");
          }
        }
      }).catch(err => console.log('Weather err', err));
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filters]);

  const handleNearMe = () => {
    setGeoError("")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          navigate(`/search?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        },
        (error) => {
          setGeoError("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí cho trình duyệt.");
        }
      );
    } else {
      setGeoError("Trình duyệt của bạn không hỗ trợ định vị GPS.");
    }
  };

  const handleSurpriseMe = async () => {
    const data = await fetchShops({ limit: 100 });
    if (data && data.shops && data.shops.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.shops.length);
      const randomShop = data.shops[randomIndex];
      navigate(`/detail?slug=${randomShop.slug}`);
    }
  };

  return (
    <>
      <section className="hero fade-in-element">
        <div className="hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">Cafe là văn hóa</h1>
            <h2 className="hero__subtitle">Khám phá góc nhỏ tuyệt vời tại Đà Nẵng</h2>
            <p className="hero__desc">Tổng hợp những quán cà phê có không gian đẹp nhất, cà phê ngon nhất và trải nghiệm tuyệt nhất tại thành phố biển.</p>
            <div className="hero__buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link to="/search" className="hero__cta">Khám phá ngay</Link>
              <button 
                onClick={handleSurpriseMe} 
                className="hero__cta" 
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎲 Bốc Thăm Quán
              </button>
            </div>
            {geoError && (
              <p style={{ marginTop: '12px', color: '#b91c1c', fontWeight: 600, fontSize: '0.92rem' }}>
                {geoError}
              </p>
            )}
            {weather && (
              <div className="weather-widget" style={{ marginTop: '20px', padding: '12px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', display: 'inline-block', backdropFilter: 'blur(10px)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{weather.temperature}°C</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>- TP. Đà Nẵng</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
                  {weatherDesc} <Link to={suggestionLink} style={{ color: 'var(--color-skyline)', textDecoration: 'underline' }}>Gợi ý cho bạn &rarr;</Link>
                </p>
              </div>
            )}
          </div>
          <div className="hero__image">
            <img src="/images/hero-illustration.png" alt="Coffee Illustration" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {(loadingNewShops || newShops.length > 0) && (
        <section className="section section--new">
          <div className="section__inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h2 className="section__title fade-in-element" style={{ marginBottom: '0.5rem' }}>Quán mới mở</h2>
                <p className="section__desc fade-in-element" style={{ marginBottom: 0 }}>Những địa điểm cà phê nóng hổi vừa gia nhập Đà Nẵng.</p>
              </div>
              <Link to="/search?status=new" className="btn-secondary fade-in-element" style={{ textDecoration: 'none' }}>
                Xem tất cả
              </Link>
            </div>
            <div className="card-grid card-grid--4 fade-in-element">
              {loadingNewShops ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ShopCardSkeleton key={idx} />
                ))
              ) : (
                newShops.map(shop => (
                  <ShopCard key={shop.id} shop={shop} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section section--districts">
        <div className="section__inner">
          <h2 className="section__title fade-in-element">Tìm kiếm theo khu vực</h2>
          <p className="section__desc fade-in-element">Chọn quận bạn muốn khám phá để tìm thấy những quán gần bạn nhất.</p>
          <div className="card-grid card-grid--6 fade-in-element">
            {filters?.districts.map(d => (
              <Link key={d} to={`/search?district=${encodeURIComponent(d)}`} className="district-card">
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--purpose">
        <div className="purpose__bg" style={{ backgroundImage: "url('/images/coffee-shop-bg.jpg')" }}></div>
        <div className="purpose__overlay"></div>
        <div className="section__inner purpose__content">
          <h2 className="section__title section__title--light fade-in-element">Phong cách & Mục đích</h2>
          <p className="section__desc section__desc--light fade-in-element">Bạn đang tìm kiếm không gian cho buổi họp, học bài hay một góc yên tĩnh? Chúng mình có đủ!</p>
          <div className="tag-grid fade-in-element">
            {filters?.purposes.map(p => (
              <Link key={p} to={`/search?purpose=${encodeURIComponent(p)}`} className="tag-pill">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--space">
        <div className="section__inner">
          <h2 className="section__title fade-in-element">Không gian yêu thích</h2>
          <p className="section__desc fade-in-element">Sân thượng ngắm hoàng hôn hay không gian máy lạnh yên tĩnh?</p>
          <div className="card-grid card-grid--5 fade-in-element">
            {filters?.spaces.map(s => (
              <Link key={s} to={`/search?space=${encodeURIComponent(s)}`} className="district-card">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="skyline">
        <img src="/images/skyline.png" alt="Danang Skyline" referrerPolicy="no-referrer" />
      </div>
    </>
  )
}

export default Home
