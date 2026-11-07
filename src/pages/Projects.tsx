import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { projectConcepts, spaces } from '../content/services';
import '../styles/services.css';

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('space') ?? '';
  const projects = projectConcepts.filter(
    (project) => !selected || project.space === selected,
  );

  const selectSpace = (space: string) => {
    const next = new URLSearchParams(searchParams);
    if (space) next.set('space', space);
    else next.delete('space');
    setSearchParams(next);
  };

  return (
    <div className="service-page">
      <section className="container page-intro svc-projects-intro">
        <p className="eyebrow">SPACES & POSSIBILITIES</p>
        <h1>
          공간을 읽고,
          <br />
          작품을 제안합니다.
        </h1>
        <div className="svc-project-intro-bottom">
          <p>
            같은 작품도 공간에 따라 다른 이야기가 됩니다.
            <br />
            공간의 용도와 조건에서 시작하는 제안을 살펴보세요.
          </p>
          <p className="svc-concept-notice">
            아래 콘텐츠는 공간 제안 예시입니다.
            <br />
            실제 고객 또는 시공 실적을 의미하지 않습니다.
          </p>
        </div>
      </section>
      <section
        className="container svc-projects-body"
        aria-label="공간 제안 목록"
      >
        <div className="svc-project-filters" aria-label="공간 유형 필터">
          <button
            type="button"
            onClick={() => selectSpace('')}
            aria-pressed={!selected}
          >
            전체
          </button>
          {spaces.map((space) => (
            <button
              type="button"
              key={space.id}
              onClick={() => selectSpace(space.id)}
              aria-pressed={selected === space.id}
            >
              {space.label}
            </button>
          ))}
          <span aria-live="polite">{projects.length}개의 공간 제안</span>
        </div>
        {projects.length > 0 ? (
          <div className="svc-project-grid">
            {projects.map((project) => (
              <article key={project.slug} className="svc-project-card">
                <Link to={`/projects/${project.slug}`}>
                  <div className="svc-project-image">
                    <img
                      src={project.image}
                      alt={`${project.sector} 공간의 큐레이션 방향을 보여주는 작품 참고 이미지`}
                      loading="lazy"
                    />
                    <span className="svc-image-label">공간 제안 예시</span>
                  </div>
                  <div className="svc-project-meta">
                    <span>{project.sector}</span>
                    <ArrowUpRight size={21} aria-hidden="true" />
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.subtitle}</p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="svc-empty">
            <h2>해당 조건의 공간 제안이 없습니다.</h2>
            <p>전체 공간 제안을 살펴보거나 원하는 공간으로 상담해 주세요.</p>
            <button
              type="button"
              className="button button-outline"
              onClick={() => selectSpace('')}
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>
      <section className="container svc-contact">
        <div>
          <p className="eyebrow">YOUR SPACE COMES NEXT</p>
          <h2>우리 공간에는 어떤 작품이 어울릴까요?</h2>
          <p>공간의 사진과 생각을 나누는 것부터 시작합니다.</p>
        </div>
        <Link className="button button-dark" to="/inquiry?service=consulting">
          공간 맞춤 상담 <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = projectConcepts.find((item) => item.slug === slug);

  if (!project) {
    return (
      <section className="container svc-empty">
        <p className="eyebrow">PROJECT NOT FOUND</p>
        <h1>공간 제안을 찾을 수 없습니다.</h1>
        <p>주소를 확인하거나 다른 공간 제안을 살펴보세요.</p>
        <Link className="button button-dark" to="/projects">
          공간 제안 목록 <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <div className="service-page">
      <section className="container svc-project-detail-intro">
        <Link className="text-link" to={`/projects?space=${project.space}`}>
          <ArrowLeft size={16} aria-hidden="true" /> 공간 제안
        </Link>
        <div className="svc-project-detail-heading">
          <div>
            <p className="eyebrow">{project.sector} · CURATION CONCEPT</p>
            <h1>{project.title}</h1>
            <p className="svc-project-subtitle">{project.subtitle}</p>
          </div>
          <span className="svc-concept-tag">공간 제안 예시</span>
        </div>
        <p className="svc-concept-notice">
          이 페이지는 공간을 가정한 큐레이션 예시이며 실제 고객·시공 사례가
          아닙니다. 이미지와 작품 정보는 제안 방향을 설명하기 위한 참고
          자료입니다.
        </p>
      </section>
      <figure className="container svc-project-detail-image">
        <img
          src={project.image}
          alt={`${project.title}의 큐레이션 방향을 보여주는 작품 참고 이미지`}
        />
        <figcaption>큐레이션 참고 이미지 · 실제 설치 사진 아님</figcaption>
      </figure>
      <section className="container svc-section svc-project-story">
        <div>
          <p className="eyebrow">THE IDEA</p>
          <h2>공간에서 시작한 선택</h2>
        </div>
        <div>
          <p className="svc-story-lead">{project.overview}</p>
          <h3>공간의 질문</h3>
          <p>{project.challenge}</p>
          <h3>작품을 고르는 기준</h3>
          <p>{project.approach}</p>
          <Link className="text-link" to={`/artworks?space=${project.space}`}>
            이 공간에 어울리는 작품 살펴보기{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="svc-tint">
        <div className="container svc-section svc-practical">
          <div>
            <p className="eyebrow">FROM CONCEPT TO REALITY</p>
            <h2>실제 공간에서는 함께 확인합니다.</h2>
            <p>
              구체적인 작품과 배치, 비용은 공간의 실측과 작품 가용성을 확인한 뒤
              결정합니다.
            </p>
          </div>
          <ul>
            {project.checks.map((check) => (
              <li key={check}>
                <Check size={17} aria-hidden="true" /> {check}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="container svc-contact">
        <div>
          <p className="eyebrow">LET’S MAKE IT YOURS</p>
          <h2>이런 공간을 생각하고 계신가요?</h2>
          <p>공간의 규모와 목적에 맞춰 이야기를 이어갑니다.</p>
        </div>
        <Link
          className="button button-dark"
          to={`/inquiry?service=consulting&space=${project.space}&project=${project.slug}`}
        >
          이 공간으로 상담 <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
