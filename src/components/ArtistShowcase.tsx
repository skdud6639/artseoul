import { useState } from 'react';
import { Artist } from '../types';
import { Sparkles, Calendar, Award, BookOpen } from 'lucide-react';

interface ArtistShowcaseProps {
  artists: Artist[];
  language: 'ko' | 'en';
}

export default function ArtistShowcase({ artists, language }: ArtistShowcaseProps) {
  const [selectedArtistId, setSelectedArtistId] = useState<string>(artists[0].id);

  const selectedArtist = artists.find(a => a.id === selectedArtistId) || artists[0];

  return (
    <section id="artists" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-900 uppercase">
            {language === 'ko' ? '작가 정보' : 'Represented Artists'}
          </span>
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl font-light text-neutral-900 tracking-wide mb-16">
          {language === 'ko' ? '전속 작가 프로필' : 'Represented Artists Profile'}
        </h2>

        {/* Layout: Left Sidebar (Artist List), Right Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Artist Selector Sidebar (3 Columns) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-neutral-100 lg:space-y-4 gap-4 lg:gap-0 scrollbar-none">
            {artists.map((artist) => {
              const isSelected = artist.id === selectedArtistId;
              return (
                <button
                  key={artist.id}
                  onClick={() => setSelectedArtistId(artist.id)}
                  className={`flex-shrink-0 text-left font-serif text-lg md:text-xl py-3 px-5 lg:px-6 transition-all duration-300 relative lg:border-r-[2.5px] rounded-sm ${
                    isSelected 
                      ? 'bg-neutral-950 text-white font-medium lg:border-neutral-950 shadow-md' 
                      : 'bg-white text-neutral-500 hover:text-neutral-900 border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <span className="block text-sm md:text-base">
                    {language === 'ko' ? artist.name : artist.nameEn}
                  </span>
                  <span className="block text-[10px] font-sans font-light tracking-widest uppercase opacity-70 mt-1">
                    {language === 'ko' ? artist.nameEn : `b. ${artist.birthYear}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Artist Details Main Panel (9 Columns) */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 animate-fade-in">
            
            {/* Left side: Bio & Education */}
            <div className="md:col-span-7 space-y-8">
              <div>
                <div className="flex items-baseline space-x-3 mb-1">
                  <h3 className="font-serif text-3xl text-neutral-900 font-light">
                    {language === 'ko' ? selectedArtist.name : selectedArtist.nameEn}
                  </h3>
                  <span className="font-sans text-xs text-neutral-400 font-light">
                    {language === 'ko' ? `${selectedArtist.birthYear}년 출생` : `Born in ${selectedArtist.birthYear}`}
                  </span>
                </div>
                <p className="font-sans text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-6">
                  {language === 'ko' ? `서울아트 전속 전속 연도: ${selectedArtist.representedSince}` : `Represented by Seoul Art since ${selectedArtist.representedSince}`}
                </p>

                <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line tracking-wide">
                  {language === 'ko' ? selectedArtist.bio : selectedArtist.bioEn}
                </p>
              </div>

              {/* Education Section */}
              <div className="border-t border-neutral-100 pt-6">
                <h4 className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-800 uppercase mb-4 flex items-center gap-2">
                  <BookOpen size={13} className="text-neutral-400" />
                  {language === 'ko' ? '학력 사항' : 'Education'}
                </h4>
                <ul className="space-y-2.5">
                  {selectedArtist.education.map((edu, idx) => (
                    <li key={idx} className="font-sans text-[12px] text-neutral-500 font-light leading-relaxed flex items-start gap-2">
                      <span className="text-neutral-300 mt-1">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Major Exhibitions Section */}
              <div className="border-t border-neutral-100 pt-6">
                <h4 className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-800 uppercase mb-4 flex items-center gap-2">
                  <Award size={13} className="text-neutral-400" />
                  {language === 'ko' ? '주요 전시 이력' : 'Selected Exhibitions'}
                </h4>
                <ul className="space-y-3">
                  {selectedArtist.exhibitions.map((exh, idx) => (
                    <li key={idx} className="font-sans text-[12px] text-neutral-500 font-light leading-relaxed flex items-start gap-2">
                      <span className="text-neutral-300 mt-1">•</span>
                      <span>{exh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: Artwork/Portrait Illustration */}
            <div className="md:col-span-5">
              <div className="relative bg-white p-4 shadow-[0_15px_35px_rgba(0,0,0,0.02)] border border-neutral-100">
                <img
                  src={selectedArtist.image}
                  alt={selectedArtist.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="mt-4 flex flex-col space-y-1">
                  <span className="font-sans text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    {language === 'ko' ? '대표 작가 작품 프리뷰' : 'Featured Work Preview'}
                  </span>
                  <span className="font-serif text-[12px] italic text-neutral-700 font-light">
                    {language === 'ko' ? `${selectedArtist.name}의 미학 공간` : `Aesthetic vision by ${selectedArtist.nameEn}`}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
