import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  APIProvider, Map, AdvancedMarker, Pin, useMap 
} from '@vis.gl/react-google-maps';
import { Map as MapIcon, Image as ImageIcon, Calendar, ChevronRight } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useTravelStore } from '../../store/travelStore';
import Modal from '../../components/shared/Modal';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAP_ID = 'fe169308cc4b74bb'; // Replace with real dark map ID

// Component to render Polylines linking past travel nodes
function HistoryPolylines({ routes, selectedRouteId }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    const lines = [];
    routes.forEach(route => {
      const isSelected = selectedRouteId === route.id;
      const curLine = new google.maps.Polyline({
        path: route.coords.map(c => ({ lat: c[0], lng: c[1] })),
        geodesic: true,
        strokeColor: isSelected ? '#10b981' : '#06b6d4',
        strokeOpacity: isSelected ? 1.0 : 0.4,
        strokeWeight: isSelected ? 4 : 2,
        map: map
      });
      lines.push(curLine);
    });

    return () => {
       // Cleanup map vectors
       lines.forEach(l => l.setMap(null));
    };
  }, [map, routes, selectedRouteId]);

  return null;
}


export default function TravelHistory() {
  const { travelHistory } = useTravelStore();
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Mocking previous plans coordinates for the Connection Map
  const demoConnections = [
    { id: 1, name: 'Euro Trip 2024', coords: [[48.8566, 2.3522], [52.5200, 13.4050], [41.9028, 12.4964]], type: 'past' },
    { id: 2, name: 'Goa Weekend', coords: [[19.0760, 72.8777], [15.2993, 74.1240]], type: 'past' },
    { id: 3, name: 'Himalayan Trek', coords: [[28.6139, 77.2090], [32.2432, 77.1892], [34.1526, 77.5771]], type: 'past' }
  ];

  if (!GOOGLE_API_KEY) {
    return (
      <PageWrapper>
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Google Maps API Key Missing</h2>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '1rem', maxWidth: 600, margin: '1rem auto' }}>
            We've upgraded your Time Machine Map to the official Google Maps API. To unlock it, please provide your <code style={{background:'var(--bg-card)', padding:'2px 6px', borderRadius:4}}>VITE_GOOGLE_MAPS_API_KEY</code> in a local <code>.env</code> file.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_API_KEY}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: '-var(--space-xl)', overflow: 'hidden' }}>
        <header style={{ padding: '1.25rem 2rem', background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}><span className="gradient-text">Time Machine Map</span></h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', marginTop: 4 }}>Your past adventures interconnected around the globe via Maps APIs</p>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* World Heatmap Container */}
          <section style={{ flex: 1, position: 'relative' }}>
            <Map 
              defaultZoom={3} 
              defaultCenter={{ lat: 20, lng: 0 }}
              mapId={MAP_ID || "DEMO_MAP_ID"}
              disableDefaultUI={false}
              gestureHandling={'greedy'}
            >
              <HistoryPolylines routes={demoConnections} selectedRouteId={selectedTrip?.id} />

              {demoConnections.map(route => (
                <div key={route.id}>
                  {route.coords.map((c, i) => (
                    <AdvancedMarker position={{ lat: c[0], lng: c[1] }} key={`${route.id}-${i}`}>
                        <Pin background={'#0a0a0f'} borderColor={'var(--accent-cyan)'} glyphColor={'var(--accent-cyan)'} scale={0.8} />
                    </AdvancedMarker>
                  ))}
                </div>
              ))}
            </Map>
          </section>

          {/* Memories Sidebar */}
          <section style={{ width: '380px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
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
               <div style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}><ImageIcon size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} /><br/>Gallery Integration pending</div>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Total Expense</div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--accent-red)' }}>₹14,500</div>
                </div>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Points Mapped</div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{selectedTrip?.coords.length} Nodes</div>
                </div>
             </div>
          </div>
        </Modal>
      </div>
    </APIProvider>
  );
}
