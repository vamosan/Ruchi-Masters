import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles, Flame, Eye, Film } from 'lucide-react';
import { CricketBallIcon, CricketBatIcon } from '../common/CricketIcons';

interface VideoHighlight {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  tag: string;
}

export const MatchHighlightCarousel: React.FC = () => {
  const [activeVideoModal, setActiveVideoModal] = useState<VideoHighlight | null>(null);

  const highlights: VideoHighlight[] = [
    {
      id: 'vh-1',
      title: 'Sensational final-over thriller & boundary barrage',
      duration: '4:15',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
      views: '1.2M views',
      tag: '🔥 CLUTCH FINISH'
    },
    {
      id: 'vh-2',
      title: 'Captain masterclass: 85*(56) boundary highlights',
      duration: '6:30',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=600&q=80',
      views: '840K views',
      tag: '⚡ 85 OFF 56'
    },
    {
      id: 'vh-3',
      title: 'Fiery bowling spell: 4/14 yorkers dismantle middle order',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80',
      views: '620K views',
      tag: '🎯 4/14 SPELL'
    },
    {
      id: 'vh-4',
      title: 'Unbelievable direct hit run-out & flying catch in deep',
      duration: '2:50',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      views: '950K views',
      tag: '🧤 PLAY OF DAY'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Section Header with Left & Right Arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FF3366] text-white sport-pill shadow-[2px_2px_0px_#0f172a]">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-cabinet">
              Match Highlights & Reels
            </h3>
            <span className="text-xs text-slate-500 font-medium">Top tournament plays & boundary reels</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="w-9 h-9 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-[2px_2px_0px_#0f172a] transition-transform active:scale-95"
            title="Previous Highlights"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            className="w-9 h-9 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 flex items-center justify-center shadow-[2px_2px_0px_#CCFF00] transition-transform active:scale-95"
            title="Next Highlights"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Video Cards Row (Sporty Trading Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((h) => (
          <div 
            key={h.id}
            onClick={() => setActiveVideoModal(h)}
            className="group rounded-3xl overflow-hidden bg-white sport-card transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-2 hover:shadow-[6px_6px_0px_#0f172a] border-3 border-slate-950"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <img 
                src={h.thumbnail} 
                alt={h.title} 
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tag Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-[#CCFF00] text-slate-950 font-black text-[10px] font-mono sport-badge shadow">
                {h.tag}
              </span>

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-13 h-13 rounded-2xl bg-[#CCFF00] group-hover:bg-[#FF3366] text-slate-950 group-hover:text-white flex items-center justify-center shadow-xl transition-all group-hover:scale-110 border-2 border-slate-950">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/80 text-white font-mono text-[10px] font-bold border border-white/20">
                {h.duration}
              </span>
            </div>

            <div className="p-4 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors font-cabinet">
                {h.title}
              </h4>
              <div className="text-[10px] text-slate-500 font-bold flex items-center justify-between pt-1">
                <span className="font-mono text-cyan-600">{h.views}</span>
                <span className="text-slate-400">Ruchi T20 Reel</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sport-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#CCFF00] text-slate-950 font-black text-[10px] font-mono">
                  {activeVideoModal.tag}
                </span>
                <h4 className="font-black text-slate-900 text-base font-cabinet">{activeVideoModal.title}</h4>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-black hover:bg-slate-200">✕</button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative flex items-center justify-center text-white border-2 border-slate-900 shadow">
              <img src={activeVideoModal.thumbnail} alt="video" className="w-full h-full object-cover opacity-60" />
              <div className="absolute flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-[#CCFF00] text-slate-950 flex items-center justify-center shadow-xl animate-pulse border-2 border-slate-900">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <span className="text-xs font-black bg-slate-950/90 text-white px-3.5 py-1 rounded-full border border-white/20">
                  Stream Full Match Highlight
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
