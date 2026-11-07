import { useState } from 'react';
import { Exhibition } from '../types';
import { ArrowRight, Clock, MapPin, Calendar } from 'lucide-react';

interface ExhibitionHeroProps {
  exhibition: Exhibition;
  language: 'ko' | 'en';
  onExploreClick: () => void;
}

export default function ExhibitionHero({
  exhibition,
  language,
  onExploreClick,
}: ExhibitionHeroProps) {
  const [readMore, setReadMore] = useState(false);

  return (
    <section
      id="exhibition"
      className="relative bg-[#fbfbfb] pt-0 pb-20 md:pb-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid Layout: Text Content left, Huge visual representation right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-0">
          {/* Exhibition Hero Image (7 Columns - Placed first) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-neutral-100">
              {/* Overlay with subtle scale */}
              <img
                src={exhibition.heroImage}
                alt={exhibition.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Image Captions (Minimalist style) */}
            <div className="flex justify-between items-start text-neutral-400 font-sans text-[10px] tracking-wider pt-2">
              <span className="font-light">
                {language === 'ko'
                  ? '김윤우, 개인전 《고요의 파동》 전시 전경, 서울아트 2026'
                  : 'Installation view, Yunwoo Kim: Waves of Silence, Seoul Art 2026'}
              </span>
              <span className="font-mono text-neutral-300">© SEOUL ART</span>
            </div>
          </div>

          {/* Curation Info (5 Columns - Placed after image) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full lg:sticky lg:top-28">
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-2">
                {language === 'ko'
                  ? `${exhibition.artist} 개인전`
                  : `Solo Exhibition by ${exhibition.artistEn}`}
              </p>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-tight tracking-wide mb-4">
                {language === 'ko' ? exhibition.title : exhibition.titleEn}
              </h2>

              <p className="font-serif text-xl md:text-2xl italic text-neutral-500 font-light mb-8">
                {language === 'ko' ? exhibition.artist : exhibition.artistEn}
              </p>

              {/* Date, Location Metadata */}
              <div className="space-y-4 border-t border-neutral-100 pt-8 pb-8">
                <div className="flex items-center space-x-3 text-neutral-600">
                  <Calendar size={15} className="text-neutral-400" />
                  <span className="font-sans text-xs font-medium tracking-wide">
                    {exhibition.startDate} — {exhibition.endDate}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-600">
                  <MapPin size={15} className="text-neutral-400" />
                  <span className="font-sans text-xs font-medium tracking-wide">
                    {language === 'ko'
                      ? '서울아트 본관 1-2홀'
                      : 'Main Gallery Halls 1 & 2'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-600">
                  <Clock size={15} className="text-neutral-400" />
                  <span className="font-sans text-xs font-medium tracking-wide">
                    {language === 'ko'
                      ? '화 — 일, 10:00 - 18:00 (월요일 휴관)'
                      : 'Tue — Sun, 10:00 AM - 6:00 PM (Closed Mondays)'}
                  </span>
                </div>
              </div>

              {/* Curation Note (Collapsible) */}
              <div className="relative mt-2">
                <h4 className="font-sans text-[10px] font-bold tracking-[0.15em] text-neutral-800 uppercase mb-3">
                  {language === 'ko' ? '기획 노트' : "Curator's Note"}
                </h4>
                <p
                  className={`font-sans text-[13px] text-neutral-600 leading-relaxed tracking-wide font-light whitespace-pre-line transition-all duration-500 ${
                    readMore
                      ? 'line-clamp-none'
                      : 'line-clamp-4 lg:line-clamp-5'
                  }`}
                >
                  {language === 'ko'
                    ? exhibition.curatorNote
                    : exhibition.curatorNoteEn}
                </p>

                <button
                  onClick={() => setReadMore(!readMore)}
                  className="mt-3 font-sans text-[10px] font-bold tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors uppercase flex items-center space-x-1"
                >
                  <span>
                    {readMore
                      ? language === 'ko'
                        ? '접기'
                        : 'Read Less'
                      : language === 'ko'
                        ? '기획 노트 더보기'
                        : 'Read Curation Note'}
                  </span>
                  <span
                    className={`transform transition-transform duration-300 ${readMore ? 'rotate-180' : ''}`}
                  >
                    ↓
                  </span>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={onExploreClick}
                className="bg-neutral-950 text-white font-sans text-xs font-medium tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 hover:bg-neutral-800 flex items-center space-x-3 group"
              >
                <span>
                  {language === 'ko' ? '출품작 둘러보기' : 'View Artworks'}
                </span>
                <ArrowRight
                  size={14}
                  className="transform transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <a
                href="#info"
                className="border border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:text-neutral-900 font-sans text-xs font-medium tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 flex items-center justify-center"
              >
                {language === 'ko' ? '오시는 길' : 'Visit Gallery'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
