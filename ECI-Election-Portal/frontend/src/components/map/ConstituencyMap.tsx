import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Search, Filter, Info, Users, BarChart3, TrendingUp } from 'lucide-react';
import './ConstituencyMap.css';
import Skeleton from '../common/Skeleton';


// Fix for Leaflet default icon issues in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SAMPLE_CONSTITUENCIES = [
  // ... (keeping existing sample data)
  { id: '1', name: 'New Delhi', state: 'Delhi', phase: 6, mp: 'Meenakshi Lekhi', turnout: '60.5%', lat: 28.6139, lng: 77.2090 },
  { id: '2', name: 'Lucknow', state: 'Uttar Pradesh', phase: 5, mp: 'Rajnath Singh', turnout: '54.7%', lat: 26.8467, lng: 80.9462 },
  { id: '3', name: 'Varanasi', state: 'Uttar Pradesh', phase: 7, mp: 'Narendra Modi', turnout: '57.1%', lat: 25.3176, lng: 82.9739 },
  { id: '4', name: 'Mumbai North', state: 'Maharashtra', phase: 5, mp: 'Gopal Shetty', turnout: '60.1%', lat: 19.0760, lng: 72.8777 },
  { id: '5', name: 'Bangalore South', state: 'Karnataka', phase: 2, mp: 'Tejasvi Surya', turnout: '53.7%', lat: 12.9716, lng: 77.5946 },
  { id: '6', name: 'Chennai Central', state: 'Tamil Nadu', phase: 4, mp: 'Dayanidhi Maran', turnout: '58.9%', lat: 13.0827, lng: 80.2707 },
  { id: '7', name: 'Kolkata Dakshin', state: 'West Bengal', phase: 4, mp: 'Mala Roy', turnout: '65.2%', lat: 22.5726, lng: 88.3639 },
  { id: '8', name: 'Ahmedabad West', state: 'Gujarat', phase: 3, mp: 'Kirit Solanki', turnout: '62.8%', lat: 23.0225, lng: 72.5714 },
  { id: '9', name: 'Hyderabad', state: 'Telangana', phase: 4, mp: 'Asaduddin Owaisi', turnout: '46.1%', lat: 17.3850, lng: 78.4867 },
  { id: '10', name: 'Patna Sahib', state: 'Bihar', phase: 7, mp: 'Ravi Shankar Prasad', turnout: '45.8%', lat: 25.5941, lng: 85.1376 },
  { id: '11', name: 'Bhopal', state: 'Madhya Pradesh', phase: 3, mp: 'Pragya Thakur', turnout: '65.7%', lat: 23.2599, lng: 77.4126 },
  { id: '12', name: 'Jaipur', state: 'Rajasthan', phase: 1, mp: 'Ramcharan Bohra', turnout: '68.4%', lat: 26.9124, lng: 75.7873 },
  { id: '13', name: 'Guwahati', state: 'Assam', phase: 3, mp: 'Queen Oja', turnout: '78.2%', lat: 26.1445, lng: 91.7362 },
  { id: '14', name: 'Chandigarh', state: 'Chandigarh', phase: 7, mp: 'Kirron Kher', turnout: '70.6%', lat: 30.7333, lng: 76.7794 },
  { id: '15', name: 'Amritsar', state: 'Punjab', phase: 7, mp: 'Gurjeet Singh Aujla', turnout: '57.1%', lat: 31.6340, lng: 74.8723 },
  { id: '16', name: 'Bhubaneswar', state: 'Odisha', phase: 5, mp: 'Aparajita Sarangi', turnout: '59.1%', lat: 20.2961, lng: 85.8245 },
  { id: '17', name: 'Thiruvananthapuram', state: 'Kerala', phase: 4, mp: 'Shashi Tharoor', turnout: '73.7%', lat: 8.5241, lng: 76.9366 },
  { id: '18', name: 'Ranchi', state: 'Jharkhand', phase: 5, mp: 'Sanjay Seth', turnout: '64.9%', lat: 23.3441, lng: 85.3096 },
  { id: '19', name: 'Raipur', state: 'Chhattisgarh', phase: 3, mp: 'Sunil Kumar Soni', turnout: '66.2%', lat: 21.2514, lng: 81.6296 },
  { id: '20', name: 'Srinagar', state: 'J&K', phase: 4, mp: 'Farooq Abdullah', turnout: '14.1%', lat: 34.0837, lng: 74.7973 },
  { id: '21', name: 'Panaji', state: 'Goa', phase: 3, mp: 'Shripad Naik', turnout: '75.1%', lat: 15.4909, lng: 73.8278 },
  { id: '22', name: 'Shimla', state: 'Himachal', phase: 7, mp: 'Suresh Kashyap', turnout: '72.7%', lat: 31.1048, lng: 77.1734 },
  { id: '23', name: 'Dehradun', state: 'Uttarakhand', phase: 1, mp: 'Mala Rajya Laxmi Shah', turnout: '61.5%', lat: 30.3165, lng: 78.0322 },
  { id: '24', name: 'Imphal', state: 'Manipur', phase: 1, mp: 'RK Ranjan Singh', turnout: '82.7%', lat: 24.8170, lng: 93.9368 },
  { id: '25', name: 'Shillong', state: 'Meghalaya', phase: 1, mp: 'Vincent Pala', turnout: '65.4%', lat: 25.5788, lng: 91.8833 },
  { id: '26', name: 'Aizawl', state: 'Mizoram', phase: 1, mp: 'C Lalrosanga', turnout: '63.1%', lat: 23.7271, lng: 92.7176 },
  { id: '27', name: 'Kohima', state: 'Nagaland', phase: 1, mp: 'Tokheho Yepthomi', turnout: '83.1%', lat: 25.6751, lng: 94.1086 },
  { id: '28', name: 'Agartala', state: 'Tripura', phase: 1, mp: 'Pratima Bhoumik', turnout: '81.9%', lat: 23.8315, lng: 91.2868 },
  { id: '29', name: 'Gangtok', state: 'Sikkim', phase: 1, mp: 'Indra Hang Subba', turnout: '81.4%', lat: 27.3314, lng: 88.6138 },
  { id: '30', name: 'Itanagar', state: 'Arunachal', phase: 1, mp: 'Kiren Rijiju', turnout: '77.2%', lat: 27.0844, lng: 93.6053 },
  { id: '31', name: 'Port Blair', state: 'A&N Islands', phase: 1, mp: 'Kuldeep Rai Sharma', turnout: '65.1%', lat: 11.6234, lng: 92.7265 },
  { id: '32', name: 'Kavaratti', state: 'Lakshadweep', phase: 1, mp: 'Mohammed Faizal PP', turnout: '85.2%', lat: 10.5667, lng: 72.6417 },
];


