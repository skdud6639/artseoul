import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import galleryImage from '../assets/images/gallery_hero_exhibition_1783483717829.jpg';
import '../styles/services.css';

const principles = [
  {
    title: '공간을 먼저 이해합니다.',
    description:
      '누가 머물고, 어떤 시간이 흐르는 곳인지 묻습니다. 용도와 동선, 빛과 재료에서 작품 선택의 기준을 찾습니다.',
  },
  {
    title: '선택의 이유를 함께 나눕니다.',
    description:
      '작가와 작품의 이야기, 공간과의 관계를 설명합니다. 취향에 더해 크기와 예산, 이용 기간까지 함께 살핍니다.',
  },
  {
    title: '이후의 과정까지 생각합니다.',
    description:
      '작품을 고르는 순간에서 끝나지 않도록. 설치와 인수, 관리, 교체와 회수의 조건을 미리 확인합니다.',
  },
];

export function AboutPage() {
  return (
    <div className="service-page">
      <section className="container svc-about-intro">
        <p className="eyebrow">ABOUT ART SEOUL</p>
        <h1>
          공간을 이해하고,
          <br />
          작품을 연결합니다.
        </h1>
        <div className="svc-about-statement">
          <span>Art belongs where life happens.</span>
          <p>
            아트서울은 일하고, 기다리고, 머무는 공간과 예술을 연결하는 아트
            렌탈·공간 컨설팅 프로젝트입니다. 기업, 병원, 호텔과 브랜드 공간에
            어울리는 작품을 찾고, 공간의 변화에 맞는 이용 방식을 함께
            생각합니다.
          </p>
        </div>
      </section>
      <figure className="container svc-about-image">
        <img
          src={galleryImage}
          alt="사람과 작품이 함께 머무는 공간 참고 이미지"
        />
        <figcaption>
          아트서울이 지향하는 공간 경험을 보여주는 참고 이미지
        </figcaption>
      </figure>
      <section className="container svc-section svc-about-principles">
        <div>
          <p className="eyebrow">OUR APPROACH</p>
          <h2>우리가 작품을 제안하는 방식</h2>
        </div>
        <ol>
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="svc-tint">
        <div className="container svc-section svc-about-services">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>공간에 맞는 두 가지 시작.</h2>
          </div>
          <div>
            <Link to="/rental">
              <div>
                <h3>아트 렌탈</h3>
                <p>원하는 작품과 이용 기간을 중심으로 공간을 구성합니다.</p>
              </div>
              <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
            <Link to="/consulting">
              <div>
                <h3>공간 컨설팅</h3>
                <p>공간의 콘셉트부터 작품과 배치의 방향을 함께 찾습니다.</p>
              </div>
              <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="container svc-section svc-about-contact">
        <div>
          <p className="eyebrow">START A CONVERSATION</p>
          <h2>당신의 공간 이야기를 들려주세요.</h2>
          <p>
            공간의 유형, 지역과 희망 시기를 알려주시면 상담의 시작점이 됩니다.
            설치 가능 지역과 구체적인 일정은 문의 내용을 바탕으로 확인합니다.
          </p>
          <div className="svc-actions">
            <Link className="button button-dark" to="/inquiry">
              상담·견적 요청 <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/support/faq">
              자주 묻는 질문 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="svc-about-note">
          <h3>작품과 공간 자료 안내</h3>
          <p>
            현재 공개된 작품과 공간 콘텐츠는 큐레이션 방향을 보여주는 예시를
            포함합니다. 실제 렌탈 가능 여부와 작품 정보는 상담 단계에서
            확인하며, 예시를 실제 고객의 설치 실적으로 소개하지 않습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
