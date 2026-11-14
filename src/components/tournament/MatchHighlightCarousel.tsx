import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, X } from 'lucide-react';

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
      tag: 'CLUTCH FINISH'
    },
    {
      id: 'vh-2',
      title: 'Captain masterclass: 85*(56) boundary highlights',
      duration: '6:30',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
      views: '840K views',
      tag: '85 OFF 56'
    },
    {
      id: 'vh-3',
      title: 'Fiery bowling spell: 4/14 yorkers dismantle middle order',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80',
      views: '620K views',
      tag: '4/14 SPELL'
    },
    {
      id: 'vh-4',
      title: 'Unbelievable direct hit run-out & flying catch in deep',
      duration: '2:50',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      views: '950K views',
      tag: 'PLAY OF DAY'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <Film className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-cabinet">
              Match Highlights & Reels
            </h3>
            <span className="text-xs text-slate-500 font-normal">Top tournament plays & boundary reels</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            className="w-9 h-9 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-colors shadow-xs"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((h) => (
          <div 
            key={h.id}
            onClick={() => setActiveVideoModal(h)}
            className="group rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img 
                src={h.thumbnail} 
                alt={h.title} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Tag Badge */}
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-semibold text-[10px] font-mono border border-white/10">
                {h.tag}
              </span>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-rose-600">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-medium border border-white/10">
                {h.duration}
              </span>
            </div>

            <div className="p-4 space-y-1">
              <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors font-cabinet">
                {h.title}
              </h4>
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-1">
                <span className="font-mono text-slate-500">{h.views}</span>
                <span className="text-slate-400">Ruchi Reel</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px] font-mono">
                  {activeVideoModal.tag}
                </span>
                <h4 className="font-bold text-slate-900 text-sm font-cabinet truncate max-w-md">{activeVideoModal.title}</h4>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative flex items-center justify-center text-white border border-slate-800 shadow-md">
              <img src={activeVideoModal.thumbnail} alt="video" className="w-full h-full object-cover opacity-75" />
              <div className="absolute flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl animate-pulse">
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </div>
                <span className="text-xs font-semibold bg-slate-950/80 text-white px-3.5 py-1 rounded-full border border-white/20">
                  Streaming Match Reel
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
