import { useState } from 'react';

import GalleryLogo from './GalleryLogo';

interface HeaderProps {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function Header({
  language,
  setLanguage,
  activeSection,
  scrollToSection,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'exhibition', ko: '현재 전시', en: 'Current Exhibition' },
    { id: 'artworks', ko: '출품작', en: 'Artworks' },
    { id: 'artists', ko: '작가', en: 'Artists' },
    { id: 'viewing-room', ko: '프라이빗 뷰잉룸', en: 'Viewing Room' },
    { id: 'info', ko: '갤러리 안내', en: 'Information' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="w-full px-6 md:px-10 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo - ART SEOUL */}
        <div
          onClick={() => scrollToSection('exhibition')}
          className="cursor-pointer group flex items-center select-none py-1 transition-opacity hover:opacity-80"
          title="ART SEOUL"
        >
          <GalleryLogo className="h-5 sm:h-6 md:h-7 w-auto text-neutral-900 transition-colors duration-300" />
        </div>

        {/* Right Section: Desktop Navigation + Language/Controls with refined David Zwirner spacing */}
        <div className="hidden md:flex items-center space-x-7 lg:space-x-9">
          <nav className="flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-sans text-[12px] lg:text-[13px] font-normal tracking-wide transition-colors duration-200 relative py-2 ${
                    isActive
                      ? 'text-neutral-950 font-medium'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {language === 'ko' ? item.ko : item.en}
                </button>
              );
            })}
          </nav>

          {/* Right Controls - Language & Quick Contact */}
          <div className="flex items-center space-x-4 pl-3 border-l border-neutral-200">
            <button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="font-sans text-[12px] lg:text-[13px] text-neutral-700 hover:text-neutral-950 transition-colors"
            >
              {language === 'ko' ? 'ENG' : '한글'}
            </button>

            <button
              onClick={() => scrollToSection('inquiry')}
              className="bg-neutral-950 text-white font-sans text-[11px] font-medium tracking-[0.1em] uppercase px-4 py-2 transition-all duration-200 hover:bg-neutral-800"
            >
              {language === 'ko' ? '문의' : 'Inquire'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="font-sans text-[10px] font-bold tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors border border-neutral-200 px-2 py-1 rounded"
          >
            {language === 'ko' ? 'EN' : 'KO'}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col space-y-1.5 justify-center items-end w-6 h-6 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1px] bg-neutral-950 transition-all duration-300 ${isMenuOpen ? 'w-6 translate-y-2 rotate-45' : 'w-6'}`}
            />
            <span
              className={`h-[1px] bg-neutral-950 transition-all duration-300 ${isMenuOpen ? 'opacity-0 w-0' : 'w-4'}`}
            />
            <span
              className={`h-[1px] bg-neutral-950 transition-all duration-300 ${isMenuOpen ? 'w-6 -translate-y-[7px] -rotate-45' : 'w-5'}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 z-40 animate-fade-in-down">
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`text-left font-sans text-xs font-semibold tracking-[0.15em] uppercase py-2 border-b border-gray-50 ${
                  activeSection === item.id
                    ? 'text-neutral-900 pl-2 border-neutral-900'
                    : 'text-neutral-500'
                }`}
              >
                {language === 'ko' ? item.ko : item.en}
              </button>
            ))}

            <button
              onClick={() => {
                scrollToSection('inquiry');
                setIsMenuOpen(false);
              }}
              className="bg-neutral-950 text-white font-sans text-[11px] font-semibold tracking-[0.15em] uppercase w-full py-3.5 text-center transition-all duration-300 hover:bg-neutral-800"
            >
              {language === 'ko' ? '작품 및 전시 문의' : 'Inquire'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
