import { useState } from 'react';
import { Artwork } from '../types';
import { Eye, Mail, Info, Filter } from 'lucide-react';

interface ArtworkGridProps {
  artworks: Artwork[];
  language: 'ko' | 'en';
  onArtworkClick: (artwork: Artwork) => void;
  onInquireClick: (artwork: Artwork) => void;
}

export default function ArtworkGrid({
  artworks,
  language,
  onArtworkClick,
  onInquireClick,
}: ArtworkGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'painting' | 'sculpture' | 'monochrome'
  >('all');

  const filteredArtworks =
    selectedFilter === 'all'
      ? artworks
      : artworks.filter((art) => art.category === selectedFilter);

  const filters = [
    { id: 'all', ko: '전체 보기', en: 'All Works' },
    { id: 'monochrome', ko: '단색화', en: 'Monochrome' },
    { id: 'painting', ko: '회화', en: 'Painting' },
    { id: 'sculpture', ko: '조각', en: 'Sculpture' },
  ] as const;

  return (
    <section
      id="artworks"
      className="py-20 md:py-28 bg-white border-y border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-900 uppercase">
                {language === 'ko' ? '출품작 컬렉션' : 'Selected Works'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-neutral-900 tracking-wide">
              {language === 'ko'
                ? '서울아트 소장 및 출품작'
                : 'Featured Masterpieces'}
            </h2>
            <p className="font-sans text-xs text-neutral-500 tracking-wide mt-2">
              {language === 'ko'
                ? '엄선된 현대 미술 작가들의 대표작을 선보입니다.'
                : 'Presenting masterpiece creations by highly celebrated contemporary creators.'}
            </p>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b md:border-b-0 border-neutral-200 pb-4 md:pb-0">
            <span className="text-neutral-400 font-sans text-[10px] uppercase tracking-widest mr-2 flex items-center gap-1.5">
              <Filter size={11} /> Filter:
            </span>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`font-sans text-[10px] font-semibold tracking-widest uppercase px-4 py-2 transition-all duration-300 rounded-full ${
                  selectedFilter === filter.id
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:border-neutral-400'
                }`}
              >
                {language === 'ko' ? filter.ko : filter.en}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              id={`artwork-card-${artwork.id}`}
              className="flex flex-col group"
            >
              {/* Artwork Image Wrapper */}
              <div
                onClick={() => onArtworkClick(artwork)}
                className="relative bg-white aspect-[3/4] overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.015)] border border-neutral-100 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
              >
                <img
                  src={artwork.image}
                  alt={artwork.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />

                {/* Overlay on hover - Minimal & Elegant */}
                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 pointer-events-none">
                  <div className="bg-white/95 text-neutral-900 font-sans text-[9px] font-bold tracking-widest uppercase py-2.5 px-5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex items-center space-x-1.5 rounded-sm">
                    <Eye size={12} />
                    <span>
                      {language === 'ko' ? '작품 보기' : 'View Details'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Artwork Metadata (Styled like a museum wall plaque label) */}
              <div className="mt-5 flex flex-col space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif text-base text-neutral-900 font-normal">
                    {language === 'ko' ? artwork.artist : artwork.artistEn}
                  </h4>
                  <span className="font-sans text-[9px] text-neutral-400 uppercase tracking-widest">
                    {artwork.category}
                  </span>
                </div>

                <div className="flex flex-col">
                  <h5 className="font-serif text-sm font-light text-neutral-800 italic">
                    {language === 'ko' ? artwork.title : artwork.titleEn}
                    <span className="not-italic text-neutral-400 font-sans text-xs ml-1.5">
                      {artwork.year}
                    </span>
                  </h5>
                </div>

                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed font-light">
                  {language === 'ko' ? artwork.medium : artwork.mediumEn}
                </p>

                <p className="font-mono text-[10px] text-neutral-400">
                  {artwork.dimensions}
                </p>

                {/* Bottom line with price & inquiry CTA */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <span className="font-sans text-xs font-medium text-neutral-800">
                    {artwork.isInquireOnly
                      ? language === 'ko'
                        ? '별도 문의'
                        : 'Inquire Only'
                      : artwork.price}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onArtworkClick(artwork)}
                      title={language === 'ko' ? '정보' : 'Info'}
                      className="text-neutral-400 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-sm transition-colors"
                    >
                      <Info size={13} />
                    </button>
                    <button
                      onClick={() => onInquireClick(artwork)}
                      className="text-neutral-500 hover:text-neutral-900 font-sans text-[10px] font-bold tracking-widest uppercase border border-neutral-200 hover:border-neutral-900 px-3 py-1.5 transition-all duration-300 rounded-sm flex items-center space-x-1"
                    >
                      <Mail size={11} />
                      <span>{language === 'ko' ? '문의' : 'Inquire'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
