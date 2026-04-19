import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary 
} from '@vis.gl/react-google-maps';
import { 
  Map as MapIcon, Calendar, Plus, Navigation, Clock, DollarSign, Users, Move, MapPin, Search, Trash2
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useTravelStore } from '../../store/travelStore';

// Retrieve your API key
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAP_ID = 'fe169308cc4b74bb'; // Replace with a real MapID if you setup custom styles

// This component handles the Directions routing (the blue lines between waypoints)
function Directions({ itineraryPoints }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || itineraryPoints.length < 2) {
      if (directionsRenderer) directionsRenderer.setDirections(null);
      return;
    }

    const origin = itineraryPoints[0];
    const destination = itineraryPoints[itineraryPoints.length - 1];
    
    // Middle points
    const waypoints = itineraryPoints.slice(1, -1).map(pt => ({
      location: { lat: pt.lat, lng: pt.lng },
      stopover: true
    }));

    directionsService.route({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false
    }).then(response => {
      directionsRenderer.setDirections(response);
    }).catch(e => {
      console.error("Directions request failed: ", e);
    });
  }, [directionsService, directionsRenderer, itineraryPoints]);

  return null;
}

// Autocomplete Search Bar to push nodes onto itinerary
function PlaceAutocomplete({ onPlaceSelect }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ['geometry', 'name', 'formatted_address', 'types'] };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name || place.formatted_address,
          type: place.types && place.types.length > 0 ? place.types[0].replace('_', ' ') : 'stop'
        });
        if(inputRef.current) inputRef.current.value = '';
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
      <input ref={inputRef} placeholder="Search for places to add..." className="input-field" style={{ width: '100%', paddingLeft: '2rem' }} />
      <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
    </div>
  );
}


