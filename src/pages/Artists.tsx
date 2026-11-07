import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { artists, artworks } from '../catalog';
import { ArtworkCard } from './Artworks';
import '../styles/catalog.css';

export function ArtistsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const filtered = artists
    .filter((artist) =>
      `${artist.name} ${artist.nameEn}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  return (
    <div className="container catalog-page">
      <header className="page-intro">
        <p className="eyebrow">ARTISTS & PERSPECTIVES</p>
        <h1>작품 너머의 시선</h1>
        <p>작가의 시선에서 시작해 우리 공간의 새로운 가능성을 살펴봅니다.</p>
      </header>
      <div className="catalog-artists-toolbar">
        <label className="catalog-search">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">작가 이름 검색</span>
          <input
            type="search"
            placeholder="작가 이름 검색"
            value={query}
            onChange={(event) =>
              setParams(event.target.value ? { q: event.target.value } : {}, {
                replace: true,
              })
            }
          />
        </label>
        <p className="muted" aria-live="polite">
          가나다 순 · {filtered.length}명
        </p>
      </div>
      <p className="catalog-notice">
        현재 작가와 작품은 큐레이션 방향을 소개하는 콘텐츠 예시입니다. 작가
        이력, 취급 관계와 실제 렌탈 가능 작품은 확인 후 안내합니다.
      </p>
      {filtered.length ? (
        <div className="catalog-artists-grid">
          {filtered.map((artist, index) => (
            <article key={artist.id} className="catalog-artist-card">
              <Link
                to={`/artists/${artist.slug}`}
                className="catalog-artist-image"
              >
                <img
                  src={artist.image}
                  alt={`${artist.name} 작품 이미지 예시`}
                  loading="lazy"
                />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </Link>
              <div className="catalog-artist-caption">
                <div>
                  <span className="catalog-sample-inline">
                    작가 콘텐츠 예시
                  </span>
                  <h2>
                    <Link to={`/artists/${artist.slug}`}>{artist.name}</Link>
                  </h2>
                  <p>{artist.nameEn}</p>
                </div>
                <Link
                  to={`/artists/${artist.slug}`}
                  aria-label={`${artist.name} 작가 상세 보기`}
                  className="catalog-artist-arrow"
                >
                  <ArrowRight size={22} strokeWidth={1.2} aria-hidden="true" />
                </Link>
              </div>
              <p className="catalog-artist-description">{artist.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <h2>찾는 작가가 없습니다</h2>
          <p>한글 또는 영문 이름으로 다시 검색해 보세요.</p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => setParams({})}
          >
            모든 작가 보기
          </button>
        </div>
      )}
      <aside className="catalog-consult">
        <div>
          <p className="eyebrow">FIND YOUR PERSPECTIVE</p>
          <h2>좋아하는 작품의 방향을 알려주세요</h2>
          <p>작가를 정하지 않아도 공간과 취향에서 상담을 시작할 수 있습니다.</p>
        </div>
        <Link to="/inquiry?service=consulting" className="text-link">
          공간 상담 시작하기 <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}

export function ArtistPage() {
  const { slug } = useParams();
  const artist = artists.find((entry) => entry.slug === slug);
  if (!artist)
    return (
      <div className="container catalog-empty">
        <h1>작가를 찾을 수 없습니다</h1>
        <p>작가 목록에서 다시 살펴보세요.</p>
        <Link to="/artists" className="button button-dark">
          작가 목록
        </Link>
      </div>
    );
  const related = artworks.filter((artwork) => artwork.artistId === artist.id);

  return (
    <div className="container catalog-page">
      <nav className="catalog-breadcrumb" aria-label="현재 위치">
        <Link to="/artists">
          <ArrowLeft size={15} aria-hidden="true" /> 작가 목록
        </Link>
        <span>/</span>
        <span>{artist.name}</span>
      </nav>
      <section className="catalog-artist-profile">
        <div className="catalog-artist-profile-copy">
          <p className="eyebrow">ARTIST PERSPECTIVE</p>
          <span className="tag">작가 콘텐츠 예시</span>
          <h1>{artist.name}</h1>
          <p className="catalog-artist-english">{artist.nameEn}</p>
          <p>{artist.description}</p>
          <div className="catalog-profile-note">
            <h2>작품과 공간을 함께 살펴봅니다</h2>
            <p>
              아래 작품을 통해 선호하는 분위기를 전달할 수 있습니다. 실제 작가
              소개와 이력, 작품 취급 관계, 이용 가능 여부는 확인 후 안내합니다.
            </p>
          </div>
          <Link
            to={`/inquiry?service=consulting&artworks=${related.map((artwork) => artwork.id).join(',')}`}
            className="text-link"
          >
            이런 분위기로 상담하기 <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <figure>
          <img
            src={artist.image}
            alt={`${artist.name} 작품 공간 배치 이미지 예시`}
          />
          <figcaption>
            작가의 인물 사진이 아닌 작품 배치 이미지 예시입니다.
          </figcaption>
        </figure>
      </section>
      <section className="catalog-artist-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORKS</p>
            <h2>살펴볼 작품</h2>
          </div>
          <Link to="/artworks" className="text-link">
            전체 작품 <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <p className="catalog-notice">
          대표작 소개와 렌탈 가능 재고는 다릅니다. 실제 작품과 가용 일정은 상담
          후 확인합니다.
        </p>
        <div className="catalog-grid">
          {related.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </div>
  );
}
