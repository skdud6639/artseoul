import { useState, useEffect } from 'react';
import { ARTWORKS, ARTISTS, CURRENT_EXHIBITION } from './data';
import { Artwork } from './types';
import Header from './components/Header';
import ExhibitionHero from './components/ExhibitionHero';
import ArtworkGrid from './components/ArtworkGrid';
import ArtistShowcase from './components/ArtistShowcase';
import InteractiveViewingRoom from './components/InteractiveViewingRoom';
import GalleryInfo from './components/GalleryInfo';
import InquiryModal from './components/InquiryModal';
import GalleryLogo from './components/GalleryLogo';
import { Mail, X, ArrowUp, Instagram, Facebook } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [activeSection, setActiveSection] = useState('exhibition');
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll tracking to update header active section highlight
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const sections = [
        'exhibition',
        'artworks',
        'artists',
        'viewing-room',
        'info',
      ];
      const scrollPosition = window.scrollY + 200; // Offset for header height

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const handleInquireClick = (artwork: Artwork) => {
    setInquiryArtwork(artwork);
    setIsInquiryModalOpen(true);
  };

  const handleOpenDetail = (artwork: Artwork) => {
    setDetailArtwork(artwork);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      {/* 1. Header Navigation */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 2. Exhibition Hero Section */}
        <ExhibitionHero
          exhibition={CURRENT_EXHIBITION}
          language={language}
          onExploreClick={() => scrollToSection('artworks')}
        />

        {/* 3. Artworks Grid Collection Section */}
        <ArtworkGrid
          artworks={ARTWORKS}
          language={language}
          onArtworkClick={handleOpenDetail}
          onInquireClick={handleInquireClick}
        />

        {/* 4. Artist Profiles Showcase Section */}
        <ArtistShowcase artists={ARTISTS} language={language} />

        {/* 5. Interactive Viewing Scale Room */}
        <InteractiveViewingRoom
          artworks={ARTWORKS}
          language={language}
          onInquireClick={handleInquireClick}
        />

        {/* 6. Gallery Visit & Office Information */}
        <GalleryInfo language={language} />
      </main>

      {/* 7. Beautifully Crafted Minimal Footer */}
      <footer className="bg-[#f2f2f2] border-t border-neutral-200/60 py-16 text-neutral-500 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-neutral-300/40 pb-12">
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <GalleryLogo className="h-8 w-auto text-neutral-800" />
              <p className="max-w-xs font-light text-neutral-500 text-[11px] leading-relaxed">
                {language === 'ko'
                  ? '정제된 미니멀리즘과 절제된 공간 미학을 바탕으로, 동시대 현대 미술의 깊이 있는 예술적 담론과 마스터피스를 선보이는 갤러리입니다.'
                  : 'Inspired by refined minimalist aesthetics and restrained space, showcasing contemporary art discourse and curated masterworks.'}
              </p>
            </div>

            {/* Links columns */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-semibold text-neutral-800 text-[10px] tracking-widest uppercase">
                {language === 'ko' ? '기획 프로젝트' : 'Gallery Divisions'}
              </h4>
              <ul className="space-y-2 font-light text-neutral-400">
                <li>
                  <button
                    onClick={() => scrollToSection('exhibition')}
                    className="hover:text-neutral-800 transition-colors"
                  >
                    {language === 'ko' ? '현재 기획 전시' : 'Solo Exhibitions'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('artworks')}
                    className="hover:text-neutral-800 transition-colors"
                  >
                    {language === 'ko'
                      ? '소장 출품작 마스터피스'
                      : 'Acquisitions'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('viewing-room')}
                    className="hover:text-neutral-800 transition-colors"
                  >
                    {language === 'ko'
                      ? '프라이빗 3D 버추얼 룸'
                      : 'Scale Simulator'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Location info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-semibold text-neutral-800 text-[10px] tracking-widest uppercase">
                {language === 'ko' ? '대표 사무소' : 'Headquarters'}
              </h4>
              <p className="font-light text-neutral-400 text-[11px] leading-relaxed">
                {language === 'ko'
                  ? '서울특별시 종로구 삼청로 124 (삼청동) 서울아트빌딩'
                  : 'Seoul Art Building, 124 Samcheong-ro, Jongno-gu, Seoul, South Korea'}
                <br />
                T. +82 (0)2 730 0934 | F. +82 (0)2 730 0935
              </p>

              {/* Social Channels */}
              <div className="flex space-x-3 pt-1">
                <a
                  href="#"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors"
                  title="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors"
                  title="Facebook"
                >
                  <Facebook size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright row */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-neutral-400 text-[10px] tracking-wider gap-4">
            <span>&copy; 2026 SEOUL ART GALLERY. ALL RIGHTS RESERVED.</span>
            <span className="font-light uppercase">
              {language === 'ko'
                ? '기획자 및 큐레이터 정보: 서울아트 클라이언트 릴레이션'
                : 'Curation Desk: Seoul Art Client Services'}
            </span>
          </div>
        </div>
      </footer>

      {/* 8. Floating Action: Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-white text-neutral-900 border border-neutral-200 p-3 shadow-lg hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300 cursor-pointer rounded-full"
          title={language === 'ko' ? '상단으로 이동' : 'Scroll to top'}
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* 9. Dynamic Interactive Inquiry Modal */}
      <InquiryModal
        artwork={inquiryArtwork}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        language={language}
      />

      {/* 10. Selected Artwork Details Modal (Pristine curator-level detail review) */}
      {detailArtwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop overlay */}
          <div
            onClick={() => setDetailArtwork(null)}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <div className="relative bg-white text-neutral-900 w-full max-w-4xl shadow-2xl border border-neutral-100 flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-sm animate-fade-in-up">
            {/* Close button inside modal */}
            <button
              onClick={() => setDetailArtwork(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 text-neutral-950 p-2 border border-neutral-100 hover:bg-neutral-100 transition-colors rounded-sm shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Left Column: Visual Area (Hangs painting with high-end border) */}
            <div className="md:w-1/2 bg-[#f4f4f4] p-8 flex items-center justify-center border-r border-neutral-100 overflow-hidden min-h-[300px]">
              <div className="relative shadow-xl max-h-[50vh] max-w-[90%] border border-neutral-200/50">
                <img
                  src={detailArtwork.image}
                  alt={detailArtwork.titleEn}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column: Detailed Curation Label */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                {/* Artist name & Year */}
                <div>
                  <p className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {language === 'ko'
                      ? '출품작 상세 보기'
                      : 'Acquisitions Catalogue'}
                  </p>
                  <h3 className="font-serif text-3xl text-neutral-900 font-light mt-1.5">
                    {language === 'ko'
                      ? detailArtwork.artist
                      : detailArtwork.artistEn}
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-400 font-light uppercase tracking-wider mt-0.5">
                    Represented Contemporary Master
                  </p>
                </div>

                {/* Title & Technical specifications */}
                <div className="border-t border-b border-neutral-100 py-5 space-y-2">
                  <h4 className="font-serif text-lg italic text-neutral-800">
                    {language === 'ko'
                      ? detailArtwork.title
                      : detailArtwork.titleEn}
                  </h4>

                  <div className="space-y-1.5 font-sans text-xs text-neutral-500 font-light leading-relaxed">
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '매체 및 기법:' : 'Medium:'}
                      </strong>{' '}
                      {language === 'ko'
                        ? detailArtwork.medium
                        : detailArtwork.mediumEn}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '크기 / 규격:' : 'Dimensions:'}
                      </strong>{' '}
                      {detailArtwork.dimensions}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '제작 연도:' : 'Year of Creation:'}
                      </strong>{' '}
                      {detailArtwork.year}
                    </p>
                  </div>
                </div>

                {/* Curator commentary note */}
                <div className="space-y-2">
                  <h5 className="font-sans text-[10px] font-bold text-neutral-800 uppercase tracking-widest">
                    {language === 'ko'
                      ? '작품 평론 및 해설'
                      : 'Curatorial Commentary'}
                  </h5>
                  <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                    {language === 'ko'
                      ? detailArtwork.description
                      : detailArtwork.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="block font-sans text-[9px] text-neutral-400 uppercase tracking-widest">
                    {language === 'ko' ? '추정 소장가' : 'Estimated Value'}
                  </span>
                  <span className="font-sans text-base font-bold text-neutral-900">
                    {detailArtwork.isInquireOnly
                      ? language === 'ko'
                        ? '별도 가격 문의'
                        : 'Inquire Only'
                      : detailArtwork.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const artwork = detailArtwork;
                    setDetailArtwork(null);
                    handleInquireClick(artwork);
                  }}
                  className="bg-neutral-950 text-white font-sans text-xs font-semibold tracking-widest uppercase px-6 py-3.5 hover:bg-neutral-800 transition-colors rounded-sm flex items-center space-x-2"
                >
                  <Mail size={12} />
                  <span>{language === 'ko' ? '소장 문의' : 'Inquire'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
