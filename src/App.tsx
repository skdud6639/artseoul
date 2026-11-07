import { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CollectionContent from './components/CollectionContent';
import GalleryInfo from './components/GalleryInfo';
import PageNavigation from './components/PageNavigation';
import ArtistsPage from './pages/ArtistsPage';
import HomePage from './pages/HomePage';
import ExhibitionsPage from './pages/ExhibitionsPage';

export default function App() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col">
      <PageNavigation language={language} />
      <a href="#main-content" className="skip-to-content">
        {language === 'ko' ? '본문으로 이동' : 'Skip to content'}
      </a>
      <Header key={pathname} language={language} setLanguage={setLanguage} />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow outline-none"
        key={pathname}
      >
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route
            path="/exhibitions"
            element={<ExhibitionsPage language={language} />}
          />
          <Route
            path="/artworks"
            element={
              <>
                <h1 className="sr-only">
                  {language === 'ko' ? '출품작' : 'Artworks'}
                </h1>
                <CollectionContent language={language} />
              </>
            }
          />
          <Route
            path="/artists"
            element={<ArtistsPage language={language} />}
          />
          <Route
            path="/viewing-room"
            element={
              <>
                <h1 className="sr-only">
                  {language === 'ko' ? '프라이빗 뷰잉룸' : 'Viewing Room'}
                </h1>
                <CollectionContent language={language} viewingRoom />
              </>
            }
          />
          <Route
            path="/visit"
            element={
              <>
                <h1 className="sr-only">
                  {language === 'ko' ? '갤러리 안내' : 'Visit'}
                </h1>
                <GalleryInfo language={language} />
              </>
            }
          />
          <Route
            path="*"
            element={
              <section className="py-32 px-6 text-center">
                <h1 className="text-3xl mb-6">
                  {language === 'ko'
                    ? '페이지를 찾을 수 없습니다.'
                    : 'Page not found.'}
                </h1>
                <Link to="/" className="underline">
                  {language === 'ko' ? '홈으로 돌아가기' : 'Return home'}
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
}
