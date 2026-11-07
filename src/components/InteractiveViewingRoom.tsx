import { useState } from 'react';
import { Artwork } from '../types';
import { User, Palette } from 'lucide-react';

interface InteractiveViewingRoomProps {
  artworks: Artwork[];
  language: 'ko' | 'en';
  onInquireClick: (artwork: Artwork) => void;
}

const WALL_COLORS = [
  {
    id: 'gallery-white',
    name: 'Galleria White',
    bgClass: 'bg-[#fafafa]',
    borderClass: 'border-neutral-200',
    textLight: false,
  },
  {
    id: 'classic-alabaster',
    name: 'Warm Alabaster',
    bgClass: 'bg-[#efebe4]',
    borderClass: 'border-neutral-300',
    textLight: false,
  },
  {
    id: 'minimalist-slate',
    name: 'Minimalist Slate',
    bgClass: 'bg-[#434b54]',
    borderClass: 'border-neutral-400',
    textLight: true,
  },
  {
    id: 'deep-obsidian',
    name: 'Deep Obsidian',
    bgClass: 'bg-[#151515]',
    borderClass: 'border-neutral-800',
    textLight: true,
  },
];

export default function InteractiveViewingRoom({
  artworks,
  language,
  onInquireClick,
}: InteractiveViewingRoomProps) {
  const [selectedArtId, setSelectedArtId] = useState<string>(artworks[0].id);
  const [activeColor, setActiveColor] = useState(WALL_COLORS[0]);
  const [showHumanSilhouette, setShowHumanSilhouette] = useState(true);

  const selectedArtwork =
    artworks.find((art) => art.id === selectedArtId) || artworks[0];

  // Map artwork scale dynamically for realistic proportions relative to a 280cm tall wall.
  // We assume the wall container has a height of 100% which is approx 350px.
  // 175cm human height silhouette is 62.5% of wall height.
  // Artworks:
  // - art-01: 162cm high -> 58% height of wall
  // - art-02: 145cm high -> 52% height of wall
  // - art-03: 110cm high -> 39% height of wall
  // - art-04: 130cm high -> 46% height of wall
  const getArtScale = (id: string) => {
    switch (id) {
      case 'art-01':
        return { height: '58%', width: '46%' };
      case 'art-02':
        return { height: '52%', width: '40%' };
      case 'art-03':
        return { height: '39%', width: '16%', isSculpture: true }; // Sculpture on pedestal
      case 'art-04':
        return { height: '46%', width: '34%' };
      default:
        return { height: '50%', width: '38%' };
    }
  };

  const scale = getArtScale(selectedArtwork.id);

  return (
    <section
      id="viewing-room"
      className="py-20 md:py-28 bg-neutral-900 text-white relative overflow-hidden"
    >
      {/* Decorative ambient lighting effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-neutral-800/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {language === 'ko'
                  ? '프라이빗 버추얼 뷰잉룸'
                  : 'Private Virtual Viewing Room'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide">
              {language === 'ko'
                ? '콜렉터스 시뮬레이터'
                : "Collector's Scale Simulator"}
            </h2>
            <p className="font-sans text-xs text-neutral-400 mt-2 font-light">
              {language === 'ko'
                ? '우리 집 거실이나 갤러리 벽면의 색상과 크기를 직접 가상으로 매칭해보세요.'
                : 'Preview original masterpieces dynamically scaled against different ambient gallery wall backdrops.'}
            </p>
          </div>

          {/* Interactive controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Color Swatch Selector */}
            <div className="flex items-center space-x-2.5 bg-neutral-800 px-4 py-2 rounded-full border border-neutral-700">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Palette size={11} /> Wall:
              </span>
              <div className="flex items-center space-x-2">
                {WALL_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setActiveColor(color)}
                    className={`w-4 h-4 rounded-full border transition-all duration-300 ${color.bgClass} ${
                      activeColor.id === color.id
                        ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-white scale-125'
                        : 'border-neutral-600 hover:scale-110'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Scale Comparison Toggle */}
            <button
              onClick={() => setShowHumanSilhouette(!showHumanSilhouette)}
              className={`font-sans text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-full transition-all duration-300 flex items-center space-x-1.5 ${
                showHumanSilhouette
                  ? 'bg-white text-neutral-950'
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700'
              }`}
            >
              <User size={12} />
              <span>
                {language === 'ko'
                  ? '크기 비교 (175cm)'
                  : 'Scale Guide (175cm)'}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Virtual Viewport Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left panel: Selector list (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-3 bg-neutral-800/40 p-6 border border-neutral-800 rounded-sm">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">
                {language === 'ko' ? '시뮬레이션 작품 선택' : 'Select Artwork'}
              </span>

              <div className="space-y-2.5 pt-2">
                {artworks.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtId(art.id)}
                    className={`w-full text-left p-3 transition-all duration-300 flex items-center space-x-3 rounded-sm ${
                      selectedArtId === art.id
                        ? 'bg-white text-neutral-950 shadow-md scale-[1.02]'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={art.image}
                      alt=""
                      className="w-10 h-10 object-contain rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xs font-semibold truncate">
                        {language === 'ko' ? art.artist : art.artistEn}
                      </p>
                      <p className="font-sans text-[11px] truncate italic font-light opacity-90">
                        {language === 'ko' ? art.title : art.titleEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick specifications label (Styled extremely sophisticated) */}
            <div className="border-t border-neutral-800 pt-6 space-y-4">
              <div>
                <p className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {language === 'ko'
                    ? '선택된 작품 스펙'
                    : 'Technical Specifications'}
                </p>
                <h3 className="font-serif text-2xl text-neutral-100 mt-2 font-light">
                  {language === 'ko'
                    ? selectedArtwork.title
                    : selectedArtwork.titleEn}
                </h3>
                <p className="font-serif text-sm italic text-neutral-400 mt-1">
                  by{' '}
                  {language === 'ko'
                    ? selectedArtwork.artist
                    : selectedArtwork.artistEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] tracking-widest">
                    {language === 'ko' ? '재료 및 매체' : 'Medium'}
                  </span>
                  <span className="text-neutral-300 font-light block mt-1">
                    {language === 'ko'
                      ? selectedArtwork.medium
                      : selectedArtwork.mediumEn}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] tracking-widest">
                    {language === 'ko' ? '크기' : 'Dimensions'}
                  </span>
                  <span className="text-neutral-300 block font-mono mt-1">
                    {selectedArtwork.dimensions}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onInquireClick(selectedArtwork)}
                  className="w-full bg-white text-neutral-950 font-sans text-[11px] font-bold tracking-[0.2em] uppercase py-3.5 hover:bg-neutral-200 transition-colors rounded-sm"
                >
                  {language === 'ko'
                    ? '작품 소장 및 가격 문의'
                    : 'Acquire & Price Inquiry'}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: The Virtual Wall Canvas (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div
              className={`relative h-[380px] md:h-[450px] w-full ${activeColor.bgClass} transition-colors duration-700 flex items-end justify-center pb-12 border rounded-sm overflow-hidden`}
              style={{
                borderColor:
                  activeColor.id === 'deep-obsidian' ? '#333' : '#e5e5e5',
              }}
            >
              {/* Floor Baseboard & Shadow to give depth */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-neutral-200/40 border-t border-neutral-300/50 flex items-center justify-between px-4 text-[9px] font-sans text-neutral-400">
                <span>{activeColor.name} Wall Context</span>
                <span>Virtual Scale Simulator (1:10)</span>
              </div>

              {/* Gallery Spotlight Glow on the Painting */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[80%] rounded-full bg-white/[0.08] blur-3xl pointer-events-none" />

              {/* The Painting / Sculpture on the wall */}
              {scale.isSculpture ? (
                // If sculpture, render it sitting on a pedestal
                <div
                  className="absolute bottom-4 flex flex-col items-center justify-end z-20 transition-all duration-700"
                  style={{ height: '70%', width: scale.width }}
                >
                  {/* Artwork image */}
                  <div
                    className="relative shadow-md overflow-hidden bg-white group transition-all duration-700 flex items-center justify-center border border-neutral-200"
                    style={{ height: scale.height, width: '100%' }}
                  >
                    <img
                      src={selectedArtwork.image}
                      alt=""
                      className="h-full w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Sculptural Pedestal */}
                  <div className="w-[120%] h-[40%] bg-neutral-100 border border-neutral-300 shadow-sm flex items-center justify-center">
                    <span className="font-sans text-[8px] text-neutral-400 uppercase tracking-widest">
                      Pedestal
                    </span>
                  </div>
                </div>
              ) : (
                // Standard Painting hanging on the wall with frames & shadows
                <div
                  className="absolute bottom-28 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white p-2 border border-neutral-200/60 transition-all duration-700 hover:shadow-[0_25px_60px_rgba(0,0,0,0.22)]"
                  style={{
                    height: scale.height,
                    width: scale.width,
                    transform: 'translateY(-20px)',
                  }}
                >
                  <img
                    src={selectedArtwork.image}
                    alt={selectedArtwork.titleEn}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Elegant lighting reflection shadow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.06] pointer-events-none" />
                </div>
              )}

              {/* Dynamic Human Silhouette for Scale comparison */}
              {showHumanSilhouette && (
                <div className="absolute bottom-4 left-[15%] h-[62%] aspect-[1/3.2] flex flex-col items-center justify-end z-30 pointer-events-none animate-fade-in">
                  {/* Person Vector drawing */}
                  <svg
                    viewBox="0 0 100 320"
                    className="w-full h-full text-neutral-400/80 filter drop-shadow-md"
                    fill="currentColor"
                  >
                    {/* Head */}
                    <circle cx="50" cy="40" r="18" />
                    {/* Neck */}
                    <path d="M45,58 L55,58 L55,68 L45,68 Z" />
                    {/* Shoulders & Torso */}
                    <path d="M25,72 C25,72 32,68 50,68 C68,68 75,72 75,72 C80,75 82,85 82,95 L80,180 C80,185 75,190 70,190 L30,190 C25,190 20,185 20,180 L18,95 C18,85 20,75 25,72 Z" />
                    {/* Legs */}
                    <path d="M28,190 L45,190 L44,310 C44,315 35,315 35,310 L28,190 Z" />
                    <path d="M55,190 L72,190 L65,310 C65,315 56,315 56,310 L55,190 Z" />
                  </svg>

                  {/* Human label indicator */}
                  <div className="absolute bottom-32 bg-neutral-900/90 text-white font-sans text-[8px] tracking-wider px-2 py-1 border border-neutral-700 rounded-sm shadow-sm whitespace-nowrap">
                    {language === 'ko' ? '수집가 (175cm)' : 'Collector (175cm)'}
                  </div>
                </div>
              )}

              {/* Dimension indicators on wall */}
              <div className="absolute top-4 right-4 text-right">
                <span className="font-sans text-[9px] text-neutral-400 uppercase tracking-widest block">
                  {language === 'ko' ? '시뮬레이션 배율' : 'Relative scale'}
                </span>
                <span className="font-mono text-sm text-neutral-300 block font-semibold mt-1">
                  100% (1:10)
                </span>
              </div>
            </div>

            {/* Scale explanation text */}
            <div className="mt-4 flex items-center justify-between text-neutral-500 font-sans text-[10px] tracking-wider">
              <span>
                *{' '}
                {language === 'ko'
                  ? '실제 비율을 근거로 계산된 3D 시뮬레이션입니다.'
                  : 'Calculated accurately based on structural aspect ratios.'}
              </span>
              <span className="uppercase text-neutral-400 font-bold">
                {selectedArtwork.dimensions}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