export default function Planner() {
  const { trips, addTrip, updateTrip } = useTravelStore();
  const [activeTripId, setActiveTripId] = useState(null);
  
  const [activeDay, setActiveDay] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(4);

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  useEffect(() => {
    if (!activeTrip && trips.length > 0) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTrip]);

  if (!GOOGLE_API_KEY) {
    return (
      <PageWrapper>
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Google Maps API Key Missing</h2>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '1rem', maxWidth: 600, margin: '1rem auto' }}>
            We've upgraded your extensive Travel Planner to the official Google Maps API. To unlock it, please provide your <code style={{background:'var(--bg-card)', padding:'2px 6px', borderRadius:4}}>VITE_GOOGLE_MAPS_API_KEY</code> in a local <code>.env</code> file.
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (!activeTrip) {
    return (
      <PageWrapper>
        <div className="page-header">
          <h1><span className="gradient-text">🗺️ Extensive Travel Planner</span></h1>
          <p>Google Maps powered routing, autocomplete, and discovery</p>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => addTrip({ destination: 'New Adventure', startDate: '', endDate: '', budget: 0, itinerary: [] })}><Plus size={16} /> New Draft</button>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <MapIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No Active Trips</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Start planning a new adventure to unlock the interactive Google canvas.</p>
        </div>
      </PageWrapper>
    );
  }

  const flyToLocation = (lat, lng) => {
    setMapCenter({ lat, lng });
    setMapZoom(14);
  };

  const handleUpdateMeta = (e, field) => {
    updateTrip(activeTrip.id, { [field]: e.target.textContent || e.target.value });
  };

  const handlePlaceAdded = (placeObj) => {
    const freshItinerary = [...(activeTrip.itinerary || [])];
    const newPoint = {
      id: Date.now().toString(),
      day: activeDay,
      time: '12:00 PM',
      title: placeObj.name,
      type: placeObj.type,
      lat: placeObj.lat,
      lng: placeObj.lng
    };
    freshItinerary.push(newPoint);
    updateTrip(activeTrip.id, { itinerary: freshItinerary });
    flyToLocation(placeObj.lat, placeObj.lng);
  };

  const removeWaypoint = (id) => {
    const freshItinerary = (activeTrip.itinerary || []).filter(i => i.id !== id);
    updateTrip(activeTrip.id, { itinerary: freshItinerary });
  };

  // Only pass waypoints for the current selected day to the Directions renderer
  const dayItems = (activeTrip?.itinerary || []).filter(i => i.day === activeDay).sort((a,b)=>a.time.localeCompare(b.time));

  return (
    <APIProvider apiKey={GOOGLE_API_KEY}>
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
            <select value={activeTripId || ''} onChange={e => setActiveTripId(e.target.value)} className="input-primary" style={{ padding: '0.4rem 0.8rem', width: 220 }}>
               {trips.map(t => <option key={t.id} value={t.id}>{t.destination}</option>)}
            </select>
            <button className="btn-secondary" onClick={() => addTrip({ destination: 'New Adventure', startDate: '', endDate: '', budget: 0, itinerary: [] })}><Plus size={16} /> New</button>
          </div>
        </header>

        {/* ── Main Canvas ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Google Map Container */}
          <section style={{ flex: 1, position: 'relative' }}>
            <Map 
              defaultZoom={mapZoom} 
              defaultCenter={mapCenter} 
              center={mapCenter}
              mapId={MAP_ID || "DEMO_MAP_ID"}
              disableDefaultUI={true}
              gestureHandling={'greedy'}
              onBoundsChanged={(e) => {
                if(e.map.getCenter()) {
                  // Keep state synced loosely if needed
                }
              }}
            >
              <Directions itineraryPoints={dayItems} />

              {dayItems.map((pt, i) => (
                <AdvancedMarker key={pt.id} position={{ lat: pt.lat, lng: pt.lng }} onClick={() => flyToLocation(pt.lat, pt.lng)}>
                  <Pin background={i === 0 ? '#10b981' : i === dayItems.length - 1 ? '#ef4444' : '#3b82f6'} borderColor={'#000'} glyphColor={'#fff'} />
                </AdvancedMarker>
              ))}
            </Map>
          </section>

          {/* Itinerary Logic Board */}
          <section style={{ width: '420px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <h3 style={{ fontSize: 'var(--font-md)', display: 'flex', alignItems: 'center', gap: 6 }}><Navigation size={18} /> Schedule Editor</h3>
                 <div style={{ display: 'flex', gap: 4 }}>
                   {[1, 2, 3, 4].map(d => (
                     <button key={d} onClick={() => setActiveDay(d)} style={{ padding: '0.2rem 0.5rem', fontSize: '10px', background: activeDay === d ? 'var(--accent-cyan)' : 'var(--bg-secondary)', color: activeDay === d ? '#000' : 'var(--text-secondary)', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>D{d}</button>
                   ))}
                 </div>
              </div>
              
              <PlaceAutocomplete onPlaceSelect={handlePlaceAdded} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--accent-cyan)' }}>Day {activeDay} Itinerary</h4>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{dayItems.length} stops</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <AnimatePresence>
                  {dayItems.length === 0 ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', padding: '1.5rem', border: '1px dashed var(--border-primary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      Search for a place above to add it to your Day {activeDay} route.
                    </motion.div>
                  ) : (
                    dayItems.map((item, idx) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                      >
                         <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 800, marginTop: 4 }}>{idx + 1}</div>
                         <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <div contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, outline: 'none' }} onBlur={(e) => {
                               const fresh = [...activeTrip.itinerary];
                               fresh.find(i => i.id === item.id).time = e.target.textContent;
                               updateTrip(activeTrip.id, { itinerary: fresh });
                             }}><Clock size={10} /> {item.time}</div>
                             <div style={{ display: 'flex', gap: 4 }}>
                               <button className="btn-icon" onClick={() => flyToLocation(item.lat, item.lng)} style={{ padding: 2, color: 'var(--accent-cyan)' }} title="Fly to location"><MapPin size={12}/></button>
                               <button className="btn-icon" onClick={() => removeWaypoint(item.id)} style={{ padding: 2, color: 'var(--accent-red)' }} title="Remove"><Trash2 size={12}/></button>
                             </div>
                           </div>
                           <div contentEditable suppressContentEditableWarning onBlur={(e) => {
                               const fresh = [...activeTrip.itinerary];
                               fresh.find(i => i.id === item.id).title = e.target.textContent;
                               updateTrip(activeTrip.id, { itinerary: fresh });
                             }} style={{ fontWeight: 600, fontSize: 'var(--font-sm)', outline: 'none', marginTop: 4, minHeight: 20 }}>{item.title}</div>
                           <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--accent-cyan)', marginTop: 4, display: 'inline-block', background: 'var(--accent-cyan)15', padding: '2px 6px', borderRadius: 4 }}>{item.type}</div>
                         </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

        </div>
      </div>
    </APIProvider>
  );
}
