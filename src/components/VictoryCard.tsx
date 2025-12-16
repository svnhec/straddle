'use client';

import { useEffect, useState } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Share, X } from 'lucide-react';
import { Share as SharePlugin } from '@capacitor/share';

interface VictoryCardProps {
  title?: string;
  subtitle?: string;
  message?: string;
  onClose?: () => void;
}

export function VictoryCard({
  title = "LOCKED IN: ROUND 1",
  subtitle = "Canadiens de Montréal",
  message = "Feels good, doesn't it? You just secured a seat at the Playoffs for Face Value. No scalpers. No stress. You're going.",
  onClose,
}: VictoryCardProps) {
  
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const runSequence = async () => {
      // 1. Heavy thud
      await Haptics.impact({ style: ImpactStyle.Heavy });
      
      // 2. Wait a beat, then flip card
      setTimeout(() => {
         setShowCard(true);
         // 3. Confetti vibration
         Haptics.notification({ type: NotificationType.Success });
      }, 400);
    };
    runSequence();
  }, []);

  const handleShare = async () => {
    try {
      await SharePlugin.share({
        title: 'LOCKED IN. 🏒',
        text: `I just secured a playoff seat for Face Value on Straddle. No scalpers.`,
        url: 'https://straddle.app', 
        dialogTitle: 'Share the victory',
      });
    } catch (err) {
      console.warn('Share failed', err);
      if (navigator.share) {
        navigator.share({
          title: 'Straddle',
          text: `Locked In: ${subtitle}`,
          url: 'https://straddle.app',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 perspective-1000">
      {/* Background Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* 3D Card Container */}
      <div className="relative w-full max-w-sm aspect-[3/4] z-10">
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15, 
                mass: 1 
              }}
              className="w-full h-full relative preserve-3d"
            >
               {/* The Card */}
               <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.3)] border border-yellow-500/20 bg-gradient-to-br from-zinc-900 to-black">
                  
                  {/* Gold Glow Effect */}
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-500/10 pointer-events-none"
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-center border-[6px] border-double border-yellow-600/30 m-2 rounded-[28px]">
                     
                     <div className="mb-6 w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-inner">
                        <Check className="w-12 h-12 text-yellow-500" strokeWidth={4} />
                     </div>

                     <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-2 font-archivo uppercase tracking-tighter drop-shadow-sm">
                        {title}
                     </h2>
                     
                     <div className="text-sm font-bold text-yellow-500/80 uppercase tracking-widest mb-8 border-b border-yellow-500/20 pb-2">
                        {subtitle}
                     </div>

                     <p className="text-sm text-zinc-400 font-serif italic leading-relaxed px-4">
                       &ldquo;{message}&rdquo;
                     </p>

                     <div className="mt-auto w-full pt-8 space-y-3">
                        <button
                          onClick={handleShare}
                          className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black rounded-xl uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                          <Share className="w-4 h-4" />
                          Share the Flex
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full py-3 text-zinc-600 font-bold text-xs uppercase tracking-wider hover:text-white transition-colors"
                        >
                          Close
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
