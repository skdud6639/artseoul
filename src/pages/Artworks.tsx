import { useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { artists, artworks } from '../catalog';
import type { RentalArtwork } from '../domain';
import { useSelection } from '../state/selection';
import '../styles/catalog.css';

const categories = {
  painting: '회화',
  sculpture: '조각',
  monochrome: '단색화',
};
const spaceLabels: Record<string, string> = {
  office: '오피스',
  healthcare: '병원·클리닉',
  hospitality: '호텔·라운지',
  retail: '매장·브랜드 공간',
};

function monthlyPrice(artwork: RentalArtwork) {
  return artwork.rentalMonthly === null
    ? '렌탈료 상담 후 안내'
    : `월 ${artwork.rentalMonthly.toLocaleString('ko-KR')}원`;
}

function availabilityLabel(artwork: RentalArtwork) {
  if (artwork.availability === 'available') return '렌탈 가능 · 일정 확인';
  if (artwork.availability === 'rented') return '대여 중 · 대안 문의';
  return '렌탈 가능 여부 확인';
}

export function ArtworkCard({
  artwork,
  search = '',
}: {
  artwork: RentalArtwork;
  search?: string;
}) {
  const { ids, toggle } = useSelection();
  const artist = artists.find((entry) => entry.id === artwork.artistId);
  const selected = ids.includes(artwork.id);

  return (
    <article className="catalog-card">
      <div className="catalog-card-image">
        <Link
          to={`/artworks/${artwork.slug}`}
          state={{ catalogSearch: search }}
          aria-label={`${artwork.title} 상세 보기`}
        >
          <img
            src={artwork.image}
            alt={`${artist?.name ?? ''} — ${artwork.title}, 공간 배치 이미지 예시`}
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          className={`catalog-save ${selected ? 'is-saved' : ''}`}
          onClick={() => toggle(artwork.id)}
          aria-pressed={selected}
          aria-label={`${artwork.title} ${selected ? '관심 작품에서 제거' : '관심 작품에 담기'}`}
        >
          <Heart
            size={18}
            fill={selected ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
        {artwork.sample && (
          <span className="catalog-sample">큐레이션 예시</span>
        )}
      </div>
      <div className="catalog-card-meta">
        <div>
          <p className="catalog-artist">{artist?.name}</p>
          <h2>
            <Link
              to={`/artworks/${artwork.slug}`}
              state={{ catalogSearch: search }}
            >
              {artwork.title}
            </Link>
          </h2>
          <p className="muted">
            {categories[artwork.category]} · {artwork.widthCm} ×{' '}
            {artwork.heightCm} cm
          </p>
        </div>
        <ArrowRight size={18} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <div className="catalog-card-price">
        <span>{monthlyPrice(artwork)}</span>
        <span>{availabilityLabel(artwork)}</span>
      </div>
    </article>
  );
}

export function ArtworksPage() {
  const [params, setParams] = useSearchParams();
  const { ids } = useSelection();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const space = params.get('space') ?? '';
  const size = params.get('size') ?? '';
  const price = params.get('price') ?? '';
  const available = params.get('availability') ?? '';
  const sort = params.get('sort') ?? 'curated';

  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: name === 'q' });
  };

  const matches = artworks.filter((artwork) => {
    const artist = artists.find((entry) => entry.id === artwork.artistId);
    const words =
      `${artwork.title} ${artist?.name ?? ''} ${artist?.nameEn ?? ''} ${artwork.medium}`.toLocaleLowerCase();
    if (query.trim() && !words.includes(query.trim().toLocaleLowerCase()))
      return false;
    if (category && category !== artwork.category) return false;
    if (space && !artwork.spaces.includes(space)) return false;
    const longest = Math.max(artwork.widthCm, artwork.heightCm);
    if (size === 'small' && longest > 100) return false;
    if (size === 'medium' && (longest <= 100 || longest > 150)) return false;
    if (size === 'large' && longest <= 150) return false;
    if (price === 'quote' && artwork.rentalMonthly !== null) return false;
    if (
      price === 'under-100000' &&
      (artwork.rentalMonthly === null || artwork.rentalMonthly > 100000)
    )
      return false;
    if (
      price === 'over-100000' &&
      (artwork.rentalMonthly === null || artwork.rentalMonthly <= 100000)
    )
      return false;
    if (available && artwork.availability !== available) return false;
    return true;
  });
  if (sort === 'newest') matches.sort((a, b) => b.year - a.year);
  if (sort === 'name')
    matches.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  const hasFilters = [
    'q',
    'category',
    'space',
    'size',
    'price',
    'availability',
  ].some((key) => params.has(key));

  return (
    <div className="container catalog-page">
      <header className="page-intro catalog-intro">
        <p className="eyebrow">THE COLLECTION</p>
        <div className="catalog-title-row">
          <h1>공간과 만나는 작품</h1>
          <Link to="/selection" className="text-link">
            관심 작품 {ids.length}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <p>
          공간의 분위기와 크기를 떠올리며 작품을 살펴보세요.
          <br />
          마음에 드는 작품을 모아, 우리 공간에 맞는 제안을 받아보세요.
        </p>
      </header>

      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">작품 또는 작가 검색</span>
          <input
            type="search"
            value={query}
            onChange={(event) => update('q', event.target.value)}
            placeholder="작품명 또는 작가명 검색"
          />
        </label>
        <div className="catalog-filter-heading">
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span>작품 필터</span>
          {hasFilters && (
            <button type="button" onClick={() => setParams({})}>
              초기화 <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="catalog-filters">
          <label>
            <span>공간</span>
            <select
              value={space}
              onChange={(event) => update('space', event.target.value)}
            >
              <option value="">모든 공간</option>
              {Object.entries(spaceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>종류</span>
            <select
              value={category}
              onChange={(event) => update('category', event.target.value)}
            >
              <option value="">모든 종류</option>
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>크기 · 긴 변 기준</span>
            <select
              value={size}
              onChange={(event) => update('size', event.target.value)}
            >
              <option value="">모든 크기</option>
              <option value="small">100cm 이하</option>
              <option value="medium">100–150cm</option>
              <option value="large">150cm 초과</option>
            </select>
          </label>
          <label>
            <span>월 예산</span>
            <select
              value={price}
              onChange={(event) => update('price', event.target.value)}
            >
              <option value="">모든 예산</option>
              <option value="under-100000">10만원 이하 · 공개 요금</option>
              <option value="over-100000">10만원 초과 · 공개 요금</option>
              <option value="quote">상담 후 안내</option>
            </select>
          </label>
          <label>
            <span>렌탈 상태</span>
            <select
              value={available}
              onChange={(event) => update('availability', event.target.value)}
            >
              <option value="">모든 상태</option>
              <option value="available">렌탈 가능</option>
              <option value="confirm">가능 여부 확인</option>
              <option value="rented">대여 중</option>
            </select>
          </label>
        </div>
      </div>

      <div className="catalog-result-bar">
        <p aria-live="polite">
          총 <b>{matches.length}</b>개의 작품
        </p>
        <label>
          <span className="sr-only">작품 정렬</span>
          <select
            value={sort}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="curated">큐레이션 순</option>
            <option value="newest">제작 연도 순</option>
            <option value="name">작품명 순</option>
          </select>
        </label>
      </div>
      <p className="catalog-notice">
        현재 작품과 작가 정보는 큐레이션 예시입니다. 실제 취급 작품·렌탈료·이용
        가능 일정은 상담 시 확인합니다.
      </p>

      {matches.length ? (
        <div className="catalog-grid">
          {matches.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              search={params.toString()}
            />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <Search size={30} strokeWidth={1} aria-hidden="true" />
          <h2>조건에 맞는 작품이 없습니다</h2>
          <p>
            필터를 줄이거나, 원하는 공간과 예산을 알려주세요.
            <br />
            공개된 월요금이 없는 작품은 ‘상담 후 안내’에서 볼 수 있습니다.
          </p>
          <div className="catalog-actions">
            <button
              type="button"
              className="button button-outline"
              onClick={() => setParams({})}
            >
              필터 초기화
            </button>
            <Link to="/inquiry" className="button button-dark">
              큐레이터에게 추천받기
            </Link>
          </div>
        </div>
      )}

      <aside className="catalog-consult">
        <div>
          <p className="eyebrow">LET US CURATE</p>
          <h2>어떤 작품이 어울릴지 고민된다면</h2>
          <p>공간의 사진과 이야기를 바탕으로 함께 방향을 찾아갑니다.</p>
        </div>
        <Link to="/inquiry?service=consulting" className="text-link">
          공간 맞춤 제안 받기 <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}

function ScalePreview({ artwork }: { artwork: RentalArtwork }) {
  const [wallWidth, setWallWidth] = useState(400);
  const [wallHeight, setWallHeight] = useState(280);
  const [wallColor, setWallColor] = useState('#eeeae2');
  const colors = [
    { value: '#eeeae2', name: '웜 화이트' },
    { value: '#d6d8d1', name: '세이지 그레이' },
    { value: '#c9bdac', name: '샌드 베이지' },
  ];

  return (
    <section className="catalog-scale" aria-labelledby="scale-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A SENSE OF SCALE</p>
          <h2 id="scale-title">공간에서 크기 가늠하기</h2>
        </div>
        <span className="tag">2D 치수 비교</span>
      </div>
      <p className="catalog-scale-note">
        작품 표시 규격을 벽면과 비교한 참고 도형입니다. 실제 설치 이미지나 3D
        시뮬레이션이 아니며, 액자·원근·조명·설치 높이는 반영하지 않습니다.
      </p>
      <div className="catalog-scale-layout">
        <div
          className="catalog-scale-canvas"
          style={{
            aspectRatio: `${wallWidth} / ${wallHeight}`,
            backgroundColor: wallColor,
          }}
          role="img"
          aria-label={`가로 ${wallWidth}cm, 높이 ${wallHeight}cm 벽면에서 가로 ${artwork.widthCm}cm, 높이 ${artwork.heightCm}cm 작품의 상대적인 크기 비교`}
        >
          <div
            className={`catalog-scale-art ${artwork.category === 'sculpture' ? 'is-sculpture' : ''}`}
            style={{
              width: `${(artwork.widthCm / wallWidth) * 100}%`,
              height: `${(artwork.heightCm / wallHeight) * 100}%`,
            }}
          >
            <span>
              작품
              <br />
              {artwork.widthCm} × {artwork.heightCm} cm
            </span>
          </div>
          <div className="catalog-scale-floor" />
          <span className="catalog-scale-dimension">
            벽면 너비 {wallWidth} cm
          </span>
        </div>
        <div className="catalog-scale-controls">
          <label>
            벽면 너비 <b>{wallWidth} cm</b>
            <input
              type="range"
              min="250"
              max="600"
              step="10"
              value={wallWidth}
              onChange={(event) => setWallWidth(Number(event.target.value))}
            />
          </label>
          <label>
            벽면 높이 <b>{wallHeight} cm</b>
            <input
              type="range"
              min="220"
              max="400"
              step="10"
              value={wallHeight}
              onChange={(event) => setWallHeight(Number(event.target.value))}
            />
          </label>
          <fieldset>
            <legend>벽면 색상</legend>
            <div className="catalog-swatches">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  aria-label={color.name}
                  aria-pressed={wallColor === color.value}
                  onClick={() => setWallColor(color.value)}
                  style={{ backgroundColor: color.value }}
                >
                  {wallColor === color.value && (
                    <Check size={16} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="muted">
            {artwork.category === 'sculpture'
              ? `조각 깊이는 ${artwork.depthCm ?? 0}cm입니다. 받침과 안전거리 등 실제 설치 범위는 별도 확인합니다.`
              : '액자 바깥 치수와 벽체의 고정 방식은 설치 전에 확인합니다.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ArtworkPage() {
  const { slug } = useParams();
  const location = useLocation();
  const state: unknown = location.state;
  const search =
    typeof state === 'object' &&
    state !== null &&
    'catalogSearch' in state &&
    typeof state.catalogSearch === 'string'
      ? state.catalogSearch
      : '';
  const artwork = artworks.find((entry) => entry.slug === slug);
  const { ids, toggle } = useSelection();

  if (!artwork)
    return (
      <div className="container catalog-empty">
        <h1>작품을 찾을 수 없습니다</h1>
        <p>주소를 확인하거나 작품 목록에서 다시 찾아보세요.</p>
        <Link to="/artworks" className="button button-dark">
          작품 찾기
        </Link>
      </div>
    );

  const artist = artists.find((entry) => entry.id === artwork.artistId);
  const selected = ids.includes(artwork.id);
  const related = artworks
    .filter((entry) => entry.id !== artwork.id)
    .slice(0, 3);
  return (
    <div className="container catalog-page">
      <nav className="catalog-breadcrumb" aria-label="현재 위치">
        <Link to={`/artworks${search ? `?${search}` : ''}`}>
          <ArrowLeft size={15} aria-hidden="true" /> 작품 목록
        </Link>
        <span>/</span>
        <span>{artwork.title}</span>
      </nav>
      <section className="catalog-detail">
        <div className="catalog-detail-image">
          <img
            src={artwork.image}
            alt={`${artwork.title} 공간 배치 이미지 예시`}
          />
          <span className="catalog-image-caption">
            공간 배치 이미지 예시 · 실제 설치 결과와 다를 수 있습니다.
          </span>
        </div>
        <div className="catalog-detail-copy">
          <div className="catalog-detail-heading">
            <p className="eyebrow">
              {categories[artwork.category]} / {artwork.year}
            </p>
            {artwork.sample && <span className="tag">큐레이션 예시</span>}
          </div>
          {artist && (
            <Link
              to={`/artists/${artist.slug}`}
              className="catalog-detail-artist"
            >
              {artist.name} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <h1>{artwork.title}</h1>
          <p className="catalog-detail-description">{artwork.description}</p>
          <dl className="catalog-specs">
            <div>
              <dt>재료</dt>
              <dd>{artwork.medium}</dd>
            </div>
            <div>
              <dt>표시 규격</dt>
              <dd>
                가로 {artwork.widthCm} × 세로 {artwork.heightCm}
                {artwork.depthCm ? ` × 깊이 ${artwork.depthCm}` : ''} cm
              </dd>
            </div>
            <div>
              <dt>추천 공간</dt>
              <dd>
                {artwork.spaces.map((space) => spaceLabels[space]).join(' · ')}
              </dd>
            </div>
            <div>
              <dt>렌탈 상태</dt>
              <dd>{availabilityLabel(artwork)}</dd>
            </div>
          </dl>
          <div className="catalog-rental-summary">
            <span>월 렌탈료</span>
            <strong>{monthlyPrice(artwork)}</strong>
            <p>
              이용 기간, 설치 지역, 교체·회수 범위에 따라 견적을 안내합니다.
              작품 확보와 현장 확인 후 계약 조건을 확정합니다.
            </p>
          </div>
          <div className="catalog-detail-actions">
            <Link
              className="button button-dark"
              to={`/inquiry?service=rental&artworks=${artwork.id}`}
            >
              이 작품으로 상담하기 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="button button-outline"
              onClick={() => toggle(artwork.id)}
              aria-pressed={selected}
            >
              <Heart
                size={17}
                fill={selected ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              {selected ? '관심 작품에 담았어요' : '관심 작품에 담기'}
            </button>
          </div>
          <p className="catalog-notice">
            예시 작품을 선택하면 선호하는 분위기를 상담에 전달합니다. 선택만으로
            실제 작품의 예약이나 렌탈이 확정되지는 않습니다.
          </p>
        </div>
      </section>
      <section className="catalog-installation">
        <h2>설치 전에 함께 확인합니다</h2>
        <div>
          <p>
            <b>공간과 크기</b>벽면 치수, 가구 배치, 사람의 동선을 함께 살핍니다.
          </p>
          <p>
            <b>설치와 안전</b>
            {artwork.category === 'sculpture'
              ? '작품 무게, 받침과 바닥 하중, 관람 동선을 확인합니다.'
              : '벽체 재료, 작품 무게와 고정 방식을 확인합니다.'}
          </p>
          <p>
            <b>기간과 관리</b>희망 이용 기간과 교체·회수 계획을 견적에
            반영합니다.
          </p>
        </div>
        <Link to="/rental" className="text-link">
          렌탈 진행 과정 보기 <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
      <ScalePreview artwork={artwork} />
      <section className="catalog-related">
        <div className="section-heading">
          <h2>함께 살펴볼 작품</h2>
          <Link to="/artworks" className="text-link">
            전체 작품 <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="catalog-grid">
          {related.map((entry) => (
            <ArtworkCard key={entry.id} artwork={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function SelectionPage() {
  const { ids, toggle, clear } = useSelection();
  const selected = ids.flatMap((id) => {
    const artwork = artworks.find((entry) => entry.id === id);
    return artwork ? [artwork] : [];
  });
  return (
    <div className="container catalog-page">
      <header className="page-intro">
        <p className="eyebrow">YOUR SELECTION</p>
        <h1>관심 작품</h1>
        <p>
          마음에 드는 작품을 모아 공간에 어울리는 조합을 찾아보세요.
          <br />
          선택한 작품과 함께 상담을 요청할 수 있습니다.
        </p>
      </header>
      {selected.length === 0 ? (
        <div className="catalog-empty">
          <Heart size={32} strokeWidth={1} aria-hidden="true" />
          <h2>아직 담은 작품이 없습니다</h2>
          <p>
            작품의 하트 버튼으로 관심 작품을 담아보세요.
            <br />
            작품을 정하지 않고도 공간 상담을 시작할 수 있습니다.
          </p>
          <div className="catalog-actions">
            <Link to="/artworks" className="button button-dark">
              작품 찾기
            </Link>
            <Link to="/inquiry" className="button button-outline">
              공간부터 상담하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="catalog-selection-layout">
          <div>
            <div className="catalog-result-bar">
              <p>
                <b>{selected.length}</b>개의 관심 작품
              </p>
              <button
                type="button"
                onClick={clear}
                className="catalog-text-button"
              >
                전체 비우기
              </button>
            </div>
            {selected.map((artwork) => {
              const artist = artists.find(
                (entry) => entry.id === artwork.artistId,
              );
              return (
                <article className="catalog-selection-row" key={artwork.id}>
                  <Link to={`/artworks/${artwork.slug}`}>
                    <img src={artwork.image} alt={artwork.title} />
                  </Link>
                  <div>
                    <span className="catalog-sample-inline">큐레이션 예시</span>
                    <p>{artist?.name}</p>
                    <h2>
                      <Link to={`/artworks/${artwork.slug}`}>
                        {artwork.title}
                      </Link>
                    </h2>
                    <p className="muted">
                      {artwork.widthCm} × {artwork.heightCm} cm ·{' '}
                      {categories[artwork.category]}
                    </p>
                    <p>{monthlyPrice(artwork)}</p>
                  </div>
                  <button
                    type="button"
                    className="catalog-remove"
                    onClick={() => toggle(artwork.id)}
                    aria-label={`${artwork.title} 관심 작품에서 제거`}
                  >
                    <X size={19} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
          <aside className="catalog-selection-summary">
            <p className="eyebrow">NEXT STEP</p>
            <h2>작품에서 공간으로</h2>
            <p>
              선택한 {selected.length}개 작품의 분위기와 함께 공간의 용도, 지역,
              희망 일정을 알려주세요.
            </p>
            <ul>
              <li>복수 작품을 한 번에 상담</li>
              <li>공간별 배치와 대안 작품 제안</li>
              <li>렌탈료와 설치·회수 비용 확인</li>
            </ul>
            <Link
              className="button button-dark"
              to={`/inquiry?service=rental&artworks=${selected.map((entry) => entry.id).join(',')}`}
            >
              선택 작품으로 상담하기 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="catalog-notice">
              관심 작품은 이 브라우저에 저장됩니다. 예시 선택은 예약·재고 확보를
              의미하지 않습니다.
            </p>
          </aside>
        </div>
      )}
      <Link to="/artworks" className="text-link">
        <ArrowLeft size={17} aria-hidden="true" /> 작품 계속 둘러보기
      </Link>
    </div>
  );
}
