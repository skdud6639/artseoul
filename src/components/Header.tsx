import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const items = [
    { id: 'exhibition', ko: '전시', en: 'Exhibition' },
    { id: 'artworks', ko: '작품', en: 'Artworks' },
    { id: 'artists', ko: '작가', en: 'Artists' },
    { id: 'info', ko: '방문 안내', en: 'Visit' },
  ];
  const navigate = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };
  return (
    <header className="gallery-header">
      <a className="skip-link" href="#main">
        {language === 'ko' ? '본문으로 이동' : 'Skip to content'}
      </a>
      <button
        className="brand"
        onClick={() => navigate('exhibition')}
        aria-label="ART SEOUL — Home"
      >
        <GalleryLogo className="brand-logo" />
      </button>
      <nav
        className="desktop-nav"
        aria-label={language === 'ko' ? '주 메뉴' : 'Main navigation'}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            aria-current={activeSection === item.id ? 'location' : undefined}
          >
            {language === 'ko' ? item.ko : item.en}
          </button>
        ))}
      </nav>
      <div className="header-tools">
        <button
          onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
          className="language-switch"
        >
          {language === 'ko' ? 'ENG' : '한글'}
        </button>
        <button className="header-contact" onClick={() => navigate('info')}>
          {language === 'ko' ? '문의' : 'Contact'}{' '}
          <span aria-hidden="true">↗</span>
        </button>
        <button
          className="mobile-menu-button"
          aria-label={language === 'ko' ? '메뉴 열기 / 닫기' : 'Toggle menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label={language === 'ko' ? '모바일 메뉴' : 'Mobile navigation'}
        >
          {items.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)}>
              {language === 'ko' ? item.ko : item.en}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
