interface GalleryInfoProps {
  language: 'ko' | 'en';
}
export default function GalleryInfo({ language }: GalleryInfoProps) {
  const ko = language === 'ko';
  return (
    <section id="info" className="visit-section page-gutter">
      <div className="section-heading">
        <h2>{ko ? '서울아트 방문하기' : 'Visit Seoul Art'}</h2>
        <span className="section-index">04 / VISIT</span>
      </div>
      <div className="visit-grid">
        <div>
          <p className="eyebrow">SEOUL / SAMCHEONG</p>
          <h3>
            {ko ? (
              <>
                예술과 만나는
                <br />
                하나의 공간.
              </>
            ) : (
              <>
                A space to
                <br />
                encounter art.
              </>
            )}
          </h3>
        </div>
        <div className="visit-details">
          <div>
            <h4>{ko ? '오시는 길' : 'Location'}</h4>
            <p>
              {ko
                ? '서울특별시 종로구 삼청로 124'
                : '124 Samcheong-ro, Jongno-gu, Seoul'}
              <br />
              {ko ? '서울아트빌딩' : 'Seoul Art Building'}
            </p>
          </div>
          <div>
            <h4>{ko ? '관람 시간' : 'Opening hours'}</h4>
            <p>
              {ko ? '화요일 — 일요일' : 'Tuesday — Sunday'}
              <br />
              10:00 — 18:00
              <br />
              <span className="muted">
                {ko
                  ? '월요일 및 공휴일 휴관'
                  : 'Closed Mondays and national holidays'}
              </span>
            </p>
          </div>
          <div>
            <h4>{ko ? '관람 및 작품 문의' : 'Visit and artwork inquiries'}</h4>
            <a className="text-link" href="tel:+8227300934">
              +82 (0)2 730 0934 <span aria-hidden="true">↗</span>
            </a>
            <p className="muted">
              {ko
                ? '방문 전 전화로 관람 일정을 확인해 주세요.'
                : 'Please call to confirm your visit.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
