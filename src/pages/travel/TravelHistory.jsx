import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Image as ImageIcon, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useTravelStore } from '../../store/travelStore';
import Modal from '../../components/shared/Modal';

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

export default function TravelHistory() {
  const { travelHistory } = useTravelStore();
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Mocking previous plans coordinates for the Connection Map
  const demoConnections = [
    { id: 1, name: 'Euro Trip 2024', coords: [[48.8566, 2.3522], [52.5200, 13.4050], [41.9028, 12.4964]], type: 'past' },
    { id: 2, name: 'Goa Weekend', coords: [[19.0760, 72.8777], [15.2993, 74.1240]], type: 'past' },
    { id: 3, name: 'Himalayan Trek', coords: [[28.6139, 77.2090], [32.2432, 77.1892], [34.1526, 77.5771]], type: 'past' }
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: '-var(--space-xl)', overflow: 'hidden' }}>
      <header style={{ padding: '1.25rem 2rem', background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}><span className="gradient-text">Time Machine Map</span></h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginTop: 4 }}>Your past adventures interconnected around the globe</p>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* World Heatmap Container */}
        <section style={{ flex: 1, position: 'relative' }}>
          <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%', background: '#0a0a0f' }} zoomControl={false}>
            <TileLayer
              url="https://settings.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {demoConnections.map(route => (
              <div key={route.id}>
                {/* Connection Line */}
                <Polyline 
                  positions={route.coords} 
                  color="var(--accent-cyan)" 
                  weight={3} 
                  opacity={0.6}
                  dashArray="5, 10" 
                  eventHandlers={{
                    click: () => setSelectedTrip(route)
                  }}
                />
                {/* Cities */}
                {route.coords.map((c, i) => (
                  <Marker position={c} key={i}>
                    <Popup>
                      <div style={{ color: '#000', fontWeight: 600 }}>{route.name}</div>
                      <div style={{ color: '#666', fontSize: '10px' }}>Stop {i+1}</div>
                    </Popup>
                  </Marker>
                ))}
              </div>
            ))}
          </MapContainer>
        </section>

        {/* Memories Sidebar */}
        <section style={{ width: '380px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', display: 'flex', alignItems: 'center', gap: 6 }}><MapIcon size={18} /> Travel History</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {demoConnections.map(trip => (
              <motion.div key={trip.id} className="glass-card" style={{ padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', border: selectedTrip?.id === trip.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)' }} onClick={() => setSelectedTrip(trip)} whileHover={{ scale: 1.02 }}>
                <h4 style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {trip.name}
                  <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                </h4>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {trip.coords.length} locations</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ImageIcon size={12} /> View Gallery</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Modal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} title={`${selectedTrip?.name} Overview`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
           <div style={{ height: 200, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-primary)' }}>
             <div style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}><ImageIcon size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} /><br/>Gallery Integration (Google Photos API pending)</div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Total Expense</div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--accent-red)' }}>₹14,500</div>
              </div>
              <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Distance Travelled</div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--accent-cyan)' }}>1,240 km</div>
              </div>
           </div>

           <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Itinerary Replay</h4>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                {selectedTrip?.coords.map((c, i) => (
                  <div key={i} style={{ padding: '0.5rem 0', borderBottom: i < selectedTrip.coords.length - 1 ? '1px solid var(--border-primary)' : 'none', fontSize: 'var(--font-sm)' }}>
                    <span style={{ color: 'var(--accent-purple-light)', marginRight: '1rem' }}>Stop {i+1}</span> 
                    Coordinates [{c[0].toFixed(2)}, {c[1].toFixed(2)}]
                  </div>
                ))}
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
}
