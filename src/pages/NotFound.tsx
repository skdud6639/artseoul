import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>다른 작품을 만나볼까요?</h1>
      <p>
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        작품을 둘러보거나 아트서울 홈으로 이동해 주세요.
      </p>
      <div className="button-row">
        <Link className="button button-dark" to="/artworks">
          작품 찾기
        </Link>
        <Link className="button button-outline" to="/">
          홈으로
        </Link>
      </div>
    </section>
  );
}
