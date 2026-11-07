import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artworks, artists } from '../catalog';
import { useSelection } from '../state/selection';
import hero from '../assets/images/gallery_hero_exhibition_1783483717829.jpg';
import detail from '../assets/images/artwork_color_field_1783483743324.jpg';

const spaces = [
  {
    id: 'office',
    en: 'Office',
    name: '오피스',
    description: '일하는 공간에 새로운 시선',
    number: '01',
  },
  {
    id: 'healthcare',
    en: 'Healthcare',
    name: '병원·클리닉',
    description: '머무는 시간을 생각하는 예술',
    number: '02',
  },
  {
    id: 'hospitality',
    en: 'Hospitality',
    name: '호텔',
    description: '장소의 기억을 만드는 작품',
    number: '03',
  },
  {
    id: 'retail',
    en: 'Retail',
    name: '매장·브랜드 공간',
    description: '브랜드의 감각을 전하는 선택',
    number: '04',
  },
];

export default function HomePage() {
  const { ids, toggle } = useSelection();
  return (
    <>
      <section className="home-hero container">
        <div className="hero-heading">
          <div>
            <p className="eyebrow">ART, IN YOUR EVERYDAY.</p>
            <h1>
              공간에 예술이
              <br />
              <em>머무는 방식.</em>
            </h1>
          </div>
          <div className="hero-summary">
            <p>
              공간을 이해하고, 어울리는 작품을 제안합니다.
              <br />
              렌탈부터 설치와 교체 계획까지.
              <br />
              아트서울과 공간의 다음 장면을 만나보세요.
            </p>
            <Link className="text-link" to="/inquiry">
              공간 맞춤 제안 받기
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
        <figure className="hero-figure">
          <img
            src={hero}
            alt="큰 추상 작품과 자연광이 어우러진 갤러리 공간 연출 예시"
            fetchPriority="high"
            width="1376"
            height="768"
          />
          <div className="hero-image-label">
            <span>CURATED FOR YOUR SPACE</span>
            <Link to="/rental">
              아트 렌탈 알아보기
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <figcaption>
            <span>예술이 놓이는 순간, 공간의 이야기가 시작됩니다.</span>
            <span>공간 연출 예시</span>
          </figcaption>
        </figure>
      </section>
      <section className="space-section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SPACES WE CONSIDER</p>
            <h2>어떤 공간을 생각하고 있나요?</h2>
          </div>
          <p className="muted">공간의 쓰임과 사람의 경험에서 시작합니다.</p>
        </div>
        <div className="space-links">
          {spaces.map((space) => (
            <Link to={`/rental#${space.id}`} key={space.id}>
              <span className="space-number">{space.number}</span>
              <div>
                <span className="space-english">{space.en}</span>
                <h3>{space.name}</h3>
                <p>{space.description}</p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </div>
      </section>
      <section className="home-artworks container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A CLOSER LOOK</p>
            <h2>공간을 바꾸는 작은 시작</h2>
          </div>
          <Link className="text-link" to="/artworks">
            모든 작품 보기
            <ArrowRight size={18} />
          </Link>
        </div>
        <p className="collection-note">
          큐레이션 예시 컬렉션 · 실제 렌탈 가능 여부와 금액은 상담에서
          확인합니다.
        </p>
        <div className="home-artwork-grid">
          {artworks.slice(0, 3).map((art) => (
            <article className="home-art-card" key={art.id}>
              <div className="home-art-image">
                <Link to={`/artworks/${art.slug}`}>
                  <img
                    src={art.image}
                    alt={`${art.title} 작품 연출 예시`}
                    loading="lazy"
                  />
                </Link>
                <button
                  className="save-art"
                  onClick={() => toggle(art.id)}
                  aria-label={`${art.title} ${ids.includes(art.id) ? '관심 해제' : '관심 저장'}`}
                  aria-pressed={ids.includes(art.id)}
                >
                  <Heart
                    size={19}
                    fill={ids.includes(art.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
              <div className="home-art-caption">
                <div>
                  <p>
                    {artists.find((artist) => artist.id === art.artistId)?.name}
                  </p>
                  <Link to={`/artworks/${art.slug}`}>
                    <h3>{art.title}</h3>
                  </Link>
                  <span>
                    {art.widthCm} × {art.heightCm} cm
                  </span>
                </div>
                <span className="price-caption">렌탈료 상담</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="home-advisory">
        <div className="container advisory-grid">
          <figure>
            <img
              src={detail}
              alt="색면 작품이 놓인 차분한 공간 연출 예시"
              loading="lazy"
            />
            <figcaption>공간 연출 예시</figcaption>
          </figure>
          <div className="advisory-copy">
            <p className="eyebrow">ART ADVISORY</p>
            <h2>
              좋은 작품을 넘어,
              <br />
              우리 공간에 맞는 작품.
            </h2>
            <p>
              브랜드가 전하고 싶은 이야기, 공간의 빛과 동선,
              <br className="desktop-break" /> 그곳에 머무는 사람들까지 함께
              살펴봅니다.
            </p>
            <p>
              취향이 아직 분명하지 않아도 괜찮습니다.
              <br />
              공간의 목적과 예산을 바탕으로 작품과 배치를 제안합니다.
            </p>
            <Link className="button button-dark" to="/consulting">
              공간 컨설팅 살펴보기
              <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to="/projects">
              공간 제안 예시 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="home-process container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM A CONVERSATION TO YOUR SPACE</p>
            <h2>시작은 가벼운 대화로</h2>
          </div>
          <Link className="text-link" to="/rental">
            렌탈 이용 방법
            <ArrowRight size={18} />
          </Link>
        </div>
        <ol className="process-list">
          {[
            [
              '공간을 이야기합니다',
              '공간의 용도, 예산, 원하는 분위기를 함께 정리합니다.',
            ],
            [
              '작품과 배치를 제안합니다',
              '작품 후보와 선정 이유, 비용 구성을 확인합니다.',
            ],
            [
              '일정을 확인하고 설치합니다',
              '작품 가용 일정과 현장 조건을 확인한 뒤 진행합니다.',
            ],
            [
              '다음 장면을 준비합니다',
              '계약 조건에 맞춰 교체·연장·회수를 계획합니다.',
            ],
          ].map(([title, text], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-closing">
        <div className="container">
          <div>
            <p className="eyebrow">LET’S FIND YOUR ART</p>
            <h2>
              당신의 공간에는
              <br />
              어떤 예술이 어울릴까요?
            </h2>
          </div>
          <div>
            <p>작품을 직접 골라도, 처음부터 함께 찾아도 좋습니다.</p>
            <Link className="button button-dark" to="/inquiry">
              상담·견적 요청
              <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to="/support/faq">
              자주 묻는 질문
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
