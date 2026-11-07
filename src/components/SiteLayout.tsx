import { Suspense, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Heart, Menu, Search, X } from 'lucide-react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigationType,
  NavigationType,
} from 'react-router-dom';
import { artworks, artists } from '../catalog';
import { useSelection } from '../state/selection';

const navigation = [
  ['/artworks', '작품 찾기'],
  ['/rental', '아트 렌탈'],
  ['/consulting', '공간 컨설팅'],
  ['/projects', '프로젝트'],
  ['/artists', '작가'],
  ['/about', '아트서울'],
] as const;
const titles: Record<string, string> = {
  '/': '공간에 예술이 머무는 방식',
  '/artworks': '작품 찾기',
  '/rental': '아트 렌탈',
  '/consulting': '공간 아트컨설팅',
  '/projects': '공간 제안과 프로젝트',
  '/artists': '작가',
  '/about': '아트서울 소개',
  '/selection': '관심 작품',
  '/inquiry': '상담·견적 요청',
  '/inquiry/complete': '상담 접수 확인',
  '/support/faq': '자주 묻는 질문',
  '/privacy': '개인정보 안내',
  '/terms': '이용 안내',
  '/rental/terms': '렌탈 조건 안내',
  '/admin/inquiries': '상담 관리',
};

function PageContext() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    const artwork = artworks.find(
      (item) => location.pathname === `/artworks/${item.slug}`,
    );
    const artist = artists.find(
      (item) => location.pathname === `/artists/${item.slug}`,
    );
    const title =
      artwork?.title ??
      artist?.name ??
      titles[location.pathname] ??
      (location.pathname.startsWith('/projects/')
        ? '공간 제안'
        : '페이지를 찾을 수 없습니다');
    document.title = `${title} | ART SEOUL 아트서울`;
    const text = artwork
      ? `${artwork.title}. ${artwork.medium}, ${artwork.widthCm} × ${artwork.heightCm} cm. 공간에 어울리는 작품을 살펴보고 렌탈과 컨설팅을 문의하세요.`
      : '기업·병원·호텔·매장을 위한 아트 렌탈과 공간 컨설팅. 작품 탐색부터 공간 제안, 설치와 교체 계획까지 아트서울과 함께하세요.';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', text);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', text);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.append(robots);
    }
    robots.content =
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/inquiry') ||
      location.pathname === '/selection'
        ? 'noindex, nofollow'
        : 'index, follow';
    if (
      !location.hash &&
      previousPath.current !== location.pathname &&
      navigationType !== NavigationType.Pop
    ) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location, navigationType]);
  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView({ behavior: 'instant' });
      return true;
    };
    if (scrollToTarget()) return;
    // A route's lazy-loaded content may render after the location changes.
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    const main = document.getElementById('main-content');
    if (main) observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);
  return null;
}

export default function SiteLayout() {
  const { ids } = useSelection();
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeMenu = () => {
    mobileMenu.current?.close();
    document.documentElement.classList.remove('menu-open');
    trigger.current?.focus();
  };
  const openMenu = () => {
    mobileMenu.current?.showModal();
    document.documentElement.classList.add('menu-open');
  };
  return (
    <>
      <PageContext />
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      <div className="site-announcement">
        ART FOR EVERY SPACE <span>기업과 공간을 위한 아트 렌탈 · 컨설팅</span>
      </div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="아트서울 홈">
          ART SEOUL<span>아트서울</span>
        </Link>
        <nav className="desktop-navigation" aria-label="주 메뉴">
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button desktop-search"
            to="/artworks"
            aria-label="작품 검색"
          >
            <Search size={19} />
          </Link>
          <Link
            className="icon-button selection-link"
            to="/selection"
            aria-label={`관심 작품 ${ids.length}개`}
          >
            <Heart size={19} />
            <span>{ids.length}</span>
          </Link>
          <Link className="header-inquiry" to="/inquiry">
            상담·견적 요청
            <ArrowUpRight size={15} />
          </Link>
          <button
            ref={trigger}
            type="button"
            className="icon-button menu-trigger"
            onClick={openMenu}
            aria-label="메뉴 열기"
            aria-haspopup="dialog"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      <dialog
        className="mobile-menu"
        ref={mobileMenu}
        onCancel={closeMenu}
        onClose={() => document.documentElement.classList.remove('menu-open')}
        aria-label="전체 메뉴"
      >
        <div className="mobile-menu-top">
          <Link className="brand" to="/" onClick={closeMenu}>
            ART SEOUL
          </Link>
          <button
            className="icon-button"
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </button>
        </div>
        <nav aria-label="모바일 주 메뉴">
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={closeMenu}>
              {label}
              <ArrowUpRight size={20} />
            </NavLink>
          ))}
        </nav>
        <Link to="/inquiry" className="button button-dark" onClick={closeMenu}>
          공간 맞춤 상담
          <ArrowRight size={18} />
        </Link>
        <Link to="/selection" className="text-link" onClick={closeMenu}>
          관심 작품 {ids.length}개 보기
        </Link>
        <div className="mobile-menu-legal">
          <Link to="/support/faq" onClick={closeMenu}>
            자주 묻는 질문
          </Link>
          <Link to="/privacy" onClick={closeMenu}>
            개인정보 안내
          </Link>
        </div>
      </dialog>
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="container page-loading" role="status">
              화면을 불러오고 있습니다.
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="container footer-main">
          <div>
            <Link className="brand footer-brand" to="/">
              ART SEOUL
            </Link>
            <p>
              예술과 공간 사이,
              <br />
              오래 이어지는 좋은 관계.
            </p>
            <span className="eyebrow">ART RENTAL & ADVISORY</span>
          </div>
          <div className="footer-column">
            <h2>Explore</h2>
            <Link to="/artworks">작품 찾기</Link>
            <Link to="/artists">작가</Link>
            <Link to="/projects">공간 제안</Link>
          </div>
          <div className="footer-column">
            <h2>Services</h2>
            <Link to="/rental">아트 렌탈</Link>
            <Link to="/consulting">공간 컨설팅</Link>
            <Link to="/inquiry">상담·견적 요청</Link>
          </div>
          <div className="footer-column">
            <h2>Information</h2>
            <Link to="/about">아트서울 소개</Link>
            <Link to="/support/faq">자주 묻는 질문</Link>
            <Link to="/rental/terms">렌탈 조건 안내</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} ART SEOUL</span>
          <p>
            작품과 공간 이미지는 큐레이션 예시입니다. 실제 제공 작품과 조건은
            별도 확인이 필요합니다.
          </p>
          <div>
            <Link to="/terms">이용 안내</Link>
            <Link to="/privacy">개인정보 안내</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
