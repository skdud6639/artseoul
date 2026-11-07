import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GalleryLogo from './GalleryLogo';

interface HeaderProps {
  language: 'ko' | 'en';
  setLanguage: (language: 'ko' | 'en') => void;
}

const menuItems = [
  { path: '/exhibitions', ko: '현재 전시', en: 'Exhibitions' },
  { path: '/artworks', ko: '출품작', en: 'Artworks' },
  { path: '/artists', ko: '아티스트', en: 'Artists' },
  { path: '/viewing-room', ko: '프라이빗 뷰잉룸', en: 'Viewing Room' },
  { path: '/visit', ko: '갤러리 안내', en: 'Information' },
];

export default function Header({ language, setLanguage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="w-full px-6 md:px-10 lg:px-12 h-20 flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="ART SEOUL — Home"
          className="shrink-0"
        >
          <GalleryLogo className="h-5 sm:h-6 md:h-7 w-auto text-neutral-900" />
        </Link>
        <div className="hidden lg:flex items-center gap-7 xl:gap-9">
          <nav
            aria-label={language === 'ko' ? '주 메뉴' : 'Main navigation'}
            className="flex items-center gap-6 xl:gap-8"
          >
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-sans text-[13px] py-2 border-b transition-colors ${isActive ? 'text-neutral-950 border-neutral-950' : 'text-neutral-600 border-transparent hover:text-neutral-950 hover:border-neutral-400'}`
                }
              >
                {language === 'ko' ? item.ko : item.en}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
            <button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="text-[13px]"
            >
              {language === 'ko' ? 'ENG' : '한글'}
            </button>
            <Link
              to="/visit"
              className="bg-neutral-950 text-white text-xs px-4 py-2"
            >
              {language === 'ko' ? '문의' : 'Inquire'}
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden items-center gap-5">
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="text-xs"
          >
            {language === 'ko' ? 'ENG' : '한글'}
          </button>
          <button
            aria-label={language === 'ko' ? '메뉴' : 'Menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 flex flex-col justify-center gap-1.5"
          >
            <span
              className={`block h-px w-6 bg-neutral-900 transition-transform ${isMenuOpen ? 'translate-y-1 rotate-45' : ''}`}
            />
            <span
              className={`block h-px w-6 bg-neutral-900 transition-transform ${isMenuOpen ? '-translate-y-1 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label={language === 'ko' ? '모바일 메뉴' : 'Mobile navigation'}
          className="lg:hidden border-t border-neutral-100 bg-white px-6 py-5 flex flex-col gap-1"
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `py-3 text-sm ${isActive ? 'font-semibold text-neutral-950' : 'text-neutral-500'}`
              }
            >
              {language === 'ko' ? item.ko : item.en}
            </NavLink>
          ))}
          <Link to="/visit" onClick={closeMenu} className="py-3 text-sm">
            {language === 'ko' ? '문의' : 'Inquire'}
          </Link>
        </nav>
      )}
    </header>
  );
}