function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 6);
  return null;
}

export default function ConstituencyMap() {
  const [selectedConst, setSelectedConst] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India Center
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Fetch High-Accuracy Official India GeoJSON (Survey of India aligned)
    fetch('https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);




  return (
    <div className="map-explorer">
      {/* Sidebar Controls */}
      <div className="map-sidebar">
        <div className="sidebar-header">
          <span className="text-label" style={{ color: 'var(--eci-saffron)', fontWeight: 600 }}>LIVE GEOSPATIAL DATA</span>
          <h2 className="text-heading-01" style={{ fontSize: '1.75rem', marginTop: '4px' }}>Constituency Explorer</h2>
          <p className="text-body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '8px' }}>
            Real-time visual intelligence for 543 Parliamentary Constituencies.
          </p>
        </div>

        {/* National Quick Stats */}
        <div className="national-insights grid grid--2" style={{ gap: '1px', background: 'var(--cds-layer-03)', marginBottom: '2rem' }}>
          <div className="stat-tile">
            <span className="stat-label">Active Phase</span>
            <span className="stat-value">3</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Avg Turnout</span>
            <span className="stat-value">62.4%</span>
          </div>
        </div>

        <div className="map-filters">
          <div className="search-box">
            <Search size={16} color="var(--cds-text-placeholder)" />
            <input type="text" placeholder="Search constituency by name..." />
          </div>
          
          <div className="filter-group">
            <label className="text-label" style={{ color: '#fff', marginBottom: '12px', display: 'block' }}>Map Visualizations</label>
            <div className="overlay-options">
              <button className="active">
                <TrendingUp size={14} style={{ marginRight: 8 }} />
                Voter Turnout (Live)
              </button>
              <button>
                <Users size={14} style={{ marginRight: 8 }} />
                Demographic Density
              </button>
              <button>
                <MapPin size={14} style={{ marginRight: 8 }} />
                Phase Distribution
              </button>
            </div>
          </div>
        </div>

        <div className="state-quick-jump">
           <label className="text-label" style={{ color: '#fff', marginBottom: '8px', display: 'block' }}>Quick Jump to State</label>
           <select className="form-select w-full" style={{ background: 'var(--cds-layer-01)', borderColor: 'var(--cds-layer-03)' }}>
              <option>All India</option>
              <option>Gujarat</option>
              <option>Maharashtra</option>
              <option>West Bengal</option>
              <option>Uttar Pradesh</option>
           </select>
        </div>

        <div className="sidebar-divider" style={{ margin: '2rem 0', height: '1px', background: 'var(--cds-layer-03)' }} />

        <div className="high-stakes-battles">
           <label className="text-label" style={{ color: 'var(--eci-saffron)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={14} /> HIGH-STAKES BATTLES
           </label>
           <div className="battles-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Varanasi', candidates: 'Modi vs Rai', status: 'Crucial' },
                { name: 'Wayanad', candidates: 'Rahul vs Annie', status: 'Sensitive' },
                { name: 'Lucknow', candidates: 'Rajnath vs Ravidas', status: 'Moderate' },
                { name: 'Hyderabad', candidates: 'Owaisi vs Madhavi', status: 'High Voltage' }
              ].map(battle => (
                <div key={battle.name} className="battle-item tile" style={{ padding: '0.75rem', background: 'var(--cds-layer-01)', cursor: 'pointer' }}>
                   <div className="flex-between">
                      <span style={{ fontWeight: 600 }}>{battle.name}</span>
                      <span className="pill pill--red" style={{ fontSize: '0.6rem' }}>{battle.status}</span>
                   </div>
                   <div className="text-label" style={{ fontSize: '0.7rem', marginTop: '4px' }}>{battle.candidates}</div>
                </div>
              ))}
           </div>
        </div>

        <div className="sidebar-divider" style={{ margin: '2rem 0', height: '1px', background: 'var(--cds-layer-03)' }} />


        {selectedConst ? (
          <div className="constituency-detail animate-slide-up">
            <div className="detail-header">
              <div>
                <h3 className="text-heading-03" style={{ color: '#fff' }}>{selectedConst.name}</h3>
                <p className="text-label" style={{ color: 'var(--eci-saffron)' }}>PHASE {selectedConst.phase} CONSTITUENCY</p>
              </div>
              <span className="pill pill--blue">{selectedConst.state}</span>
            </div>
            
            <div className="detail-stats" style={{ marginTop: '1rem' }}>
              <div className="stat-tile">
                <span className="stat-label">Voter Population</span>
                <span className="stat-value" style={{ color: '#fff', fontSize: '1.1rem' }}>1.85M</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Poll Day Turnout</span>
                <span className="stat-value" style={{ color: 'var(--eci-green)', fontSize: '1.1rem' }}>{selectedConst.turnout}</span>
              </div>
            </div>

            <div className="mp-info tile" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
               <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--cds-layer-03)', pb: '0.5rem' }}>
                  <span className="text-label">SITTING MEMBER OF PARLIAMENT</span>
               </div>
              <div className="info-row">
                <Users size={16} color="var(--eci-saffron)" />
                <span>{selectedConst.mp}</span>
              </div>
              <div className="info-row">
                <BarChart3 size={16} color="var(--cds-button-primary)" />
                <span>Victory Margin: 124,502</span>
              </div>
            </div>

            <button className="btn btn--primary w-full mt-auto">View Full Analysis Dashboard</button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon-box" style={{ background: 'var(--cds-layer-01)', padding: '2rem', marginBottom: '1.5rem' }}>
               <Info size={32} color="var(--eci-saffron)" />
            </div>
            <p className="text-body-01" style={{ color: 'var(--cds-text-placeholder)', marginBottom: '2rem' }}>
               Select a geometric marker on the map to initialize deep-dive analytics.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <Skeleton height={14} width="40%" />
              <Skeleton height={28} width="100%" />
              <Skeleton height={100} width="100%" />
              <Skeleton height={48} width="100%" />
            </div>
          </div>

        )}
      </div>

      {/* Map Area */}
      <div className="map-container-wrapper">
        <MapContainer 
          center={mapCenter} 
          zoom={5} 
          style={{ height: '100%', width: '100%', background: '#000' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />

          {geoData && (
            <>
              {/* Outer Glow (wide, transparent) */}
              <GeoJSON 
                key="india-glow-outer"
                data={geoData} 
                style={{
                  className: "india-border-glow-outer",
                  color: '#FFD700',
                  weight: 15,
                  opacity: 0.05,
                  fillOpacity: 0
                }}
              />
              {/* Medium Glow */}
              <GeoJSON 
                key="india-glow-medium"
                data={geoData} 
                style={{
                  className: "india-border-glow-medium",
                  color: '#FFD700',
                  weight: 8,
                  opacity: 0.2,
                  fillOpacity: 0
                }}
              />
              {/* Core Border Line (The "Lights") */}
              <GeoJSON 
                key="india-glow-core"
                data={geoData} 
                style={{
                  className: "india-border-glow-core",
                  color: '#FFF8E1', 
                  weight: 2,
                  opacity: 1,
                  fillColor: 'transparent',
                  fillOpacity: 0,
                  dashArray: '2, 6', 
                }}
              />
            </>
          )}


          
          {SAMPLE_CONSTITUENCIES.map((c) => (
            <Marker 
              key={c.id} 
              position={[c.lat, c.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedConst(c);
                  setMapCenter([c.lat, c.lng]);
                },
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{c.name}</strong>
                  <br />
                  State: {c.state}
                </div>
              </Popup>
            </Marker>
          ))}
          
          <ChangeView center={mapCenter} />
        </MapContainer>


        <div className="map-legend">
          <div className="legend-item">
            <span className="color-box phase-1"></span>
            <span>Phase 1-3</span>
          </div>
          <div className="legend-item">
            <span className="color-box phase-2"></span>
            <span>Phase 4-5</span>
          </div>
          <div className="legend-item">
            <span className="color-box phase-3"></span>
            <span>Phase 6-7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
