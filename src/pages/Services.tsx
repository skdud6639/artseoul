import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import galleryImage from '../assets/images/gallery_hero_exhibition_1783483717829.jpg';
import { faqs, rentalSteps, spaces } from '../content/services';
import '../styles/services.css';

function ServiceContact({ service = 'rental' }: { service?: string }) {
  return (
    <section className="svc-contact container">
      <div>
        <p className="eyebrow">LET’S TALK ABOUT YOUR SPACE</p>
        <h2>어떤 공간을 생각하고 계신가요?</h2>
        <p>아직 작품이나 예산을 정하지 않아도 괜찮습니다.</p>
      </div>
      <Link className="button button-dark" to={`/inquiry?service=${service}`}>
        공간 맞춤 상담 <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </section>
  );
}

export function RentalPage() {
  return (
    <div className="service-page">
      <section className="container svc-hero">
        <div className="svc-hero-copy">
          <p className="eyebrow">ART RENTAL</p>
          <h1>
            공간에 어울리는 예술,
            <br />
            렌탈로 시작하세요.
          </h1>
          <p>
            오피스의 첫인상부터 호텔의 머무는 순간까지.
            <br />
            공간의 목적에 맞는 작품을 찾고, 이용 조건과
            <br className="svc-desktop-break" /> 설치·관리의 과정을 함께
            설계합니다.
          </p>
          <div className="svc-actions">
            <Link className="button button-dark" to="/inquiry?service=rental">
              렌탈 상담하기 <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/artworks">
              작품 먼저 보기 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="svc-hero-image">
          <img
            src={galleryImage}
            alt="넓은 여백과 회화를 함께 보여주는 공간 이미지"
          />
          <figcaption>공간의 분위기를 보여주는 참고 이미지</figcaption>
        </figure>
      </section>

      <section className="svc-tint" id="process">
        <div className="container svc-section">
          <div className="svc-section-heading">
            <div>
              <p className="eyebrow">HOW IT WORKS</p>
              <h2>선택부터 관리까지, 하나의 흐름으로.</h2>
            </div>
            <p>작품과 공간을 충분히 확인한 뒤 조건을 정합니다.</p>
          </div>
          <ol className="svc-steps">
            {rentalSteps.map((step, index) => (
              <li key={step.title}>
                <span className="svc-step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container svc-section" id="spaces">
        <div className="svc-section-heading">
          <div>
            <p className="eyebrow">ART FOR YOUR SPACE</p>
            <h2>공간이 다르면, 제안도 달라집니다.</h2>
          </div>
          <Link className="text-link" to="/projects">
            공간 제안 살펴보기 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="svc-spaces">
          {spaces.map((space) => (
            <article key={space.id} className="svc-space" id={space.id}>
              <div className="svc-space-title">
                <span>{space.english}</span>
                <h3>{space.label}</h3>
              </div>
              <div>
                <h4>{space.summary}</h4>
                <p>{space.detail}</p>
                <p className="svc-space-note">{space.considerations}</p>
              </div>
              <Link
                className="svc-round-link"
                to={`/inquiry?service=rental&space=${space.id}`}
                aria-label={`${space.label} 렌탈 상담`}
              >
                <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="svc-tint" id="cost">
        <div className="container svc-section svc-cost">
          <div>
            <p className="eyebrow">A CLEARER ESTIMATE</p>
            <h2>
              월 렌탈료와
              <br />
              전체 비용을 함께 봅니다.
            </h2>
            <p>
              작품의 가격만으로는 공간의 비용을 알기 어렵습니다. 작품, 기간과
              현장 조건을 확인해 비용의 각 항목을 구분합니다.
            </p>
            <Link className="text-link" to="/inquiry?service=rental">
              우리 공간의 견적 상담 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <dl className="svc-cost-list">
            <div>
              <dt>작품 이용료</dt>
              <dd>선택한 작품, 작품 수와 계약 기간에 따른 렌탈료</dd>
            </div>
            <div>
              <dt>운송·설치·회수</dt>
              <dd>지역, 반입 경로, 설치 방식과 작업 범위에 따른 비용</dd>
            </div>
            <div>
              <dt>추가 서비스</dt>
              <dd>현장 조사, 별도 시안, 교체 또는 추가 작업의 비용</dd>
            </div>
            <div>
              <dt>계약 총액과 조건</dt>
              <dd>세금, 포함·별도 항목, 기간과 교체·연장·종료 조건</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container svc-section svc-practical">
        <div>
          <p className="eyebrow">BEFORE WE INSTALL</p>
          <h2>공간의 작은 조건도 함께 확인합니다.</h2>
          <p>
            설치 가능 지역과 일정은 문의 시 확인합니다. 여러 지점을 운영하는
            경우 지점별 현장 조건과 담당자를 나누어 알려주세요.
          </p>
        </div>
        <ul>
          {[
            '벽면 크기와 소재, 작품의 치수·무게',
            '조명, 동선과 이용자의 접촉 가능성',
            '반입 경로와 작업 가능한 시간',
            '설치·인수 시 상태와 관리 주의사항',
          ].map((item) => (
            <li key={item}>
              <Check size={17} aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="container svc-faq-preview">
        <div className="svc-section-heading">
          <h2>자주 묻는 질문</h2>
          <Link className="text-link" to="/support/faq">
            전체 FAQ <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <FaqList items={faqs.slice(0, 3)} />
      </section>
      <ServiceContact />
    </div>
  );
}

const consultingSteps = [
  {
    title: '공간과 브랜드 이해',
    output: '프로젝트 브리프',
    body: '공간의 목적, 이용자, 브랜드의 언어와 예산을 살펴봅니다. 필요한 자료와 현장 확인 범위를 정합니다.',
  },
  {
    title: '작품 큐레이션',
    output: '작품 후보와 선정 이유',
    body: '공간의 색, 재료, 빛과 동선에 맞는 작품을 제안합니다. 작품의 가용성과 공급 조건도 함께 확인합니다.',
  },
  {
    title: '배치와 구성',
    output: '공간별 배치 제안',
    body: '실측 자료를 바탕으로 크기와 위치를 검토합니다. 필요한 경우 합성 시안 등 추가 산출물의 범위를 협의합니다.',
  },
  {
    title: '조건과 일정 확정',
    output: '작품 목록과 견적',
    body: '의견을 나누어 작품 구성을 조율하고, 기간·총비용·수정 범위·설치 일정을 확인합니다.',
  },
  {
    title: '설치와 이후의 관리',
    output: '설치 계획과 관리 안내',
    body: '반입 조건과 작업을 조율합니다. 설치 후에는 인수 상태와 계약에 따른 관리·교체 범위를 확인합니다.',
  },
];

export function ConsultingPage() {
  return (
    <div className="service-page">
      <section className="container svc-consulting-intro">
        <p className="eyebrow">ART CONSULTING</p>
        <h1>
          좋은 작품에서,
          <br />
          우리 공간에 맞는 작품으로.
        </h1>
        <div className="svc-consulting-bottom">
          <p>
            공간의 목적을 이해하는 것에서 시작합니다.
            <br />
            작품 선정의 이유부터 배치, 예산과 설치까지.
            <br />
            아트서울은 공간과 예술 사이의 결정을 함께합니다.
          </p>
          <Link className="button button-dark" to="/inquiry?service=consulting">
            프로젝트 상담 <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <figure className="container svc-consulting-image">
        <img
          src={galleryImage}
          alt="벽면의 여백, 조명, 작품의 관계를 보여주는 공간 참고 이미지"
        />
        <figcaption>작품과 공간의 관계를 보여주는 참고 이미지</figcaption>
      </figure>
      <section className="container svc-section svc-consulting-process">
        <div>
          <p className="eyebrow">FROM IDEA TO SPACE</p>
          <h2>
            제안의 과정과
            <br />
            결과물을 분명하게.
          </h2>
          <p>
            프로젝트의 규모와 필요에 맞춰 범위를 정합니다. 각 단계에서 무엇을
            결정하고 어떤 자료를 받는지 먼저 확인합니다.
          </p>
        </div>
        <ol className="svc-deliverables">
          {consultingSteps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="svc-output">{step.output}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="svc-tint">
        <div className="container svc-section svc-consulting-scope">
          <div>
            <p className="eyebrow">SCOPE & DELIVERABLES</p>
            <h2>필요한 만큼, 함께 정합니다.</h2>
          </div>
          <div>
            <h3>초기 상담</h3>
            <p>
              공간과 원하는 서비스를 파악하고, 진행에 필요한 범위와 자료를
              안내하는 단계입니다. 작품을 정하지 않은 상태에서도 시작할 수
              있습니다.
            </p>
            <h3>프로젝트별 컨설팅</h3>
            <p>
              현장 방문, 상세 큐레이션, 배치안, 합성 시안, 제안서와 설치 관리의
              제공 범위를 협의합니다. 유료 업무의 비용, 수정 횟수와 일정은 착수
              전에 정합니다.
            </p>
            <p className="svc-fine-print">
              실제 제공 범위와 비용은 프로젝트별 견적·계약에서 확정합니다.
            </p>
          </div>
        </div>
      </section>
      <section className="container svc-section svc-project-link">
        <div>
          <p className="eyebrow">EXPLORE THE POSSIBILITIES</p>
          <h2>우리 공간의 시작점을 찾아보세요.</h2>
          <p>오피스, 병원, 호텔, 매장을 위한 공간 제안 예시를 준비했습니다.</p>
        </div>
        <Link className="button button-outline" to="/projects">
          공간 제안 보기 <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
      <ServiceContact service="consulting" />
    </div>
  );
}

function FaqList({ items }: { items: ReadonlyArray<(typeof faqs)[number]> }) {
  return (
    <div className="svc-faq-list">
      {items.map((faq) => (
        <details key={faq.question}>
          <summary>
            <span>{faq.question}</span>
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqPage() {
  const categories = [...new Set(faqs.map((faq) => faq.category))];
  return (
    <div className="service-page">
      <section className="container page-intro svc-faq-intro">
        <p className="eyebrow">QUESTIONS & ANSWERS</p>
        <h1>궁금한 점을 먼저 살펴보세요.</h1>
        <p>
          작품 선택부터 설치와 관리까지.
          <br />
          구체적인 비용과 이용 조건은 작품·공간별 견적에서 확인합니다.
        </p>
      </section>
      <div className="container svc-faq-layout">
        <nav aria-label="자주 묻는 질문 분류" className="svc-faq-nav">
          {categories.map((category, index) => (
            <a key={category} href={`#faq-${index}`}>
              {category} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div>
          {categories.map((category, index) => (
            <section
              key={category}
              id={`faq-${index}`}
              className="svc-faq-category"
            >
              <h2>{category}</h2>
              <FaqList
                items={faqs.filter((faq) => faq.category === category)}
              />
            </section>
          ))}
        </div>
      </div>
      <ServiceContact />
    </div>
  );
}
