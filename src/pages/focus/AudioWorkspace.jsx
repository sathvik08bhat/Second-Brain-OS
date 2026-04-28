import React, { useState } from 'react';
import { Music, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioWorkspace() {
  const [showSpotify, setShowSpotify] = useState(true);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm w-full flex flex-col overflow-hidden">
      <div 
        className="px-6 py-4 flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
        onClick={() => setShowSpotify(!showSpotify)}
      >
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
          <Music size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-foreground">Deep Focus Audio</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Curated Ambient Workspace</p>
        </div>
        <ChevronDown size={16} className={`ml-auto transition-transform ${showSpotify ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {showSpotify && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-muted/20">
              <iframe
                className="w-full rounded-xl shadow-inner border border-border/50"
                src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
                height="152"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Integration"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
