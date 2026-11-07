import { useState } from 'react';
import { Artwork } from '../types';
interface ArtworkGridProps {
  artworks: Artwork[];
  language: 'ko' | 'en';
  onArtworkClick: (artwork: Artwork) => void;
  onInquireClick: (artwork: Artwork) => void;
}
export default function ArtworkGrid({
  artworks,
  language,
  onArtworkClick,
  onInquireClick,
}: ArtworkGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | Artwork['category']
  >('all');
  const ko = language === 'ko';
  const filters = [
    { id: 'all', ko: '전체', en: 'All works' },
    { id: 'monochrome', ko: '단색화', en: 'Monochrome' },
    { id: 'painting', ko: '회화', en: 'Painting' },
    { id: 'sculpture', ko: '조각', en: 'Sculpture' },
  ] as const;
  const filtered =
    selectedFilter === 'all'
      ? artworks
      : artworks.filter((art) => art.category === selectedFilter);
  return (
    <section id="artworks" className="editorial-section page-gutter">
      <div className="section-heading">
        <h2>{ko ? '선정 작품' : 'Selected works'}</h2>
        <span className="section-index">01 / COLLECTION</span>
      </div>
      <div
        className="work-filters"
        role="group"
        aria-label={ko ? '작품 분류' : 'Filter artworks'}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            aria-pressed={selectedFilter === filter.id}
            onClick={() => setSelectedFilter(filter.id)}
          >
            {ko ? filter.ko : filter.en}
          </button>
        ))}
      </div>
      <div className="works-grid">
        {filtered.map((art) => (
          <article className="work-card" key={art.id}>
            <button
              className="work-image"
              onClick={() => onArtworkClick(art)}
              aria-label={
                ko
                  ? `${art.artist}, ${art.title} 상세 보기`
                  : `View ${art.titleEn} by ${art.artistEn}`
              }
            >
              <img
                src={art.image}
                alt={ko ? art.title : art.titleEn}
                loading="lazy"
              />
            </button>
            <div className="work-caption">
              <div>
                <h3>{ko ? art.artist : art.artistEn}</h3>
                <p>
                  {ko ? art.title : art.titleEn}, {art.year}
                </p>
                <p className="muted work-medium">
                  {ko ? art.medium : art.mediumEn}
                  <br />
                  {art.dimensions}
                </p>
              </div>
              <button className="text-link" onClick={() => onInquireClick(art)}>
                {ko ? '작품 문의' : 'Inquire'} <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
