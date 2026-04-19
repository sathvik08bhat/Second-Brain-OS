import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map, Calendar, Plus, Navigation, Clock, DollarSign, Users, Type, Move, MapPin
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useTravelStore } from '../../store/travelStore';

// Fix Leaflet marker icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// A component to auto-pan the map when markers change
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function Planner() {
  const { trips, addTrip, updateTrip } = useTravelStore();
  const [activeTripId, setActiveTripId] = useState(null);
  
  // Default bounds for India view
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  useEffect(() => {
    if (!activeTrip && trips.length > 0) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTrip]);

  if (!activeTrip && trips.length === 0) {
    return (
      <PageWrapper>
        <div className="page-header">
          <h1><span className="gradient-text">🗺️ Travel Planner</span></h1>
          <p>Create your ultimate interactive itineraries</p>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => addTrip({ destination: 'New Trip', startDate: '', endDate: '', budget: 0, itinerary: [] })}><Plus size={16} /> New Draft</button>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Map size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No Active Trips</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Start planning a new adventure to unlock the interactive canvas.</p>
        </div>
      </PageWrapper>
    );
  }

  const flyToLocation = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(12);
  };

  const handleUpdateMeta = (e, field) => {
    updateTrip(activeTrip.id, { [field]: e.target.textContent || e.target.value });
  };

  const addWaypoint = (day) => {
    const freshItinerary = [...(activeTrip.itinerary || [])];
    const newPoint = {
      id: Date.now().toString(),
      day,
      time: '10:00 AM',
      title: 'New Location',
      type: 'landmark',
      lat: mapCenter[0] + (Math.random() * 0.05),
      lng: mapCenter[1] + (Math.random() * 0.05)
    };
    freshItinerary.push(newPoint);
    updateTrip(activeTrip.id, { itinerary: freshItinerary });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: '-var(--space-xl)', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <header style={{ padding: '1.25rem 2rem', background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h1 contentEditable suppressContentEditableWarning onBlur={(e) => handleUpdateMeta(e, 'destination')} style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, outline: 'none', cursor: 'text' }}>
            {activeTrip?.destination || 'Untitled Trip'}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {activeTrip?.startDate || 'Dates TBD'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} /> ₹{activeTrip?.budget || 0} Est.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {activeTrip?.travelers || 2} Travelers</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={activeTripId || ''} onChange={e => setActiveTripId(e.target.value)} className="input-primary" style={{ padding: '0.4rem 0.8rem', width: 200 }}>
             {trips.map(t => <option key={t.id} value={t.id}>{t.destination}</option>)}
          </select>
          <button className="btn-secondary" onClick={() => addTrip({ destination: 'New Trip', startDate: '', endDate: '', budget: 0, itinerary: [] })}><Plus size={16} /> New</button>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Map Panel Container */}
        <section style={{ flex: 1, position: 'relative' }}>
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', background: '#0a0a0f' }} zoomControl={false}>
            {/* Dark Matter CartoDB theme to match aesthetic */}
            <TileLayer
              url="https://settings.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {activeTrip?.itinerary?.map(pt => (
              <Marker key={pt.id} position={[pt.lat, pt.lng]}>
                <Popup>
                  <div style={{ color: '#000', fontWeight: 600 }}>{pt.title}</div>
                  <div style={{ color: '#666', fontSize: '10px' }}>{pt.time} - Day {pt.day}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Traffic Layers</button>
          </div>
        </section>

        {/* Itinerary Panel */}
        <section style={{ width: '400px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', display: 'flex', alignItems: 'center', gap: 6 }}><Navigation size={18} /> Schedule Editor</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {[1, 2, 3].map(day => {
              const dayItems = (activeTrip?.itinerary || []).filter(i => i.day === day).sort((a,b)=>a.time.localeCompare(b.time));
              return (
                <div key={day} style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--accent-purple-light)' }}>Day {day}</h4>
                    <button className="btn-icon" onClick={() => addWaypoint(day)} title="Add stop to Day"><Plus size={14} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {dayItems.length === 0 ? (
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', padding: '1rem', border: '1px dashed var(--border-primary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>No activities mapped.</div>
                    ) : (
                      dayItems.map((item, idx) => (
                        <motion.div key={item.id} className="glass-card" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'grab' }} layoutId={item.id}>
                           <div style={{ width: 24, display: 'flex', justifyContent: 'center', color: 'var(--text-tertiary)', marginTop: 2 }}><Move size={14} /></div>
                           <div style={{ flex: 1 }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {item.time}</div>
                               <button className="btn-icon" onClick={() => flyToLocation(item.lat, item.lng)} style={{ padding: 2, color: 'var(--accent-cyan)' }} title="Fly to location"><MapPin size={12}/></button>
                             </div>
                             <div contentEditable suppressContentEditableWarning style={{ fontWeight: 600, fontSize: 'var(--font-sm)', outline: 'none', marginTop: 4, minHeight: 20 }}>{item.title}</div>
                             <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--accent-purple-light)', marginTop: 4, display: 'inline-block', background: 'var(--accent-purple)15', padding: '2px 6px', borderRadius: 4 }}>{item.type}</div>
                           </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
            
            <button className="btn-secondary" style={{ width: '100%', padding: '0.75rem' }}><Plus size={14} /> Add Day</button>
          </div>
        </section>

      </div>
    </div>
  );
}
