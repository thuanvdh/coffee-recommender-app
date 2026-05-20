import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchFilters, fetchShops } from '../api'
import ShopCard, { ShopCardSkeleton } from '../components/ShopCard'
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Coffee, 
  Heart, 
  Sun, 
  CloudRain, 
  Cloud, 
  Navigation,
  CheckCircle,
  HelpCircle
} from 'lucide-react'

function Home() {
  const [filters, setFilters] = useState(null)
  const [newShops, setNewShops] = useState([])
  const [loadingNewShops, setLoadingNewShops] = useState(true)
  const [weather, setWeather] = useState(null)
  const [weatherDesc, setWeatherDesc] = useState("")
  const [suggestionLink, setSuggestionLink] = useState("/search")
  const [geoError, setGeoError] = useState("")
  
  // Surprise Me shuffling state
  const [shuffling, setShuffling] = useState(false)
  const [shuffledName, setShuffledName] = useState("")
  
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
            setSuggestionLink("/search?space=Trong+nhà");
          } else if (w.temperature > 30) {
            setWeatherDesc("Trời khá oi nóng ☀️ - Trốn nắng ở phòng máy lạnh thôi!");
            setSuggestionLink("/search?amenity=Máy+lạnh");
          } else {
            setWeatherDesc("Thời tiết rất đẹp ⛅ - Lên sân thượng ngắm phố nào!");
            setSuggestionLink("/search?space=Sân+thượng");
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
    if (shuffling) return;
    setShuffling(true);
    setShuffledName("Đang lắc xí ngầu...");

    const data = await fetchShops({ limit: 100 });
    if (data && data.shops && data.shops.length > 0) {
      const shops = data.shops;
      let count = 0;
      const interval = setInterval(() => {
        const tempShop = shops[Math.floor(Math.random() * shops.length)];
        setShuffledName(tempShop.name);
        count++;
        
        if (count > 10) {
          clearInterval(interval);
          const finalShop = shops[Math.floor(Math.random() * shops.length)];
          setShuffledName(finalShop.name);
          setTimeout(() => {
            navigate(`/detail?slug=${finalShop.slug}`);
            setShuffling(false);
          }, 300);
        }
      }, 100);
    } else {
      setShuffling(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (!code) return <Sun size={24} className="text-accent" />;
    if (code >= 51 && code <= 67) return <CloudRain size={24} color="var(--color-skyline)" />;
    if (code >= 1 && code <= 3) return <Cloud size={24} color="var(--color-text-light)" />;
    return <Sun size={24} color="var(--color-accent)" />;
  };

  return (
    <>
      <section className="hero fade-in-element">
        <div className="hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">Cafe là văn hóa</h1>
            <h2 className="hero__subtitle">Khám phá góc nhỏ tuyệt vời tại Đà Nẵng</h2>
            <p className="hero__desc">
              Tổng hợp những quán cà phê có không gian đẹp nhất, cà phê ngon nhất và trải nghiệm tuyệt nhất tại thành phố biển Đà Nẵng.
            </p>
            
            <div className="hero__buttons">
              <Link to="/search" className="hero__cta">
                <Compass size={18} style={{ marginRight: '8px' }} /> Khám phá ngay
              </Link>
              
              <button 
                onClick={handleSurpriseMe} 
                className={`hero__cta hero__cta--secondary ${shuffling ? 'is-shuffling' : ''}`}
                disabled={shuffling}
              >
                <Sparkles size={18} style={{ marginRight: '8px', color: 'var(--color-accent)' }} /> 
                {shuffling ? shuffledName : "Bốc Thăm Quán Ngẫu Nhiên"}
              </button>

              <button 
                onClick={handleNearMe} 
                className="hero__cta hero__cta--secondary"
                title="Tìm quán cà phê gần bạn nhất bằng GPS"
              >
                <Navigation size={18} style={{ marginRight: '8px', color: 'var(--color-skyline)' }} /> Tìm Gần Đây
              </button>
            </div>
            
            {geoError && (
              <p style={{ marginTop: '12px', color: '#b91c1c', fontWeight: 600, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚠️ {geoError}
              </p>
            )}

            {weather && (
              <div className="weather-widget">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getWeatherIcon(weather.weathercode)}
                  <div>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {weather.temperature}°C
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-light)', marginLeft: '6px' }}>
                      Đà Nẵng hôm nay
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
                  {weatherDesc} <Link to={suggestionLink} style={{ color: 'var(--color-skyline)', fontWeight: '600', textDecoration: 'underline', marginLeft: '4px' }}>Khám phá &rarr;</Link>
                </p>
              </div>
            )}
          </div>
          
          <div className="hero__image">
            <img src="/images/hero-illustration.png" alt="Coffee Illustration" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* ========== MOOD / QUICK QUIZ SECTION ========== */}
      <section className="mood-explorer section fade-in-element">
        <div className="section__inner">
          <h2 className="section__title">Hôm nay bạn cần không gian thế nào?</h2>
          <p className="section__desc">Chọn một phong cách phù hợp với tâm trạng hoặc mục đích để chúng mình gợi ý quán chuẩn gu nhất nhé.</p>
          
          <div className="mood-grid">
            <Link to="/search?purpose=Ngồi+làm+việc&amenity=Máy+lạnh" className="mood-card">
              <div className="mood-card__icon">
                <Coffee size={26} />
              </div>
              <h3 className="mood-card__title">Học bài & Làm việc</h3>
              <p className="mood-card__desc">Yên tĩnh, máy lạnh mát rượi, wifi tốc độ cao và ngập tràn ổ cắm sạc pin.</p>
            </Link>

            <Link to="/search?purpose=Không+gian+riêng+tư&space=Trong+nhà" className="mood-card">
              <div className="mood-card__icon">
                <Heart size={26} />
              </div>
              <h3 className="mood-card__title">Hẹn hò lãng mạn</h3>
              <p className="mood-card__desc">Góc ngồi riêng tư, âm nhạc nhẹ nhàng, ánh sáng ấm cúng và đầy lãng mạn.</p>
            </Link>

            <Link to="/search?purpose=Tụ+tập+bạn+bè&space=Ngoài+trời" className="mood-card">
              <div className="mood-card__icon">
                <Compass size={26} />
              </div>
              <h3 className="mood-card__title">Tụ tập bạn bè</h3>
              <p className="mood-card__desc">Không gian ngoài trời, thoáng đãng, vỉa hè rộng rãi để tán gẫu thâu đêm.</p>
            </Link>

            <Link to="/search?space=View+hoàng+hôn" className="mood-card">
              <div className="mood-card__icon">
                <Sparkles size={26} />
              </div>
              <h3 className="mood-card__title">Check-in sống ảo</h3>
              <p className="mood-card__desc">Quán decor xinh xắn, view sông biển đắc địa, ngập tràn góc chụp triệu like.</p>
            </Link>
          </div>
        </div>
      </section>

      {(loadingNewShops || newShops.length > 0) && (
        <section className="section section--new" style={{ background: 'var(--color-bg-section)' }}>
          <div className="section__inner">
            <div className="section-header">
              <div className="section-header__title-block">
                <h2 className="section-header__title fade-in-element">Quán mới mở</h2>
                <p className="section-header__desc fade-in-element">Những địa điểm cà phê nóng hổi vừa gia nhập Đà Nẵng.</p>
              </div>
              <Link to="/search?status=new" className="section-header__link fade-in-element">
                Xem tất cả &rarr;
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
            {filters?.districts?.map(d => (
              <Link key={d} to={`/search?district=${encodeURIComponent(d)}`} className="district-card">
                <MapPin size={18} style={{ marginBottom: '8px', color: 'var(--color-skyline)' }} />
                <span>{d}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--purpose">
        <div className="purpose__bg" style={{ backgroundImage: "url('/images/coffee-shop-bg.jpg')" }}></div>
        <div className="purpose__overlay"></div>
        <div className="purpose__glass-box fade-in-element">
          <h2 className="section__title section__title--light" style={{ marginBottom: '12px' }}>Phong cách & Mục đích</h2>
          <p className="section__desc section__desc--light" style={{ marginBottom: '24px' }}>Bạn đang tìm kiếm không gian cho buổi họp học, học bài hay một góc yên tĩnh? Chúng mình có đủ!</p>
          <div className="tag-grid">
            {filters?.purposes?.map(p => (
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
            {filters?.spaces?.map(s => (
              <Link key={s} to={`/search?space=${encodeURIComponent(s)}`} className="district-card">
                <Compass size={18} style={{ marginBottom: '8px', color: 'var(--color-accent)' }} />
                <span>{s}</span>
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
