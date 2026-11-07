import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const titles: Record<string, { ko: string; en: string }> = {
  '/': { ko: '서울아트', en: 'Seoul Art' },
  '/exhibitions': { ko: '현재 전시', en: 'Exhibitions' },
  '/artworks': { ko: '출품작', en: 'Artworks' },
  '/artists': { ko: '아티스트', en: 'Artists' },
  '/viewing-room': { ko: '프라이빗 뷰잉룸', en: 'Viewing Room' },
  '/visit': { ko: '갤러리 안내', en: 'Visit' },
};

export default function PageNavigation({
  language,
}: {
  language: 'ko' | 'en';
}) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const title =
      titles[pathname]?.[language] ??
      (language === 'ko' ? '페이지를 찾을 수 없습니다' : 'Page not found');
    document.title = `${title} | ART SEOUL`;
    document.documentElement.lang = language;
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname, language]);
  return null;
}
