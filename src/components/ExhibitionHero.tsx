import { Exhibition } from '../types';

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
  const ko = language === 'ko';
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const start = exhibition.startDate.replace(/\.\s*/g, '-');
  const end = exhibition.endDate.replace(/\.\s*/g, '-');
  const status =
    today > end
      ? ko
        ? '지난 전시'
        : 'Past exhibition'
      : today < start
        ? ko
          ? '예정 전시'
          : 'Upcoming exhibition'
        : ko
          ? '현재 전시'
          : 'On view';
  return (
    <section id="exhibition" className="exhibition-section">
      <div className="hero-image">
        <img
          src={exhibition.heroImage}
          alt={
            ko
              ? `${exhibition.title} 전시 이미지`
              : `${exhibition.titleEn}, exhibition image`
          }
          fetchPriority="high"
        />
        <span className="hero-image-label">ART SEOUL / EXHIBITIONS</span>
      </div>
      <div className="hero-caption page-gutter">
        <div className="hero-caption-title">
          <p className="eyebrow">
            {status} <span>2026</span>
          </p>
          <h1>
            {ko ? exhibition.artist : exhibition.artistEn}
            <span>{ko ? exhibition.title : exhibition.titleEn}</span>
          </h1>
        </div>
        <div className="hero-caption-meta">
          <p>{ko ? '서울아트 · 삼청' : 'Seoul Art · Samcheong'}</p>
          <p className="muted">
            {exhibition.startDate} — {exhibition.endDate}
          </p>
          <button className="text-link" onClick={onExploreClick}>
            {ko ? '전시 작품 둘러보기' : 'Explore the artworks'}{' '}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <details className="curator-note page-gutter">
        <summary>
          {ko ? '전시에 관하여' : 'About the exhibition'}
          <span aria-hidden="true">+</span>
        </summary>
        <p>{ko ? exhibition.curatorNote : exhibition.curatorNoteEn}</p>
      </details>
    </section>
  );
}
