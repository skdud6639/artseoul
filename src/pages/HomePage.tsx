import { Link } from 'react-router-dom';
import ExhibitionsPage from './ExhibitionsPage';

export default function HomePage({ language }: { language: 'ko' | 'en' }) {
  const links = [
    { path: '/artworks', ko: '출품작 둘러보기', en: 'Explore artworks' },
    { path: '/artists', ko: '아티스트 만나기', en: 'Meet our artists' },
    { path: '/visit', ko: '갤러리 방문 안내', en: 'Plan your visit' },
  ];
  return (
    <>
      <ExhibitionsPage language={language} />
      <nav
        className="home-page-links"
        aria-label={
          language === 'ko' ? '갤러리 둘러보기' : 'Explore the gallery'
        }
      >
        {links.map((link) => (
          <Link key={link.path} to={link.path}>
            {language === 'ko' ? link.ko : link.en}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
