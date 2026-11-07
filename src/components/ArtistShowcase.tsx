import { Artist } from '../types';
interface ArtistShowcaseProps {
  artists: Artist[];
  language: 'ko' | 'en';
}
export default function ArtistShowcase({
  artists,
  language,
}: ArtistShowcaseProps) {
  const ko = language === 'ko';
  return (
    <section id="artists" className="editorial-section page-gutter">
      <div className="section-heading">
        <h2>{ko ? '작가를 만나다' : 'Meet the artists'}</h2>
        <span className="section-index">02 / ARTISTS</span>
      </div>
      <div className="artists-grid">
        {artists.map((artist) => (
          <article className="artist-card" key={artist.id}>
            <img
              src={artist.image}
              alt={ko ? `${artist.name}의 작품` : `Work by ${artist.nameEn}`}
              loading="lazy"
            />
            <h3>{ko ? artist.name : artist.nameEn}</h3>
            <p className="muted">
              {ko ? artist.nameEn : `Born ${artist.birthYear}`}
            </p>
            <details>
              <summary>
                {ko ? '작가 소개' : 'About the artist'}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{ko ? artist.bio : artist.bioEn}</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
