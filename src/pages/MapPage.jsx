import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchShops } from '../api';

// Fix leaflet icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPage() {
  const [shops, setShops] = useState([]);
  const danangCenter = [16.0544, 108.2022];

  useEffect(() => {
    const fetchShopsData = async () => {
      try {
        const data = await fetchShops({});
        setShops(data.shops || []);
      } catch (err) {
        console.error('Error fetching shops for map', err);
      }
    };
    fetchShopsData();
  }, []);

  return (
    <div style={{ marginTop: 'var(--header-height)', height: 'calc(100vh - var(--header-height))', width: '100%' }}>
      <MapContainer center={danangCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shops.filter(s => s.latitude && s.longitude).map(shop => (
            <Marker key={shop.id} position={[shop.latitude, shop.longitude]}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <img src={shop.image_url || '/images/shop-1.jpg'} alt={shop.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} referrerPolicy="no-referrer" />
                  <h4 style={{ margin: '8px 0 4px', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{shop.name}</h4>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--color-text-light)', lineHeight: '1.4' }}>{shop.address || shop.district}</p>
                  <Link to={`/detail?slug=${shop.slug}`} style={{ display: 'inline-block', background: 'var(--color-accent)', color: '#fff', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                    Xem chi tiết
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}

export default MapPage;
