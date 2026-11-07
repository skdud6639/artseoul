import { useEffect, useState, useRef } from 'react';
import { X, ArrowUp } from 'lucide-react';
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

export default function App() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [activeSection, setActiveSection] = useState('exhibition');
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);
  const [viewingRoomOpen, setViewingRoomOpen] = useState(false);
  const detailDialog = useRef<HTMLDialogElement>(null);
  const ko = language === 'ko';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-15% 0px -55% 0px' },
    );
    for (const id of ['exhibition', 'artworks', 'artists', 'info']) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (detailArtwork) detailDialog.current?.showModal();
    else detailDialog.current?.close();
  }, [detailArtwork]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };
  const inquire = (artwork: Artwork) => {
    setDetailArtwork(null);
    setInquiryArtwork(artwork);
  };

  return (
    <div className="gallery-app">
      <Header
        language={language}
        setLanguage={setLanguage}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      <main id="main">
        <ExhibitionHero
          exhibition={CURRENT_EXHIBITION}
          language={language}
          onExploreClick={() => scrollToSection('artworks')}
        />
        <ArtworkGrid
          artworks={ARTWORKS}
          language={language}
          onArtworkClick={setDetailArtwork}
          onInquireClick={inquire}
        />
        <ArtistShowcase artists={ARTISTS} language={language} />
        <section
          className="viewing-intro page-gutter"
          aria-labelledby="viewing-heading"
        >
          <div>
            <p className="eyebrow">03 / VIEWING ROOM</p>
            <h2 id="viewing-heading">
              {ko ? (
                <>
                  당신의 공간에서,
                  <br />
                  작품을 상상하다.
                </>
              ) : (
                <>
                  Imagine art.
                  <br />
                  In your own space.
                </>
              )}
            </h2>
            <p className="muted">
              {ko
                ? '벽의 색을 바꾸고 작품의 크기를 비교해 보세요.'
                : 'Explore wall colours and compare the scale of each artwork.'}
            </p>
            <button
              className="text-link"
              aria-expanded={viewingRoomOpen}
              aria-controls="viewing-content"
              onClick={() => setViewingRoomOpen(!viewingRoomOpen)}
            >
              {viewingRoomOpen
                ? ko
                  ? '뷰잉룸 닫기'
                  : 'Close viewing room'
                : ko
                  ? '가상 뷰잉룸 열기'
                  : 'Enter the viewing room'}
              <span aria-hidden="true">{viewingRoomOpen ? '−' : '↗'}</span>
            </button>
          </div>
          <div className="viewing-preview" aria-hidden="true">
            <img src={ARTWORKS[0].image} alt="" loading="lazy" />
            <span>ART SEOUL / IN CONTEXT</span>
          </div>
        </section>
        <div id="viewing-content">
          {viewingRoomOpen && (
            <InteractiveViewingRoom
              artworks={ARTWORKS}
              language={language}
              onInquireClick={inquire}
            />
          )}
        </div>
        <GalleryInfo language={language} />
      </main>
      <footer className="gallery-footer page-gutter">
        <div className="footer-top">
          <GalleryLogo className="footer-logo" />
          <p>
            {ko
              ? '동시대 미술을 만나는 새로운 시선.'
              : 'A fresh perspective on contemporary art.'}
          </p>
          <button
            className="text-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {ko ? '맨 위로' : 'Back to top'} <ArrowUp size={15} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ART SEOUL</span>
          <span>SEOUL, SOUTH KOREA</span>
        </div>
      </footer>
      <InquiryModal
        artwork={inquiryArtwork}
        isOpen={inquiryArtwork !== null}
        onClose={() => setInquiryArtwork(null)}
        language={language}
      />
      <dialog
        ref={detailDialog}
        className="art-dialog"
        aria-labelledby="detail-title"
        onClose={() => setDetailArtwork(null)}
      >
        {detailArtwork && (
          <>
            <button
              className="dialog-close"
              onClick={() => setDetailArtwork(null)}
              aria-label={ko ? '닫기' : 'Close'}
            >
              <X />
            </button>
            <div className="detail-layout">
              <div className="detail-image">
                <img
                  src={detailArtwork.image}
                  alt={ko ? detailArtwork.title : detailArtwork.titleEn}
                />
              </div>
              <div className="detail-copy">
                <p className="eyebrow">ART SEOUL / SELECTED WORK</p>
                <h2 id="detail-title">
                  {ko ? detailArtwork.artist : detailArtwork.artistEn}
                </h2>
                <h3>
                  {ko ? detailArtwork.title : detailArtwork.titleEn},{' '}
                  {detailArtwork.year}
                </h3>
                <p className="muted">
                  {ko ? detailArtwork.medium : detailArtwork.mediumEn}
                  <br />
                  {detailArtwork.dimensions}
                </p>
                <p>
                  {ko ? detailArtwork.description : detailArtwork.descriptionEn}
                </p>
                <button
                  className="text-link"
                  onClick={() => inquire(detailArtwork)}
                >
                  {ko ? '작품 문의' : 'Inquire about this work'}{' '}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
